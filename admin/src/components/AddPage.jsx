import { useEffect, useState, useRef } from "react";
import { doctorDetailStyles as dds } from "../assets/dummyStyles";
import {
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  UserPlusIcon,
  XCircle,
} from "lucide-react";

// HELPER FUNCTIONS
const timeStringToMinutes = (t) => {
  if (!t) return 0;
  const [hhmm, ampm] = t.split(" ");
  let [h, m] = hhmm.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const formDateISO = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const dateObj = new Date(Number(y), Number(m - 1), Number(d));
  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(Number(d));
  const month = monthName[dateObj.getMonth()] || "";
  return `${day} ${month} ${y}`;
};

const AddPage = () => {
  const [doctorList, setDoctorList] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    imageFile: null,
    imagePreview: "",
    experience: "",
    qualifications: "",
    location: "",
    about: "",
    fee: "",
    success: "",
    patients: "",
    rating: "",
    schedule: {},
    availability: "Available",
    email: "",
    password: "",
  });

  const [slotDate, setSlotDate] = useState("");
  const [slotHour, setSlotHour] = useState("");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmpm, setSlotAmpm] = useState("AM");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [today] = useState(() => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().split("T")[0];
  });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 3000);
    return () => clearTimeout(t);
  }, [toast.show]);

  const showToast = (message, type) => setToast({ show: true, message, type });

  const handleImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (form.imagePreview && form.imageFile) {
      try {
        URL.revokeObjectURL(form.imagePreview);
      } catch (err) {}
    }
    setForm((p) => ({
      ...p,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const removeImage = () => {
    if (form.imagePreview && form.imageFile) {
      try {
        URL.revokeObjectURL(form.imagePreview);
      } catch (err) {}
    }

    setForm((p) => ({
      ...p,
      imageFile: null,
      imagePreview: "",
    }));

    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = "";
      } catch (err) {}
    }
  };

  const addSlotToForm = () => {
    if (!slotDate || !slotHour) {
      showToast("Select date and time", "error");
      return;
    }
    if (slotDate < today) {
      showToast("Cannot add a slot in the past", "error");
      return;
    }

    const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

    if (slotDate === today) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = timeStringToMinutes(time);

      if (slotMinutes <= nowMinutes) {
        showToast("Cannot add a time that has already passed today", "error");
        return;
      }
    }

    setForm((f) => {
      const sched = { ...f.schedule };
      if (!sched[slotDate]) sched[slotDate] = [];
      if (!sched[slotDate].includes(time)) sched[slotDate].push(time);

      sched[slotDate] = sched[slotDate].sort(
        (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
      );

      return {
        ...f,
        schedule: sched,
      };
    });

    setSlotHour("");
    setSlotMinute("00");
  };

  const removeSlot = (date, time) => {
    setForm((f) => {
      const sched = { ...f.schedule };
      sched[date] = sched[date].filter((t) => t !== time);
      if (!sched[date].length) delete sched[date];
      return {
        ...f,
        schedule: sched,
      };
    });
  };

  const getFlatSlots = (s = {}) => {
    const arr = [];
    Object.keys(s)
      .sort()
      .forEach((d) => {
        (s[d] || []).forEach((t) => arr.push({ date: d, time: t }));
      });
    return arr;
  };

  const validate = (f) => {
    const req = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "success",
      "patients",
      "rating",
      "email",
      "password",
    ];

    for (let k of req) if (!f[k]) return false;
    if (!f.imageFile) return false;
    if (!Object.keys(f.schedule).length) return false;
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate(form)) {
      showToast("All fields are required", "error");
      return;
    }

    const r = Number(form.rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      showToast("Rating must be between 1 and 5", "error");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("specialization", form.specialization || "");
      fd.append("experience", form.experience || "");
      fd.append("qualifications", form.qualifications || "");
      fd.append("location", form.location || "");
      fd.append("about", form.about || "");
      fd.append("fee", form.fee === "" ? "0" : String(form.fee));
      fd.append("success", form.success || "");
      fd.append("patients", form.patients || "");
      fd.append("rating", form.rating === "" ? "0" : String(form.rating));
      fd.append("availability", form.availability || "Available");
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("schedule", JSON.stringify(form.schedule || {}));

      if (form.imageFile) fd.append("image", form.imageFile);

      const API_BASE = "https://caresync-backend-rxz5.onrender.com/api"; // NEED TO CHANGE THIS LATER FOR DEPLUYMENT

      const res = await fetch(`${API_BASE}/doctors`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Server error (${res.status})`;
        showToast("error", msg);
        setLoading(false);
        return;
      }

      showToast("Doctor added successfully", "success");

      if (data?.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (err) {}
      }

      const doctorFromServer = data?.data
        ? data.data
        : { id: Date.now(), ...form, imageUrl: form.imagePreview };

      setDoctorList((old) => [doctorFromServer, ...old]);

      // Cleanup: revoke object URL if used
      if (form.imagePreview && form.imageFile) {
        try {
          URL.revokeObjectURL(form.imagePreview);
        } catch (err) {}
      }

      // Reset the form
      setForm({
        name: "",
        specialization: "",
        imageFile: null,
        imagePreview: "",
        experience: "",
        qualifications: "",
        location: "",
        about: "",
        fee: "",
        success: "",
        patients: "",
        rating: "",
        schedule: {}, // IMPORTANT BUG FIX
        availability: "Available",
        email: "",
        password: "",
      });

      if (fileInputRef.current) {
        try {
          fileInputRef.current.value = "";
        } catch (err) {}
      }

      setSlotDate("");
      setSlotHour("");
      setSlotMinute("00");
      setShowPassword(false);
    } catch (err) {
      console.error("Submit error: ", err);
      showToast("Network or server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${dds.pageContainer}`}>
      <div className={`${dds.maxWidthContainerLg} ${dds.headerContainer}`}>
        <div className={`${dds.headerFlexContainer}`}>
          <div className={`${dds.headerIconContainer}`}>
            <UserPlusIcon className="text-white" size={32} />
          </div>
          <h1 className={`${dds.headerTitle}`}>Add new doctor</h1>
        </div>
      </div>

      {/* FORM */}
      <div className={`${dds.maxWidthContainer} ${dds.formContainer}`}>
        <form onSubmit={handleAdd} className={`${dds.formGrid}`}>
          <div className="md:col-span-2">
            <label className={`${dds.label}`}>Upload Profile Picture</label>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImage}
                placeholder="Upload"
                className={`${dds.fileInput} cursor-pointer`}
              />

              {form.imagePreview && (
                <div className={`relative group`}>
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className={`${dds.imagePreview}`}
                  />

                  <button
                    onClick={removeImage}
                    className={`${dds.removeImageButton} cursor-pointer`}
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            className={`${dds.inputBase}`}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Qualifications"
            value={form.qualifications}
            onChange={(e) =>
              setForm({ ...form, qualifications: e.target.value })
            }
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Consultation Fee"
            value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) => {
              const v = e.target.value;

              if (v === "") {
                setForm((p) => ({ ...p, rating: "" }));
                return;
              }

              const n = Number(v);
              if (Number.isNaN(n)) return;

              // Clamp b/w 1 and 5
              const clamped = Math.max(1, Math.min(5, n));

              // Keep only 1 decimal place
              const fixed = Math.round(clamped * 10) / 10;

              setForm((p) => ({ ...p, rating: fixed.toString() }));
            }}
            onBlur={() => {
              // Force 1 decimal place of blur
              setForm((p) => {
                if (!p.rating) return p;
                const n = Number(p.rating);
                if (Number.isNaN(n)) return { ...p, rating: "" };

                const clamped = Math.max(1, Math.min(5, n));
                return { ...p, rating: clamped.toFixed(1) };
              });
            }}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Patients"
            value={form.patients}
            onChange={(e) => setForm({ ...form, patients: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="Success Rate"
            value={form.success}
            onChange={(e) => setForm({ ...form, success: e.target.value })}
          />

          <input
            className={`${dds.inputBase}`}
            placeholder="email@example.com"
            value={form.email}
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className={`relative`}>
            <input
              className={`${dds.inputBase} ${dds.inputWithIcon}`}
              placeholder="Doctor Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className={`${dds.passwordToggleButton} cursor-pointer`}
            >
              {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>

          <select
            className={`${dds.inputBase}`}
            value={form.availability}
            onChange={(e) =>
              setForm({
                ...form,
                availability: e.target.value,
              })
            }
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <textarea
            className={`${dds.textareaBase} md:col-span-2`}
            rows={3}
            placeholder="About Doctor"
            value={form.about}
            onChange={(e) => {
              setForm({
                ...form,
                about: e.target.value,
              });
            }}
          ></textarea>

          {/* SCHEDULE PART */}
          <div className={`${dds.scheduleContainer} md:col-span-2`}>
            <div className={`${dds.scheduleHeader}`}>
              <Calendar className="text-emerald-600" />
              <p className={`${dds.scheduleTitle} mona-sans-700`}>
                Add Schedule
              </p>
            </div>

            <div className={`${dds.scheduleInputsContainer}`}>
              <input
                type="date"
                value={slotDate}
                min={today}
                onChange={(e) => setSlotDate(e.target.value)}
                className={`${dds.scheduleDateInput}`}
              />

              <select
                value={slotHour}
                onChange={(e) => setSlotHour(e.target.value)}
                className={`${dds.scheduleTimeSelect}`}
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={slotMinute}
                onChange={(e) => setSlotMinute(e.target.value)}
                className={`${dds.scheduleTimeSelect}`}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                value={slotAmpm}
                onChange={(e) => setSlotAmpm(e.target.value)}
                className={`${dds.scheduleTimeSelect}`}
              >
                <option>AM</option>
                <option>PM</option>
              </select>

              <button
                type="button"
                onClick={addSlotToForm}
                className={`${dds.addSlotButton} cursor-pointer`}
              >
                <Plus size={18} /> Add slot
              </button>
            </div>

            <div className={dds.slotsGrid}>
              {getFlatSlots(form.schedule || {}).map(({ date, time }) => (
                <div
                  key={date + time}
                  className={`${dds.slotItem} cursor-pointer`}
                >
                  <span>
                    {formDateISO(date)} - {time}
                  </span>
                  <button
                    onClick={() => removeSlot(date, time)}
                    className={`text-rose-500`}
                    aria-label={`Remove slot ${date} ${time}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={dds.submitButtonContainer}>
            <button
              type="submit"
              disabled={loading}
              className={`${dds.submitButton} cursor-pointer ${loading ? dds.submitButtonDisabled : dds.submitButtonEnabled}`}
            >
              {loading ? "Adding..." : "Add Doctor to Team"}
            </button>
          </div>
        </form>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div
          className={`${dds.toastContainer} ${toast.type === "success" ? dds.toastSuccess : dds.toastError}`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={22} />
          ) : (
            <XCircle size={22} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIMPLE OVERVIEW */}
      <div className={`${dds.doctorListContainer}`}>
        {doctorList.length > 0 ? (
          <div className={`${dds.doctorListGrid}`}>
            {doctorList.map((d) => (
              <div key={d.id || d._id} className={`${dds.doctorCard}`}>
                <div className={`${dds.doctorCardContent}`}>
                  <img
                    src={d.imageUrl || d.imagePreview}
                    alt={d.name}
                    className={`${dds.doctorImage}`}
                  />

                  <div>
                    <div className={`${dds.doctorName}`}>{d.name}</div>
                    <div className={`${dds.doctorSpecialization}`}>
                      {d.specialization}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${dds.emptyState}`}>No doctor yet</p>
        )}
      </div>
    </div>
  );
};

export default AddPage;
