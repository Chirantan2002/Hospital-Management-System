import { useEffect, useMemo, useState } from "react";
import { doctorsPageStyles as dps } from "../assets/dummyStyles";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Medal,
  MousePointer2Off,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const DoctorsPage = () => {
  const API_BASE = "http://localhost:4000";

  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) || `Failed to load doctors (${res.status})`;
          if (mounted) {
            setError(msg);
            setAllDoctors([]);
            setLoading(false);
          }
          return;
        }

        const items = (json && (json.data || json)) || [];
        const normilized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSrc || d.imageSmall || "";
          let available = true;

          if (typeof d.availablity === "string") {
            available = d.availablity.toLowerCase() === "available";
          } else if (typeof d.available === "boolean") {
            available = d.available;
          } else if (typeof d.availablity === "boolean") {
            available = d.availablity;
          } else {
            available = d.availablity === "Available" || d.available === true;
          }

          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              (d.experience ?? d.experience === 0) ? String(d.experience) : "-",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (mounted) {
          setAllDoctors(normilized);
          setError("");
        }
      } catch (err) {
        console.error("Load doctors err:", err);
        if (mounted) {
          setError("Failed to load doctors");
          setAllDoctors([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = true;
    };
  }, [API_BASE]);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return allDoctors;
    }

    return allDoctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q),
    );
  }, [allDoctors, searchTerm]);

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 6);

  const retry = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError((json && json.message) || `Failed to load (${res.status})`);
        setAllDoctors([]);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normilized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;
        const image = d.imageUrl || d.image || "";
        let available = true;

        if (typeof d.availablity === "string") {
          available = d.availablity.toLowerCase() === "available";
        } else if (typeof d.available === "boolean") {
          available = d.available;
        } else if (typeof d.availablity === "boolean") {
          available = d.availablity;
        } else {
          available = d.availablity === "Available" || d.available === true;
        }

        return {
          id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image,
          experience:
            (d.experience ?? d.experience === 0) ? String(d.experience) : "-",
          fee: d.fee ?? d.price ?? 0,
          available,
          raw: d,
        };
      });

      setAllDoctors(normilized);
      setError("");
    } catch (e) {
      console.error("Load doctors err:", e);
      setError("Failed to load doctors");
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${dps.mainContainer}`}>
      <div className={`${dps.backgroundShape1}`}></div>
      <div className={`${dps.backgroundShape2}`}></div>

      <div className={`${dps.wrapper}`}>
        <div className={`${dps.headerContainer}`}>
          <h1 className={`${dps.headerTitle}`}>Our medical experts</h1>
          <p className={`${dps.headerSubtitle}`}>
            Find your ideal doctor by name or specialization
          </p>
        </div>

        <div className={`${dps.searchContainer}`}>
          <div className={`${dps.searchWrapper}`}>
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${dps.searchInput}`}
            />
            <Search className={`${dps.searchIcon}`} />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className={`${dps.clearButton}`}
              >
                <X size={22} className="sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* If error, show error message & retry button */}
        {error && (
          <div className={`${dps.errorContainer}`}>
            <div className={`${dps.errorText}`}>{error}</div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={retry} className={`${dps.retryButton}`}>
                retry
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className={`${dps.skeletonGrid}`}>
            {Array.from({ length: 8 }).map((_, i) => {
              return (
                <div key={i} className={`${dps.skeletonCard}`}>
                  <div className={`${dps.skeletonImage}`}></div>
                  <div className={`${dps.skeletonName}`}></div>
                  <div className={`${dps.skeletonSpecialization}`}></div>
                  <div className={`${dps.skeletonButton}`}></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`${dps.doctorsGrid} ${filteredDoctors.length === 0 ? "opacity-70" : "opacity-100"}`}
          >
            {displayedDoctors.length > 0 ? (
              displayedDoctors.map((doctor, index) => {
                return (
                  <div
                    key={doctor.id || `${doctor.name}-${index}`}
                    className={`${dps.doctorCard} ${!doctor.available ? dps.doctorCardUnavailable : ""}`}
                    style={{
                      animationDelay: `${index * 90}ms`,
                    }}
                    role="article"
                  >
                    {doctor.available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        state={{ doctor: doctor.raw || doctor }}
                        className={`${dps.focusRing}`}
                      >
                        <div className={`${dps.imageContainer}`}>
                          <img
                            src={doctor.image || "/doctor_image.jpg"}
                            alt={doctor.name}
                            loading="lazy"
                            className={`${dps.doctorImage}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/doctor_image.jpg";
                            }}
                          />
                        </div>
                      </Link>
                    ) : (
                      <div
                        className={`${dps.imageContainer} ${dps.imageContainerUnavailable}`}
                      >
                        <img
                          src={doctor.image || "/doctor_image.jpg"}
                          alt={doctor.name}
                          loading="lazy"
                          className={`${dps.doctorImageUnavailable}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/doctor_image.jpg";
                          }}
                        />
                      </div>
                    )}
                    <h3 className={`${dps.doctorName}`}>{doctor.name}</h3>
                    <p className={`${dps.doctorSpecialization}`}>
                      {doctor.specialization}
                    </p>

                    <div className={`${dps.experienceBadge}`}>
                      <Medal size={20} className={`${dps.experienceIcon}`} />
                      <span>{doctor.experience || "N/A"}</span>
                    </div>

                    {doctor.available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        state={{ doctor: doctor.raw || doctor }}
                        className={`${dps.bookButton}`}
                      >
                        <ChevronRight
                          size={20}
                          className={`${dps.bookButtonIcon}`}
                        />
                        Book now
                      </Link>
                    ) : (
                      <button disabled className={`${dps.notAvailableButton}`}>
                        <MousePointer2Off
                          size={20}
                          className={`${dps.notAvailableIcon}`}
                        />
                        Not available
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={`${dps.noResults}`}>
                <Search className="w-10 h-10 text-emerald-200" />
                <p className="text-base font-medium">No doctors found</p>
                <p className="text-sm">
                  Try a different name or specialization
                </p>
              </div>
            )}
          </div>
        )}

        {filteredDoctors.length > 8 && (
          <div className={`${dps.showMoreContainer}`}>
            <button
              onClick={() => setShowAll(!showAll)}
              className={`${dps.showMoreButton}`}
            >
              {showAll ? (
                <>
                  <ChevronUp className={`${dps.showMoreIcon}`} />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className={`${dps.showMoreIcon}`} />
                  Show more
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.9s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.9s ease-out both; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }

        @media (max-width: 420px) {
          .max-w-7xl { padding-left: 10px; padding-right: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DoctorsPage;
