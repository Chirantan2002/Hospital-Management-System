import { useState } from "react";

const doctors = [
  {
    id: 1,
    name: "Dr. Diana Ayers",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 2,
    name: "Dr. Tracy Mckay",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 3,
    name: "Dr. Jeffrey Davis",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 4,
    name: "Dr. Allen Hartzler",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 5,
    name: "Dr. Sarah Chen",
    specialty: "Neurologist",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 6,
    name: "Dr. Marcus Webb",
    specialty: "Orthopedic",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 7,
    name: "Dr. Priya Nair",
    specialty: "Dermatologist",
    image:
      "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 8,
    name: "Dr. James Holloway",
    specialty: "Pediatrician",
    image:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 9,
    name: "Dr. Amelia Torres",
    specialty: "Gynecologist",
    image:
      "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 10,
    name: "Dr. Kevin Osei",
    specialty: "Ophthalmologist",
    image:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 11,
    name: "Dr. Natalie Brooks",
    specialty: "Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 12,
    name: "Dr. Ravi Patel",
    specialty: "Endocrinologist",
    image:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 13,
    name: "Dr. Olivia Grant",
    specialty: "Radiologist",
    image:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
  {
    id: 14,
    name: "Dr. Samuel Kwon",
    specialty: "Oncologist",
    image:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=500&fit=crop&crop=face",
    social: { facebook: "#", twitter: "#", whatsapp: "#" },
  },
];

const FacebookIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
  </svg>
);

const PulseIcon = () => (
  <svg
    width="28"
    height="14"
    viewBox="0 0 28 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      points="0,7 5,7 7,2 9,12 11,4 13,10 15,7 28,7"
      stroke="#2dd4bf"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function DoctorCard({ doctor, isHovered, onHover, onLeave }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: isHovered
          ? "0 20px 48px rgba(0,0,0,0.13)"
          : "0 4px 18px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        cursor: "pointer",
        minWidth: 0,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Doctor photo */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#e8f0f7",
        }}
      >
        <img
          src={doctor.image}
          alt={doctor.name}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
            filter: isHovered ? "blur(2px)" : "none",
          }}
        />

        {/* Hover overlay with social icons */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, rgba(13,148,136,0.97) 0%, rgba(13,148,136,0.85) 60%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            borderRadius: "12px",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.01em",
            }}
            className="google-sans-500"
          >
            {doctor.name}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "13px",
            }}
            className="google-sans-400"
          >
            {doctor.specialty}
          </span>
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            {[
              { href: doctor.social.facebook, Icon: FacebookIcon },
              { href: doctor.social.twitter, Icon: TwitterIcon },
              { href: doctor.social.whatsapp, Icon: WhatsappIcon },
            ].map(({ href, Icon }, i) => (
              <a
                key={i}
                href={href}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
                }
                onClick={(e) => e.stopPropagation()}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Name + specialty (default state) */}
      <div
        style={{
          padding: "16px 16px 18px",
          textAlign: "center",
          // opacity: isHovered ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "16px",
            color: "#0d9488",
            marginBottom: "4px",
          }}
          className="google-sans-500"
        >
          {doctor.name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#94a3b8",
          }}
          className="google-sans-400"
        >
          {doctor.specialty}
        </p>
      </div>
    </div>
  );
}

export default function OurDoctors() {
  const [hoveredId, setHoveredId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;
  const maxIndex = doctors.length - visibleCount;

  const handlePrev = () => setStartIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setStartIndex((i) => Math.min(maxIndex, i + 1));

  const visible = doctors.slice(startIndex, startIndex + visibleCount);

  return (
    <>
      <div className="bg-gray-100">
        <section className="py-12 px-4 md:px-12 max-w-6xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <PulseIcon />
                <span
                  style={{
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#0d9488",
                  }}
                  className="google-sans-400"
                >
                  Our Doctors
                </span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1.15,
                }}
                className="google-sans-500"
              >
                Our Best Doctors
              </h2>
            </div>

            {/* Navigation arrows */}
            <div className="hidden md:flex gap-3">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "none",
                  background: startIndex === 0 ? "#e2e8f0" : "#e2e8f0",
                  color: startIndex === 0 ? "#94a3b8" : "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: startIndex === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s, color 0.2s",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (startIndex > 0)
                    e.currentTarget.style.background = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                }}
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= maxIndex}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "none",
                  background: startIndex >= maxIndex ? "#e2e8f0" : "#0d9488",
                  color: startIndex >= maxIndex ? "#94a3b8" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: startIndex >= maxIndex ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (startIndex < maxIndex)
                    e.currentTarget.style.background = "#0f766e";
                }}
                onMouseLeave={(e) => {
                  if (startIndex < maxIndex)
                    e.currentTarget.style.background = "#0d9488";
                }}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visible.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isHovered={hoveredId === doctor.id}
                onHover={() => setHoveredId(doctor.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
