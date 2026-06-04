import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// HELPERS

// Convert time 12hrs to number of minutes since midnight
// It will return AM / PM
const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() == "PM") h += 12;
  return h * 60 + (mm || 0);
};

// This function will remove duplicate slot and return the slot filter by time
function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    if (!Array.isArray(slots)) return;
    const uniq = Array.from(new Set(slots));
    uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    out[date] = uniq;
  });
  return out;
}

// This function accepts the OBJ or JSON STRING
function parseScheduleInput(s) {
  if (!s) return {};
  if (typeof s === "string") {
    try {
      s = JSON.parse(s);
    } catch (error) {
      return {};
    }
  }
  return dedupeAndSortSchedule(s || {});
}

// This function coverts the doctor data into plain text
function normalizeDocForClient(raw = {}) {
  const doc = { ...raw };

  // convert Mongoose Map to plain object
  if (doc.schedule && typeof doc.schedule.forEach === "function") {
    const obj = {};
    doc.schedule.forEach((val, key) => {
      obj[key] = Array.isArray(val) ? val : [];
    });
    doc.schedule = obj;
  } else if (!doc.schedule || typeof doc.schedule !== "object") {
    doc.schedule = {};
  }

  doc.availability =
    doc.availability === undefined ? "Available" : doc.availability;
  doc.patients = doc.patients ?? "";
  doc.rating = doc.rating ?? 0;
  doc.fee = doc.fee ?? 0;

  return doc;
}

// To create a Doctor object
export async function createDoctor(req, res) {
  try {
    const body = req.body || {};
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const emailLC = (body.email || "").toLowerCase();
    if (await Doctor.findOne({ email: emailLC })) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublicId || null;
    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
      imagePublicId =
        uploaded?.public_id || uploaded?.publicId || imagePublicId;
    }

    const schedule = parseScheduleInput(body.schedule);

    const rating = Number(body.rating);
    existing.rating = Number.isFinite(rating) ? rating : 0;

    const fees = Number(body.fee);
    existing.fee = Number.isFinite(fees) ? fees : 0;

    // new doc object
    const doc = new Doctor({
      email: emailLC,
      password: body.password,
      name: body.name,
      specialization: body.specialization || "",
      imageUrl,
      imagePublicId,
      availability: body.availability || "Available",
      experience: body.experience || "",
      qualifications: body.qualifications || "",
      location: body.location || "",
      about: body.about || "",
      fee: fees || 0,
      schedule,
      success: body.success || "",
      patients: body.patients || "",
      rating: Number.isFinite(rating) ? rating : 0,
    });

    await doc.save();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn("JWT secret is not defined");
      return res.status(500).json({
        success: false,
        message: "Server misconfigured",
      });
    }

    const token = jwt.sign(
      { id: doc._id.toString(), email: doc.email, role: "doctor" },
      secret,
      { expiresIn: "7d" },
    );

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.status(201).json({
      success: true,
      data: out,
      token,
    });
  } catch (err) {
    console.error("create doctor error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// TO GET DOCTOR
export const getDoctors = async (req, res) => {
  try {
    const { q = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 200));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const match = {};
    if (q && typeof q === "string" && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      match.$or = [
        { name: re },
        { specialization: re },
        { speciality: re },
        { email: re },
      ];
    }

    const docs = await Doctor.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "appointments",
          let: { doctorId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$doctorId", "$$doctorId"] },
              },
            },
            {
              $project: {
                status: 1,
                fees: 1,
              },
            },
          ],
          as: "appointments",
        },
      },
      {
        $addFields: {
          appointmentsCount: { $size: "$appointments" },
          appointmentsCompleted: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] },
              },
            },
          },
          appointmentsCanceled: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $eq: ["$$a.status", "Canceled"] },
              },
            },
          },
          earnings: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$appointments",
                    as: "a",
                    cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] },
                  },
                },
                as: "p",
                in: { $ifNull: ["$$p.fees", 0] },
              },
            },
          },
        },
      },
      { $project: { appointments: 0 } },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const normalized = docs.map((data) => ({
      _id: data._id,
      id: data._id,
      name: data.name || "",
      specialization: data.specialization || data.speciality || "",
      fee: data.fee ?? data.fees ?? data.consultationFee ?? 0,
      imageUrl: data.imageUrl || data.image || data.avatar || null,
      appointmentsCount: data.appointmentsCount || 0,
      appointmentsCompleted: data.appointmentsCompleted || 0,
      appointmentsCanceled: data.appointmentsCanceled || 0,
      earnings: data.earnings || 0,
      availability: data.availability ?? "Available",
      schedule:
        data.schedule && typeof data.schedule === "object" ? data.schedule : {},
      patients: data.patients ?? "",
      rating: data.rating ?? 0,
      about: data.about ?? "",
      experience: data.experience ?? "",
      qualifications: data.qualifications ?? "",
      location: data.location ?? "",
      success: data.success ?? "",
      raw: data,
    }));

    const total = await Doctor.countDocuments(match);
    return res.json({
      success: true,
      data: normalized,
      doctors: normalized,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (err) {
    console.error("get doctors error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// TO GET DOCTOR BY ID
export async function getDoctorsById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doc = await Doctor.findById(id).select("-password").lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      data: normalizeDocForClient(doc),
    });
  } catch (err) {
    console.error("get doctorsbyId error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// TO UPDATE DOCTOR
export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this doctor",
      });
    }

    const existing = await Doctor.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });

    // UPLOAD IMAGE IF EXISTS ELSE SHOW A WARNING
    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      if (uploaded) {
        const previousPublicId = existing.imagePublicId;
        existing.imageUrl =
          uploaded.secure_url || uploaded.url || existing.imageUrl;
        existing.imagePublicId =
          uploaded.public_id || uploaded.publicId || existing.imagePublicId;
        if (previousPublicId && previousPublicId !== existing.imagePublicId) {
          deleteFromCloudinary(previousPublicId).catch((e) =>
            console.warn("deleteFromCloudinary warning:", e?.message || e),
          );
        }
      }
    } else if (body.imageUrl) {
      existing.imageUrl = body.imageUrl;
    }

    if (body.schedule) existing.schedule = parseScheduleInput(body.schedule);

    const updatable = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "availability",
      "success",
      "patients",
      "rating",
    ];
    updatable.forEach((k) => {
      if (body[k] !== undefined) existing[k] = body[k];
    });

    if (body.email && body.email !== existing.email) {
      const other = await Doctor.findOne({ email: body.email.toLowerCase() });
      if (other && other._id.toString() !== id)
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      existing.email = body.email.toLowerCase();
    }

    if (body.password) existing.password = body.password;

    await existing.save();

    const out = normalizeDocForClient(existing.toObject());
    delete out.password;
    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("updateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// TO DELETE A PARTICULAR DOCTOR
export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this doctor",
      });
    }

    const existing = await Doctor.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (err) {
        console.warn("Delete from clodinary warning:", err?.message || err);
      }
    }

    await Doctor.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (err) {
    console.error("Delete doctor error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// TO TOGGLE DOCTOR AVAILABILITY
export async function toggleAvailability(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this doctor's availability",
      });
    }

    const doc = await Doctor.findById(id);
    if (!doc) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (typeof doc.availability === "boolean") {
      doc.availability = !doc.availability;
    } else {
      doc.availability =
        doc.availability === "Available" ? "Unavailable" : "Available";
    }

    await doc.save();
    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("Toggle availability error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// TO LOGIN A DOCTOR
export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const doc = await Doctor.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!doc) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doc.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server Misconfigured. Please contact admin...",
      });
    }

    const token = jwt.sign(
      {
        id: doc._id.toString(),
        email: doc.email,
        role: "doctor",
      },
      secret,
      { expiresIn: "7d" },
    );

    const out = doc.toObject();
    delete out.password;

    return res.json({ success: true, token, data: out });
  } catch (err) {
    console.error("Doctor login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
