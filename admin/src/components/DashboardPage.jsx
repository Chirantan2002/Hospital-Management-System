import { useEffect, useMemo, useState } from "react";
import { dashboardStyles as ds } from "../assets/dummyStyles";
import {
  UserRoundCheck,
  Users,
  CalendarRange,
  BadgeIndianRupee,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

const API_BASE = "http://localhost:4000";
const PATIENT_COUNT_API = `${API_BASE}/api/appointments/patients/count`;

// HELPER FUNCTIONS
const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function normilizeDoctor(doc) {
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name =
    doc.name ||
    doc.fullname ||
    `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
    "Unknown";

  const specialization =
    doc.specialization ||
    doc.speciality ||
    (Array.isArray(doc.specializations) ? doc.specializations.join(",") : "") ||
    "General";

  const fee = safeNumber(
    doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
    0,
  );

  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;

  const appointments = {
    total:
      doc.appointments?.total ??
      doc.totalAppointments ??
      doc.appointmentsTotal ??
      0,
    completed:
      doc.appointments?.completed ??
      doc.completedAppointments ??
      doc.appointmentsCompleted ??
      0,
    canceled:
      doc.appointments?.canceled ??
      doc.canceledAppointments ??
      doc.appointmentsCanceled ??
      0,
  };

  let earnings = null;
  if (doc.earnings !== undefined && doc.earnings !== null) {
    earnings = safeNumber(doc.earnings, 0);
  } else if (doc.revenue !== undefined && doc.revenue !== null) {
    earnings = safeNumber(doc.revenue, 0);
  } else if (appointments.completed && fee) {
    earnings = fee * safeNumber(appointments.completed, 0);
  } else {
    earnings = 0;
  }

  return {
    id,
    name,
    specialization,
    fee,
    image,
    appointments,
    earnings,
    raw: doc,
  };
}

const DashboardPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW PATIENTS
  const [patientCount, setPatientCount] = useState(null);
  const [patientCountLoading, setPatientCountLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // TO LOAD DOCTORS FROM THE SERVER
  useEffect(() => {
    let mounted = true;
    const loadDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/api/doctors?limit=200`;
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.message || `Failed to load doctors (${res.status})`,
          );
        }
        const body = await res.json();
        let list = [];
        if (Array.isArray(body)) {
          list = body;
        } else if (Array.isArray(body.doctors)) {
          list = body.doctors;
        } else if (Array.isArray(body.data)) {
          list = body.data;
        } else if (Array.isArray(body.items)) {
          list = body.items;
        } else {
          const firstArray = Object.values(body).find((v) => Array.isArray(v));
          if (firstArray) list = firstArray;
        }

        const normalized = list.map((d) => normilizeDoctor(d));
        if (mounted) setDoctors(normalized);
      } catch (err) {
        console.error("Failed to load doctors: ", err);
        if (mounted) {
          setError(err.message || "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDoctors();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadPatientCount = async () => {
      setPatientCountLoading(true);

      try {
        const res = await fetch(PATIENT_COUNT_API);
        if (!res.ok) {
          console.error("Patient count fetching failed: ", res.status);
          if (mounted) {
            setPatientCount(0);
          }
          return;
        }

        const body = await res.json().catch(() => ({}));
        const count = Number(
          body?.count ?? body?.totalUsers ?? body?.data ?? 0,
        );
        if (mounted) {
          setPatientCount(isNaN(count) ? 0 : count);
        }
      } catch (err) {
        console.error("Failed to load patient count: ", err);
        if (mounted) {
          setPatientCount(0);
        }
      } finally {
        if (mounted) {
          setPatientCountLoading(false);
        }
      }
    };

    loadPatientCount();
    return () => (mounted = false);
  }, []);

  // TO DERIVE TOTALS
  const totals = useMemo(() => {
    const totalDoctors = doctors.length;
    const totalAppointments = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.total, 0),
      0,
    );

    const totalEarnings = doctors.reduce(
      (s, d) => s + safeNumber(d.earnings, 0),
      0,
    );

    const completed = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.completed, 0),
      0,
    );

    const canceled = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.canceled, 0),
      0,
    );

    const totalLoginPatients =
      doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0;

    return {
      totalDoctors,
      totalAppointments,
      totalEarnings,
      completed,
      canceled,
      totalLoginPatients,
    };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!query) {
      return doctors;
    }

    const q = query.trim().toLowerCase();
    const qNum = Number(q);
    return doctors.filter((d) => {
      if (d.name.toLowerCase().includes(q)) return true;
      if ((d.specialization || "").toLowerCase().includes(q)) return true;
      if (d.fee.toString().includes(q)) return true;
      if (!Number.isNaN(qNum) && d.fee <= qNum) return true;
      return false;
    });
  }, [doctors, query]);

  const INITIAL_COUNT = 10;
  const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, Math.min(INITIAL_COUNT, filteredDoctors.length));

  return (
    <div className={`${ds.pageContainer}`}>
      <div className={`${ds.maxWidthContainer}`}>
        <div className={`${ds.headerContainer}`}>
          <div>
            <h1 className={`mona-sans-800 ${ds.headerTitle}`}>DASHBOARD</h1>
            <p className={`mona-sans-500 ${ds.headerSubtitle}`}>
              Overview of doctors & appointments
            </p>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className={`${ds.statsGrid}`}>
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Doctors"
            value={totals.totalDoctors}
          />
          <StatCard // SHOW COUNT FETCH FROM THE BACKEND
            icon={<UserRoundCheck className="w-6 h-6" />}
            label="Registered Users"
            value={
              patientCountLoading
                ? "Loading..."
                : (patientCount ?? totals.totalLoginPatients)
            }
          />
          <StatCard // SHOW COUNT FETCH FROM THE BACKEND
            icon={<CalendarRange className="w-6 h-6" />}
            label="Total appointments"
            value={totals.totalAppointments}
          />
          <StatCard // SHOW EARNNGS, FETCH FROM THE BACKEND
            icon={<BadgeIndianRupee className="w-6 h-6" />}
            label="Total earnings"
            value={`₹ ${totals.totalEarnings.toLocaleString()}`}
          />
          <StatCard // SHOW COMPLETED, FETCH FROM THE BACKEND
            icon={<CheckCircle className="w-6 h-6" />}
            label="Completed"
            value={totals.completed}
          />
          <StatCard // SHOW CANCELED, FETCH FROM THE BACKEND
            icon={<XCircle className="w-6 h-6" />}
            label="Canceled"
            value={totals.canceled}
          />
        </div>

        <div className="mb-6">
          <label className={`${ds.searchLabel} mona-sans-500`}>
            Search Doctors
          </label>
          <div className={`${ds.searchContainer}`}>
            <div className={`${ds.searchInputContainer} rounded-lg`}>
              <Search className={`${ds.searchIcon}`} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${ds.searchInput} mona-sans-300`}
                placeholder="Search name, specialization, etc..."
              />
            </div>

            <button
              onClick={() => {
                setQuery("");
                setShowAll(false);
              }}
              className={`${ds.clearButton} cursor-pointer mona-sans-600`}
            >
              Clear
            </button>
          </div>
        </div>

        {/* SHOWING DOCTORS IN TABLE FORMAT */}
        <div className={`${ds.tableContainer}`}>
          <div className={`${ds.tableHeader}`}>
            <h2 className={`${ds.tableTitle} mona-sans-700`}>Doctors</h2>
            <p className={`${ds.tableCount} mona-sans-400`}>
              {loading
                ? "Loading..."
                : `Showing ${visibleDoctors.length} of ${filteredDoctors.length}`}
            </p>
          </div>

          {error && (
            <div className={`${ds.errorContainer}`}>
              Error loading doctors: {error}
            </div>
          )}

          {/* TABLE */}
          <div className={`${ds.tableWrapper}`}>
            <table className={`${ds.table}`}>
              <thead className={`${ds.tableHead}`}>
                <tr>
                  <th className={`${ds.tableHeaderCellLeft}`}>Doctor</th>
                  <th className={`${ds.tableHeaderCellCenter}`}>
                    Specialization
                  </th>
                  <th className={`${ds.tableHeaderCellCenter}`}>Fee</th>
                  <th className={`${ds.tableHeaderCellCenter}`}>Appointment</th>
                  <th className={`${ds.tableHeaderCellCenter}`}>Completed</th>
                  <th className={`${ds.tableHeaderCellCenter}`}>Canceled</th>
                  <th className={`${ds.tableHeaderCellRight}`}>
                    Total Earning
                  </th>
                </tr>
              </thead>

              <tbody className={`${ds.tableBody}`}>
                {visibleDoctors.map((d, idx) => (
                  <tr
                    key={d.id}
                    className={`${ds.tableRow} ${idx % 2 === 0 ? `${ds.tableRowEven}` : `${ds.tableRowOdd}`} mona-sans-400`}
                  >
                    <td className={`${ds.tableCell} ${ds.tableCellFlex}`}>
                      <div className={``} />
                      <img
                        src={d.image}
                        alt={d.name}
                        className={`${ds.doctorImage}`}
                      />
                      <div className={``}>
                        <div className={`${ds.doctorName} mona-sans-600`}>
                          {d.name}
                        </div>
                        <div className={`${ds.doctorId}`}>{d.id}</div>
                      </div>
                    </td>

                    <td
                      className={`${ds.tableCell} mona-sans-600 ${ds.doctorSpecialization}`}
                    >
                      {d.specialization}
                    </td>

                    <td
                      className={`mona-sans-600 ${ds.tableCell} ${ds.feeText}`}
                    >
                      ₹ {d.fee}
                    </td>

                    <td
                      className={`mona-sans-600 ${ds.tableCell} ${ds.appointmentsText}`}
                    >
                      {d.appointments.total}
                    </td>

                    <td
                      className={`mona-sans-600 ${ds.tableCell} ${ds.completedText}`}
                    >
                      {d.appointments.completed}
                    </td>

                    <td
                      className={`mona-sans-600 ${ds.tableCell} ${ds.canceledText}`}
                    >
                      {d.appointments.canceled}
                    </td>

                    <td className={`${ds.tableCell} ${ds.earningsText}`}>
                      ₹ {d.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW TABLE */}
          <div className={`${ds.mobileDoctorContainer}`}>
            <div className={`${ds.mobileDoctorGrid}`}>
              {visibleDoctors.map((d) => (
                <MobileDoctorCard key={d.id} d={d} />
              ))}
            </div>
          </div>

          {filteredDoctors.length > INITIAL_COUNT && (
            <div className={`${ds.showMoreContainer}`}>
              <button
                onClick={() => setShowAll((s) => !s)}
                className={`${ds.showMoreButton} cursor-pointer`}
              >
                {showAll
                  ? "Show less"
                  : `Show more (${filteredDoctors.length - INITIAL_COUNT})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

export const StatCard = ({ icon, label, value }) => {
  return (
    <div
      className={`h-39 md:h-auto bg-[#00a896] rounded-2xl shadow-xl shadow-gray-500/40`}
    >
      <div className={`flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`${ds.statIconContainer}`}>{icon}</div>
          <div
            className={`text-2xl md:text-[1rem] mona-sans-700 tracking-wide text-[#e0fbfc]`}
          >
            {label}
          </div>
        </div>

        <div
          className={`flex items-center px-8 mb-4 mona-sans-600 text-[#e0fbfc]`}
        >
          <div className={`text-3xl`}>{value}</div>
        </div>
      </div>
    </div>
  );
};

export const MobileDoctorCard = ({ d }) => {
  return (
    <div className={`${ds.mobileDoctorCard}`}>
      <div className={`${ds.mobileDoctorHeader}`}>
        <div className={`flex items-center gap-3`}>
          <img
            src={d.image}
            alt={d.name}
            className={`${ds.mobileDoctorImage}`}
          />
          <div>
            <div className={`${ds.mobileDoctorName} mona-sans-600`}>
              {d.name}
            </div>
            <div className={`${ds.mobileDoctorSpecialization} mona-sans-500`}>
              {d.specialization}
            </div>
          </div>
        </div>
        <div className={`${ds.mobileDoctorFee} mona-sans-700`}>₹ {d.fee}</div>
      </div>
      <div className={`${ds.mobileStatsGrid}`}>
        <div>
          <div className={`${ds.mobileStatLabel} mona-sans-400`}>Appts</div>
          <div className={`${ds.mobileStatValue} mona-sans-600`}>
            {d.appointments.total}
          </div>
        </div>

        <div>
          <div className={`${ds.mobileStatLabel} mona-sans-400`}>Done</div>
          <div
            className={`${ds.mobileStatValue} text-emerald-600 mona-sans-600`}
          >
            {d.appointments.completed}
          </div>
        </div>

        <div>
          <div className={`${ds.mobileStatLabel} mona-sans-400`}>Cancel</div>
          <div className={`${ds.mobileStatValue} text-rose-500 mona-sans-600`}>
            {d.appointments.canceled}
          </div>
        </div>
      </div>

      <div className={`${ds.mobileEarningsContainer}`}>
        <div className="mona-sans-500">Earned</div>
        <div className={`mona-sans-700`}>₹ {d.earnings.toLocaleString()}</div>
      </div>
    </div>
  );
};
