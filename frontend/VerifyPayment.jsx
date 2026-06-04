import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "https://caresync-backend-rxz5.onrender.com";

const VerifyPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search || "");

      // Stripe usually sends session_id
      const sessionId = params.get("session_id");

      // User cancelled checkout
      if (location.pathname === "/appointment/cancel") {
        if (!cancelled) {
          navigate("/appointments?payment_status=Cancelled", { replace: true });
        }
        return;
      }

      // Missing Stripe session
      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?payment_status=Failed", { replace: true });
        }
        return;
      }

      try {
        // Add timeout support
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 12000);

        // Correct fetch usage
        const response = await fetch(
          `${API_BASE}/api/appointments/confirm?sessionId=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Parse JSON manually
        const data = await response.json();

        if (cancelled) return;

        if (data?.success) {
          navigate("/appointments?payment_status=Paid", { replace: true });
        } else {
          navigate("/appointments?payment_status=Failed", { replace: true });
        }
      } catch (err) {
        console.error("Payment verification failed:", err);

        if (!cancelled) {
          navigate("/appointments?payment_status=Failed", { replace: true });
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
};

export default VerifyPayment;
