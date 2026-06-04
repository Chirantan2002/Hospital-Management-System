import Service from "../models/Service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// HELPERS

// This function convertes array like input into clean array
// When the input is empty or invalid, it simply returns an empty array -> []
const parseJsonArrayFields = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return typeof parsed === "object" ? [parsed] : [];
    } catch {
      return field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// This function takes date-time slot and group them into a YYYY-MM-DD format with the time
function normalizeSlotsToMap(slotStrings = []) {
  const map = {};
  slotStrings.forEach((raw) => {
    const m = raw.match(
      /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
    );
    if (!m) {
      // Keep raw in an unspecified bucket
      map["unspecified"] = map["unspecified"] || [];
      map["unspecified"].push(raw);
      return;
    }
    const [, day, monShort, year, hour, minute, ampm] = m;
    const monthIdx = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].findIndex((x) => x.toLowerCase() === monShort.toLowerCase());
    const mm = String(monthIdx + 1).padStart(2, "0");
    const dd = String(Number(day)).padStart(2, "0");
    const dateKey = `${year}-${mm}-${dd}`; // YYYY-MM-DD
    const timeStr = `${String(Number(hour)).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm.toUpperCase()}`;
    map[dateKey] = map[dateKey] || [];
    map[dateKey].push(timeStr);
  });
  return map;
}

const sanitizePrice = (v) =>
  Number(String(v ?? "0").replace(/[^\d.-]/g, "")) || 0;
const parseAvailability = (v) => {
  const s = String(v ?? "available").toLowerCase();
  return s === "available" || s === "true";
};

// FUNCTION TO CREATE SERVICE
export async function createService(req, res) {
  try {
    const b = req.body || {};
    const instructions = parseJsonArrayFields(b.instructions);
    const rawSlots = parseJsonArrayFields(b.slots);
    const slots = normalizeSlotsToMap(rawSlots);
    const numericalPrice = sanitizePrice(b.price);
    const available = parseAvailability(b.available);

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const service = new Service({
      name: b.name,
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericalPrice,
      available,
      instructions,
      slots,
      imageUrl,
      imagePublicId,
    });

    const saved = await service.save();

    return res.status(201).json({
      success: true,
      data: saved,
      message: "Service created successfully...",
    });
  } catch (err) {
    console.error("Create service error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// FUNCTION TO GET SERVICES
export async function getServices(req, res) {
  try {
    const list = await Service.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: list,
      message: "Services fetched successfully...",
    });
  } catch (err) {
    console.error("Get service error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// FUNCTION TO GET SERVICE BY ID
export async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).lean();
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
      message: "Service fetched successfully...",
    });
  } catch (err) {
    console.error("Get servicebyId error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// FUNCTION FOR UPDATING THE SERVICE
export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const b = req.body || {};
    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updateData = {};

    // to update each field, if already exists then simple update them
    if (b.name !== undefined) updateData.name = b.name;
    if (b.about !== undefined) updateData.about = b.about;
    if (b.shortDescription !== undefined)
      updateData.shortDescription = b.shortDescription;
    if (b.price !== undefined) updateData.price = sanitizePrice(b.price);
    if (b.availability !== undefined)
      updateData.availability = parseAvailability(b.availability);
    if (b.instructions !== undefined)
      updateData.instructions = parseJsonArrayFields(b.instructions);
    if (b.slots !== undefined)
      updateData.slots = normalizeSlotsToMap(parseJsonArrayFields(b.slots));

    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        if (up?.secure_url) {
          updateData.imageUrl = up?.secure_url;
          updateData.imagePublicId = up?.public_id || null;
          if (existing.imagePublicId) {
            // It will remove the old image from cloudinary & replace it with new image
            try {
              await deleteFromCloudinary(existing.imagePublicId);
            } catch (err) {
              console.error("Cloudinary delete error:", err?.message || err);
            }
          }
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Service updated successfully...",
    });
  } catch (err) {
    console.error("Update service error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// TO DELETE A PARTICULAR SERVICE
export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (err) {
        console.warn(
          "Failed to delete image from cloudinary:",
          err?.message || err,
        );
      }
    }

    await existing.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Service deleted successfully...",
    });
  } catch (err) {
    console.error("Delete service error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
