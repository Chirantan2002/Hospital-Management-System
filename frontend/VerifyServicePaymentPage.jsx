import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "https://caresync-backend-rxz5.onrender.com";

const VerifyServicePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyServicePayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      // Handle cancel route
      if (location.pathname === "/service-appointment/cancel") {
        if (!cancelled) {
          navigate("/appointments?payment_status=Cancelled", {
            replace: true,
          });
        }
        return;
      }

      // Missing session ID
      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?payment_status=Failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        // Proper query string for fetch
        const response = await fetch(
          `${API_BASE}/api/service-appointments/confirm?sessionId=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
          },
        );

        // Optional: check HTTP status
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        // Parse JSON manually
        const data = await response.json();

        if (cancelled) return;

        if (data?.success) {
          navigate("/appointments?payment_status=Paid", {
            replace: true,
          });
        } else {
          navigate("/appointments?payment_status=Failed", {
            replace: true,
          });
        }
      } catch (err) {
        console.error("verifyServicePayment error:", err);

        if (!cancelled) {
          navigate("/appointments?payment_status=Failed", {
            replace: true,
          });
        }
      }
    };

    verifyServicePayment();

    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
};

export default VerifyServicePaymentPage;
