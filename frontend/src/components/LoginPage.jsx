import { useState } from "react";
import { loginPageStyles as lps, toastStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeySquare, Mail } from "lucide-react";

const STORAGE_KEY = "doctorToken_v1";

const LoginPage = () => {
  const API_BASE = "http://localhost:4000";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // capture first
    const { name, value } = e.target;

    // then update
    setFormData((s) => ({
      ...s,
      [name]: value,
    }));
  };

  //To login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields...", {
        duration: 3000,
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);

    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }

      const token = json?.token || json?.data?.token;

      if (!token) {
        toast.error("Authentication token missing!");
        setBusy(false);
        return;
      }

      const doctorId =
        json?.data?._id || json?.doctor?.id || json?.data?.doctor?._id;

      if (!doctorId) {
        toast.error("Doctor ID missing from server response!");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: token,
        }),
      );
      toast.success("Login successful, redirecting...", { duration: 3000 });

      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("Login error", err);
      toast.error("Network error, please try again", { duration: 3000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`${lps.mainContainer}`}>
      <Toaster position="top-right" reverseOrder={false} />
      <button onClick={() => navigate("/")} className={`${lps.backButton}`}>
        <ArrowLeft className={`${lps.backButtonIcon}`} /> Back to Home
      </button>

      <div className={`${lps.loginCard}`}>
        <div className={`${lps.logoContainer}`}>
          <img src={logo} alt="logo_image" className={`${lps.logo}`} />
        </div>

        <h3 className={`${lps.title}`}>Doctor Login</h3>
        <p className={`${lps.subtitle}`}>
          Sign in to manage your profile & schedules
        </p>

        <form onSubmit={handleLogin} className={`${lps.form}`}>
          <div className={``}>
            <label name="email" className={`${lps.label}`}>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={`${lps.input}`}
              required
            />
          </div>
          <div>
            <label name="password" className={`${lps.label}`}>
              <KeySquare size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={formData.password}
              onChange={handleChange}
              className={`${lps.input}`}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={busy}
              className={`${lps.submitButton}`}
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
