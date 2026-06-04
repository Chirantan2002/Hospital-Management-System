import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  BadgeIndianRupee,
  RefreshCw,
  ArrowRight,
  Clock,
} from "lucide-react";
import { dashboardStyles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000";

const parseDateTime = (date, time) => {
  return new Date(`${date}T${time}:00`);
};

const formatTimeAMPM = (time24) => {
  if (!time24) return "";
  const [hh, mm] = time24.split(":");
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const backendToFrontendStatus = (s) => {
  if (!s) return "pending";
  const v = String(s).toLowerCase();
  if (v === "pending") return "pending";
  if (v === "confirmed") return "confirmed";
  if (v === "completed") return "complete";
  if (v === "canceled" || v === "cancelled") return "cancelled";
  if (v === "rescheduled") return "rescheduled";
  return v;
};

const frontendToBackendStatus = (fs) => {
  if (!fs) return "Pending";
  const v = String(fs).toLowerCase();
  if (v === "pending") return "Pending";
  if (v === "confirmed") return "Confirmed";
  if (v === "complete") return "Completed";
  if (v === "cancelled") return "Canceled";
  if (v === "rescheduled") return "Rescheduled";
  return fs;
};

const to24Hour = (timeStr) => {
  if (!timeStr) return "00:00";
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return timeStr;
  let hh = Number(m[1]);
  const mm = m[2];
  const ampm = m[3];
  if (!ampm) {
    return `${String(hh).padStart(2, "0")}:${mm}`;
  }
  const up = ampm.toUpperCase();
  if (up === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  return `${String(hh).padStart(2, "0")}:${mm}`;
};

const to12HourFrom24 = (hhmm) => {
  if (!hhmm) return "12:00 AM";
  const [hh, mm] = hhmm.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${String(h12)}:${String(mm).padStart(2, "0")} ${ampm}`;
};

const normalizeAppointment = (a) => {
  if (!a) return null;
  const id = a._id || a.id || String(Math.random()).slice(2);
  const patient = a.patientName || a.patient || a.name || "Unknown";
  const age = a.age ?? a.patientAge ?? "";
  const gender = a.gender || "";
  const doctorName =
    (a.doctorId && typeof a.doctorId === "object" && a.doctorId.name) ||
    a.doctorName ||
    a.doctor ||
    "Doctor";

  const doctorImage =
    (a.doctorId && typeof a.doctorId === "object" && a.doctorId.imageUrl) ||
    a.doctorImage ||
    a.doctorImageUrl ||
    "";

  const speciality =
    (a.doctorId && (a.doctorId.specialization || a.doctorId.speciality)) ||
    a.speciality ||
    a.specialization ||
    "";
  const mobile = a.mobile || a.phone || "";
  const fee = Number(a.fees ?? a.fee ?? a.payment?.amount ?? 0) || 0;
  const date = a.date || (a.slot && a.slot.date) || "";
  const rawTime =
    a.time ||
    (a.slot && a.slot.time) ||
    (a.hour != null && a.minute != null
      ? `${String(a.hour).padStart(2, "0")}:${String(a.minute).padStart(
          2,
          "0",
        )}`
      : "");
  const time24 = to24Hour(rawTime);
  const status = backendToFrontendStatus(
    a.status || (a.payment && a.payment.status) || "Pending",
  );
  return {
    id,
    patient,
    age,
    gender,
    doctorName,
    doctorImage,
    speciality,
    mobile,
    date,
    time: time24,
    fee,
    status,
    raw: a,
  };
};

export default function DashboardPage({ apiBase }) {
  const params = useParams();
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  location.search;
  
  const API = apiBase || API_BASE;

  const doctorId = params.id;

  async function fetchAppointments() {
    setLoading(true);
    setError(null);
    try {
      const basePath = `${API}/api/appointments/doctor/${encodeURIComponent(
        doctorId,
      )}`;
      const url = `${basePath}`;
      // console.log(url);

      const res = await fetch(url);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `Failed to fetch appointments (${res.status})`,
        );
      }
      const body = await res.json();
      
      // console.log("API RESPONSE:", body);

      const list = Array.isArray(body.appointments)
        ? body.appointments
        : Array.isArray(body)
          ? body
          : (body.items ?? body.data ?? []);

      const normalized = (Array.isArray(list) ? list : [])
        .map(normalizeAppointment)
        .filter(Boolean);

      setAppointments(normalized);
    } catch (err) {
      console.error("fetchAppointments:", err);
      setError(err.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, [API, doctorId]);

  const sorted = useMemo(() => {
    return [...appointments].sort(
      (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time),
    );
  }, [appointments]);

  const top8 = sorted.slice(0, 12);

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "complete",
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled",
  ).length;
  const totalEarnings = appointments
    .filter((a) => a.status === "complete")
    .reduce((s, a) => s + (Number(a.fee) || 0), 0);

  async function updateStatusRemote(id, newStatusFrontend) {
    const appt = appointments.find((p) => p.id === id);
    if (!appt) return;
    if (appt.status === "complete" || appt.status === "cancelled") return;

    const backendStatus = frontendToBackendStatus(newStatusFrontend);
    setAppointments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatusFrontend } : p)),
    );

    try {
      const res = await fetch(`${API}/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus }),
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `Status update failed (${res.status})`,
        );
      }
      const data = await res.json();
      const updated = data.appointment || data;

      setAppointments((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;

          const mergedRaw = { ...(p.raw || {}), ...(updated || {}) };

          const normalized = normalizeAppointment(mergedRaw);
          if (normalized) return normalized;
          return {
            ...p,
            status: backendToFrontendStatus(updated.status || backendStatus),
            raw: mergedRaw,
          };
        }),
      );
    } catch (err) {
      console.error("updateStatusRemote:", err);
      setAppointments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: appt.status } : p)),
      );
      setError(err.message || "Failed to update status");
    }
  }

  async function rescheduleRemote(id, newDate, newTime24) {
    const appt = appointments.find((p) => p.id === id);
    if (!appt) return;
    if (appt.status === "complete" || appt.status === "cancelled") return;

    const hhmm = newTime24;
    const time12 = to12HourFrom24(hhmm);
    setAppointments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, date: newDate, time: hhmm, status: "rescheduled" }
          : p,
      ),
    );

    try {
      const res = await fetch(`${API}/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: time12 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Reschedule failed (${res.status})`);
      }
      const data = await res.json();
      const updated = data.appointment || data;

      setAppointments((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const mergedRaw = { ...(p.raw || {}), ...(updated || {}) };

          const normalized = normalizeAppointment(mergedRaw);
          if (normalized) return normalized;
          return {
            ...p,
            date: newDate,
            time: hhmm,
            status: backendToFrontendStatus(updated.status || "Rescheduled"),
            raw: mergedRaw,
          };
        }),
      );
    } catch (err) {
      console.error("rescheduleRemote:", err);
      setError(err.message || "Failed to reschedule");
      await fetchAppointments();
    }
  }

  function updateStatus(id, newStatus) {
    updateStatusRemote(id, newStatus);
  }

  function updateDateTime(id, newDate, newTime) {
    rescheduleRemote(id, newDate, newTime);
  }

  console.log("appointments:", appointments);
  console.log("first appointment:", appointments[0]);
  console.log("raw:", appointments[0]?.raw);

  const doctorNameFromData = appointments[0]?.doctorName || null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-xl google-sans-500 text-slate-800">
              {doctorNameFromData
                ? `${doctorNameFromData} — Dashboard`
                : "Doctor Dashboard"}
            </h1>
            <p className="text-sm google-sans-400 text-slate-500 mt-1">
              {doctorId
                ? `Showing appointments for doctor ${doctorId}`
                : "Overview of latest appointments & earnings"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs google-sans-400 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500">
              {loading ? "Loading..." : `${appointments.length} total`}
            </span>
            <button
              onClick={fetchAppointments}
              className="google-sans-400 flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            title="Total appointments"
            value={totalAppointments}
            icon={<Calendar size={18} />}
            color="teal"
          />
          <StatCard
            title="Total earnings"
            value={`₹${totalEarnings}`}
            icon={<BadgeIndianRupee size={18} />}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={completedAppointments}
            icon={<CheckCircle size={18} />}
            color="green"
          />
          <StatCard
            title="Cancelled"
            value={cancelledAppointments}
            icon={<XCircle size={18} />}
            color="red"
          />
        </div>

        {/* Appointments section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <h2 className="text-base google-sans-500 text-slate-800">
              Latest appointments
            </h2>
            <span className="flex items-center gap-1.5 text-xs google-sans-400 text-slate-500">
              <Users size={13} /> {totalAppointments} total
            </span>
          </div>

          {loading && (
            <p className="text-center text-sm text-slate-400 py-10">
              Loading appointments...
            </p>
          )}
          {error && (
            <p className="text-center text-sm text-red-500 py-6">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {top8.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onStatusChange={(s) => updateStatus(a.id, s)}
                onReschedule={(d, t) => updateDateTime(a.id, d, t)}
              />
            ))}
          </div>

          <div className="mt-5 text-center">
            <Link
              to={
                doctorId
                  ? `/doctor-admin/${doctorId}/appointments`
                  : "/appointments"
              }
              className="inline-flex items-center gap-1.5 text-sm px-5 py-2 rounded-lg bg-slate-100 border google-sans-400 border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Show all appointments <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    teal: { bg: "bg-teal-50", text: "text-teal-700" },
    amber: { bg: "bg-amber-50", text: "text-amber-700" },
    green: { bg: "bg-green-50", text: "text-green-700" },
    red: { bg: "bg-red-50", text: "text-red-700" },
  };
  const c = colors[color] || colors.teal;
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs google-sans-400 text-slate-500">{title}</p>
        <p className="text-xl google-sans-500 text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    complete: "bg-green-50  text-green-700  border-green-200",
    cancelled: "bg-red-50    text-red-700    border-red-200",
    confirmed: "bg-blue-50   text-blue-700   border-blue-200",
    rescheduled: "bg-amber-50  text-amber-700  border-amber-200",
    pending: "bg-slate-100 text-slate-600  border-slate-200",
  };
  const labels = {
    complete: "Completed",
    cancelled: "Cancelled",
    confirmed: "Confirmed",
    rescheduled: "Rescheduled",
    pending: "Pending",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[status] || map.pending}`}
    >
      {labels[status] || "Pending"}
    </span>
  );
}

function StatusSelect({ appointment, onChange }) {
  const terminal =
    appointment.status === "complete" || appointment.status === "cancelled";

  if (appointment.status === "rescheduled") {
    return (
      <select
        value={appointment.status}
        onChange={(e) => onChange(e.target.value)}
        className={`${dashboardStyles.statusSelect} ${
          terminal
            ? dashboardStyles.statusSelectDisabled
            : dashboardStyles.statusSelectEnabled
        }`}
        title="Change status (only Completed or Cancelled allowed after reschedule)"
      >
        <option value="rescheduled" disabled>
          Rescheduled
        </option>
        <option value="complete">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    );
  }

  const options = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "complete", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <select
      value={appointment.status}
      onChange={(e) => onChange(e.target.value)}
      disabled={terminal}
      className={`${dashboardStyles.statusSelect} ${
        terminal
          ? dashboardStyles.statusSelectDisabled
          : dashboardStyles.statusSelectEnabled
      }`}
      title={terminal ? "Status cannot be changed" : "Change status"}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-sm">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function RescheduleButton({ appointment, onReschedule }) {
  const terminal =
    appointment.status === "complete" || appointment.status === "cancelled";
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const minDate = React.useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  React.useEffect(() => {
    const apptRaw = appointment.date ? String(appointment.date) : "";
    const apptDate = apptRaw.slice(0, 10);

    setDate(apptDate && apptDate >= minDate ? apptDate : minDate);
    setTime(appointment.time || "09:00");
  }, [appointment.date, appointment.time, minDate]);

  function save() {
    if (!date || !time) return;
    if (date < minDate) {
      setDate(minDate);
      return;
    }
    onReschedule(date, time);
    setEditing(false);
  }

  function cancel() {
    const apptRaw = appointment.date ? String(appointment.date) : "";
    const apptDate = apptRaw.slice(0, 10);
    setDate(apptDate && apptDate >= minDate ? apptDate : minDate);
    setTime(appointment.time || "09:00");
    setEditing(false);
  }

  return (
    <div className="w-full">
      {!editing ? (
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            disabled={terminal}
            title={
              terminal ? "Cannot reschedule completed/cancelled" : "Reschedule"
            }
            className={`${dashboardStyles.rescheduleButton} ${
              terminal
                ? dashboardStyles.rescheduleButtonDisabled
                : dashboardStyles.rescheduleButtonEnabled
            }`}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className={dashboardStyles.rescheduleForm}>
          <input
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            className={dashboardStyles.rescheduleDateInput}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={dashboardStyles.rescheduleTimeInput}
          />
          <div className={dashboardStyles.rescheduleButtons}>
            <button onClick={save} className={dashboardStyles.saveButton}>
              Save
            </button>
            <button onClick={cancel} className={dashboardStyles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment: a, onStatusChange, onReschedule }) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(a.date?.slice(0, 10) || "");
  const [time, setTime] = useState(a.time || "09:00");
  const terminal = a.status === "complete" || a.status === "cancelled";

  const avatarColors = [
    "bg-teal-50 text-teal-700",
    "bg-amber-50 text-amber-700",
    "bg-blue-50 text-blue-700",
    "bg-purple-50 text-purple-700",
    "bg-green-50 text-green-700",
  ];
  const avatarColor =
    avatarColors[(a.patient?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 overflow-hidden ${avatarColor}`}
        >
          {a.doctorImage ? (
            <img
              src={a.doctorImage}
              alt={a.doctorName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            (a.doctorName || "D").charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {a.patient}
          </p>
          <p className="text-xs text-slate-500">
            {a.age} yrs · {a.gender}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{a.doctorName}</p>
          <p className="text-xs text-slate-400">{a.speciality}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <Phone size={11} /> {a.mobile}
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Date / time */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar size={12} /> {formatDate(a.date)}
        </span>
        <span className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
          {formatTimeAMPM(a.time)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium text-slate-800">₹{a.fee}</span>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={a.status} />
          <StatusSelect appointment={a} onChange={onStatusChange} />
        </div>
      </div>

      {/* Reschedule */}
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          disabled={terminal}
          className="w-full text-xs py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
        >
          <Clock size={12} /> Reschedule
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onReschedule(date, time);
                setEditing(false);
              }}
              className="flex-1 text-xs py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-medium hover:bg-teal-100 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 text-xs py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
