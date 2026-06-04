import { useEffect, useMemo, useState } from "react";
import { doctorListStyles as dls } from "../assets/dummyStyles";
import {
  BadgeIndianRupee,
  Dot,
  EyeClosed,
  Search,
  Star,
  Trash2,
  User2Icon,
  Users,
} from "lucide-react";

// HELPER FUNCTIONS
const formatDateISO = (iso) => {
  if (!iso || typeof iso !== "string") return iso;
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const monthNames = [
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
  const month = monthNames[dateObj.getMonth()] || "";
  return `${day} ${month} ${y}`;
};

const normalizeToDateString = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString().split("T")[0];
};

const buildScheduleMap = (schedule) => {
  const map = {};
  if (!schedule || typeof schedule !== "object") return map;
  Object.entries(schedule).forEach(([k, v]) => {
    const nd = normalizeToDateString(k) || String(k);
    map[nd] = Array.isArray(v) ? v.slice() : [];
  });
  return map;
};

const getSortedScheduleDates = (scheduleLike) => {
  let keys = [];
  if (Array.isArray(scheduleLike)) {
    keys = scheduleLike.map(normalizeToDateString).filter(Boolean);
  } else if (scheduleLike && typeof scheduleLike === "object") {
    keys = Object.keys(scheduleLike).map(normalizeToDateString).filter(Boolean);
  }

  keys = Array.from(new Set(keys));
  const parsed = keys.map((ds) => ({ ds, date: new Date(ds) }));
  const dateVal = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

  const today = new Date();
  const todayVal = dateVal(today);

  const past = parsed
    .filter((p) => dateVal(p.date) < todayVal)
    .sort((a, b) => dateVal(b.date) - dateVal(a.date));

  const future = parsed
    .filter((p) => dateVal(p.date) >= todayVal)
    .sort((a, b) => dateVal(a.date) - dateVal(b.date));

  return [...past, ...future].map((p) => p.ds);
};

const ListPage = () => {
  const API_BASE = "http://localhost:4000";

  const [doctors, setDoctors] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const [isMobileScreen, setIsMbileScreen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (typeof window === "undefined") return;
      setIsMbileScreen(window.innerWidth < 640);
    }

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const body = await res.json().catch(() => null);

      if (res.ok && body && body.success) {
        const list = Array.isArray(body.doctors)
          ? body.data
          : Array.isArray(body.doctors)
            ? body.doctors
            : [];

        const normalized = list.map((d) => {
          const scheduleMap = buildScheduleMap(d.schedule || {});
          return { ...d, schedule: scheduleMap };
        });
        setDoctors(normalized);
      } else {
        console.error("Failed to fetch doctors", { status: res.status, body });
        setDoctors([]);
      }
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // FILTER THE DOCTORS
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = doctors;
    if (filterStatus === "available") {
      list = list.filter(
        (d) =>
          (d.availability || "").toString().toLocaleLowerCase() === "available",
      );
    } else if (filterStatus === "unavailable") {
      list = list.filter(
        (d) =>
          (d.availablity || "").toString().toLocaleLowerCase() !== "available",
      );
    }

    if (!q) return list;
    return list.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.specialization || "").toLowerCase().includes(q),
    );
  }, [doctors, query, filterStatus]);

  // SHOW DOCTORS ACCORDING TO THE FILTER
  const displayed = useMemo(() => {
    if (showAll) return filtered;
    return filtered.slice(0, 6);
  }, [filtered, showAll]);

  const toggle = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // TO DELETE A DOCTOR
  const removeDoctor = async (id) => {
    const doc = doctors.find((d) => (d.id || d._id) === id);
    if (!doc) return;
    const ok = window.confirm(`Delete ${doc.name}? This cannot be undone!`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctors/${id}`, {
        method: "DELETE",
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        alert(body?.message || `Failed to delete doctor (${res.status})`);
        return;
      }

      setDoctors((prev) => prev.filter((p) => (p._id || p.id) !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error("Failed to delete doctor", err);
      alert("Network error while deleting doctor!");
    }
  };

  const applyStatusFilter = (status) => {
    setFilterStatus((prev) => (prev === status ? "all" : status));
    setExpanded(null);
    setShowAll(false);
  };

  return (
    <div className={`${dls.container}`}>
      <header className={`${dls.headerContainer}`}>
        <div className={`${dls.headerTopSection}`}>
          <div className={`${dls.headerIconContainer}`}>
            <div className={`${dls.headerIcon}`}>
              <Users size={30} className={`${dls.headerIconSvg}`} />
            </div>
            <div>
              <h1 className={`${dls.headerTitle}`}>Find the doctor</h1>
              <p className={`${dls.headerSubtitle}`}>
                Search by name or specialization
              </p>
            </div>
          </div>

          <div className={`${dls.headerSearchContainer}`}>
            <div className={`${dls.searchBox}`}>
              <Search size={20} className={`${dls.searchIcon}`} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${dls.searchInput}`}
                placeholder="Search Doctors, specialization..."
              />
            </div>
            <button
              onClick={() => {
                setQuery("");
                setExpanded(null);
                setShowAll(false);
                setFilterStatus("all");
              }}
              className={`${dls.clearButton}`}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={`${dls.filterContainer}`}>
          <button
            onClick={() => applyStatusFilter("available")}
            className={`${dls.filterButton(
              filterStatus === "available",
              "emerald",
            )}`}
          >
            Available
          </button>

          <button
            onClick={() => applyStatusFilter("unavailable")}
            className={`${dls.filterButton(
              filterStatus === "unavailable",
              "red",
            )}`}
          >
            Unavailable
          </button>
        </div>
      </header>

      <main className={`${dls.gridContainer}`}>
        {loading && (
          <div className={`${dls.loadingContainer}`}>Loading doctors...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className={`${dls.noResultsContainer}`}>
            No doctor matches your search...
          </div>
        )}

        {displayed.map((doc) => {
          const id = doc._id || doc.id || doc.name;
          const isOpen = expanded === id;
          const isAvailable = doc.availability === "Available";

          const scheduleMap = buildScheduleMap(doc.schedule || {});
          const sortedDates = getSortedScheduleDates(scheduleMap);

          return (
            <div key={`doctor-wrapper-${id}`} className="flex flex-col">
              <article key={`doctor-${id}`} className={`${dls.article}`}>
                {/* BADGE OF AVAILABILITY */}
                <span className={`${dls.availabilityBadge(isAvailable)}`}>
                  <span className={`${dls.availabilityDot(isAvailable)}`} />
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
                {/* DOCTOR CARD */}
                <div
                  className={`${dls.articleContent} border border-[#05668d]/40 rounded-lg`}
                >
                  <img
                    src={doc.imageUrl || "./doctor.png"}
                    alt={doc.imageUrl || ""}
                    className={`${dls.doctorImage} mb-2 md:mb-0 shadow flex items-center gap-4 overflow-hidden`}
                  />

                  <div className={`${dls.doctorInfoContainer}`}>
                    <div className={`${dls.doctorHeader}`}>
                      <div className={`min-w-0 w-full`}>
                        <div className={`flex items-center gap-2 flex-wrap`}>
                          <h3 className={`${dls.doctorName}`}>{doc.name}</h3>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          {/* Left-side: Specialization and Experience */}
                          <div className={`${dls.doctorDetails} flex gap-2`}>
                            <span>{doc.specialization}</span>
                            <span>•</span>
                            <span>
                              {doc.experience}{" "}
                              {doc.experience === 1 ? "Year" : "Years"}
                            </span>
                          </div>
                          {/* Right-side: Rating with eye icon toggle */}
                          <div className={`${dls.ratingContainer}`}>
                            <div className={`${dls.rating}`}>
                              <Star size={14} /> {doc.rating}
                            </div>
                            <button
                              onClick={() => toggle(id)}
                              className={`${dls.toggleButton(isOpen)}`}
                            >
                              <EyeClosed size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* RATING CONTAINER with STATS CONTAINER */}
                    <div className="flex items-center text-center gap-4 justify-between">
                      {/* STATS SECTION (Patients count)*/}
                      <div
                        className={`${dls.statsContainer} flex flex-wrap items-center`}
                      >
                        {/* Left-side: Patients count */}
                        <div className="flex items-center gap-2">
                          <div className={dls.statsLabel}>Patients</div>
                          <div className={dls.statsValue}>
                            <Users size={14} />
                            <span>{doc.patients}</span>
                          </div>
                        </div>

                        {/* Right-side: Delete button */}
                        <div className={`${dls.feesLabel}`}>Fees:</div>
                        <div className={`${dls.feesValue}`}>
                          <BadgeIndianRupee /> {doc.fee || "N/A"}
                        </div>

                        <button
                          onClick={() => removeDoctor(id)}
                          className={`${dls.deleteButton}`}
                        >
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Exapndable Section of the card */}
              {isOpen && (
                <div
                  className={`mt-2 border border-emerald-600 rounded-lg ${dls.expandableContent}`}
                  style={{
                    // maxHeight: isOpen ? (isMobileScreen ? 320 : 600) : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 420ms cubic-bezier(.2,.9,.2,1), padding 220ms ease",
                    paddingTop: isOpen ? 16 : 0,
                    paddingBottom: isOpen ? 16 : 0,
                  }}
                >
                  <div
                    className={`transition-all duration-200 ease-in-out grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4
                    ${isOpen ? "opacity-100" : "opacity-0"}
                    `}
                  >
                    {/* About */}
                    <div className={dls.aboutSection}>
                      <h4 className={dls.aboutHeading}>About</h4>
                      <p className={dls.aboutText}>{doc.about}</p>

                      {/* Qualifications */}
                      <div className="mt-4">
                        <div className={dls.qualificationsHeading}>
                          Qualifications
                        </div>
                        <div className={dls.qualificationsText}>
                          {doc.qualifications}
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="mt-4">
                        <div className={dls.scheduleHeading}>Schedule</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sortedDates.map((date) => {
                            const slots = scheduleMap[date] || [];
                            return (
                              <div
                                key={`${id}-${date}`}
                                className="min-w-full md:min-w-0"
                              >
                                <div className={dls.scheduleDate}>
                                  {formatDateISO(date)}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {slots.map((s, i) => (
                                    <span
                                      key={`${date}-${i}`}
                                      className={dls.scheduleSlot}
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <aside className={dls.statsSidebar}>
                      <div className={dls.statsItemHeading}>Success</div>
                      <div className={dls.statsItemValue}>{doc.success}</div>

                      <div className={dls.statsItemHeading}>Patients</div>
                      <div className={dls.statsItemValue}>{doc.patients}</div>

                      <div className={dls.statsItemHeading}>Location</div>
                      <div className={dls.locationValue}>
                        {doc.location || "Not specified"}
                      </div>
                    </aside>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length > 6 && (
          <div className={`${dls.showMoreContainer}`}>
            <button
              onClick={() => setShowAll((s) => !s)}
              className={`${dls.showMoreButton}`}
            >
              {showAll ? "Show less" : `Show more ${filtered.length - 4}`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListPage;
