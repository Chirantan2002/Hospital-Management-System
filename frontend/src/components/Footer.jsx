import { useState } from "react";

const EmailIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

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

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const quickLinks = [
  "About Us",
  "Our Services",
  "Testimonials",
  "Our Blogs",
  "Contact Us",
];
const services = [
  "Terms of Use",
  "Privacy Policy",
  "Contact Support",
  "Careers",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Raleway:wght@700;800&display=swap');

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          transition: color 0.2s ease, padding-left 0.2s ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: #38bdf8;
          padding-left: 4px;
        }
        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          border: none;
        }
        .social-btn:hover {
          transform: translateY(-3px);
        }
        .subscribe-input::placeholder {
          color: #94a3b8;
        }
        .subscribe-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(56,189,248,0.3);
        }
        .subscribe-btn:hover {
          background: #1e3a5f !important;
        }
        .call-btn:hover {
          background: rgba(56,189,248,0.15) !important;
          border-color: #38bdf8 !important;
        }
      `}</style>

      <footer style={{ fontFamily: "'Nunito', sans-serif" }}>
        {/* Newsletter Banner */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)",
          }}
          className="py-10 px-4 md:px-12"
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 8px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="google-sans-400"
              >
                Subscribe Newsletter
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.3,
                  maxWidth: "420px",
                }}
                className="google-sans-500"
              >
                Get the latest updates by Subscribing to our newsletter
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0",
                background: "#fff",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: "500px",
                flexWrap: "wrap",
                flexDirection: window.innerWidth < 600 ? "column" : "row",
              }}
            >
              <input
                type="email"
                className="subscribe-input"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                style={{
                  flex: 1,
                  border: "none",
                  padding: "14px 18px",
                  fontSize: "14px",
                  color: "#1e293b",
                  background: "transparent",
                  minWidth: 0,
                }}
                className="google-sans-400 placeholder:google-sans-400"
              />
              <button
                className="subscribe-btn"
                onClick={handleSubscribe}
                style={{
                  padding: "14px 24px",
                  background: subscribed ? "#16a34a" : "#1e293b",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  whiteSpace: "nowrap",
                }}
                className="google-sans-400"
              >
                {subscribed ? "✓ Subscribed!" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div
          style={{
            background: "#0f172a",
          }}
          className="py-10 px-4 md:px-12"
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand column */}
              <div>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                  className="google-sans-500"
                >
                  CareSync
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                    maxWidth: "240px",
                  }}
                  className="google-sans-400"
                >
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(56,189,248,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#38bdf8",
                        flexShrink: 0,
                      }}
                    >
                      <EmailIcon />
                    </div>
                    <span
                      style={{ color: "#94a3b8", fontSize: "14px" }}
                      className="google-sans-400"
                    >
                      info@caresync.com
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(56,189,248,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#38bdf8",
                        flexShrink: 0,
                      }}
                    >
                      <LocationIcon />
                    </div>
                    <span
                      style={{ color: "#94a3b8", fontSize: "14px" }}
                      className="google-sans-400"
                    >
                      1378 Whitetail Frisco, 75034
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4
                  style={{
                    margin: "0 0 20px",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                  className="google-sans-500"
                >
                  Quick Links
                </h4>
                <div
                  style={{
                    width: "36px",
                    height: "3px",
                    background: "linear-gradient(90deg, #38bdf8, transparent)",
                    marginBottom: "20px",
                    borderRadius: "2px",
                  }}
                />
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {quickLinks.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="footer-link"
                        className="google-sans-400 text-[#94a3b8] hover:text-[#38bdf8]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Services */}
              <div>
                <h4
                  style={{
                    margin: "0 0 20px",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                  className="google-sans-500"
                >
                  Our Services
                </h4>
                <div
                  style={{
                    width: "36px",
                    height: "3px",
                    background: "linear-gradient(90deg, #38bdf8, transparent)",
                    marginBottom: "20px",
                    borderRadius: "2px",
                  }}
                />
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {services.map((s) => (
                    <li key={s}>
                      <a
                        href="#"
                        className="footer-link"
                        className="google-sans-400 text-[#94a3b8] hover:text-[#38bdf8]"
                      >
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Appointment */}
              <div>
                <h4
                  style={{
                    margin: "0 0 20px",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                  className="google-sans-500"
                >
                  Book An Appointment
                </h4>
                <div
                  style={{
                    width: "36px",
                    height: "3px",
                    background: "linear-gradient(90deg, #38bdf8, transparent)",
                    marginBottom: "20px",
                    borderRadius: "2px",
                  }}
                />
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: "0 0 20px",
                  }}
                  className="google-sans-400"
                >
                  The doctorate staff members are well trained professionals.
                </p>
                <button
                  className="call-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 18px",
                    background: "transparent",
                    border: "1.5px solid #334155",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  className="google-sans-400"
                >
                  <span style={{ color: "#38bdf8" }}>
                    <PhoneIcon />
                  </span>
                  Call : +012 345 6789
                </button>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "#1e293b",
                marginBottom: "28px",
              }}
            />

            {/* Bottom bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
              className="google-sans-400"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: "#475569", fontSize: "13px" }}>
                  All Rights Reserved @ Company 2023
                </span>
                <span style={{ color: "#334155" }}>|</span>
                <a
                  href="#"
                  style={{
                    color: "#475569",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  Terms & Conditions
                </a>
                <span style={{ color: "#334155" }}>|</span>
                <a
                  href="#"
                  style={{
                    color: "#475569",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  Privacy Policy
                </a>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { Icon: FacebookIcon, bg: "#1877f2" },
                  { Icon: TwitterIcon, bg: "#1da1f2" },
                  {
                    Icon: InstagramIcon,
                    bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  },
                ].map(({ Icon, bg }, i) => (
                  <button
                    key={i}
                    className="social-btn"
                    style={{ background: bg, color: "#fff" }}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
