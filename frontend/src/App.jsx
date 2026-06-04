import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import DoctorDetail from "./pages/DoctorDetail";
import Service from "./pages/Service";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import DoctorHome from "./pages/DoctorHome";
import DoctorAppointments from "./doctor/DoctorAppointments";
import EditProfile from "./doctor/EditProfile";
import Appointments from "./pages/Appointments";
import { CircleArrowUp } from "lucide-react";
import VerifyPayment from "../VerifyPayment";
import VerifyServicePaymentPage from "../VerifyServicePaymentPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

// scroll to top button
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleArrowUp size={22} />
    </button>
  );
};

const App = () => {
  // To lock horizontal scroll
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen overflow-x-hidden">
        <Routes>
          {/* Public Routes for Users */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/contact" element={<Contact />} />

          {/* Doctor Admin Routes */}
          <Route path="/doctor-admin/login" element={<Login />} />
          <Route path="/doctor-admin/:id" element={<DoctorHome />} />
          <Route
            path="/doctor-admin/:id/appointments"
            element={<DoctorAppointments />}
          />
          <Route
            path="/doctor-admin/:id/edit-profile"
            element={<EditProfile />}
          />

          {/* Payment verification routes */}
          <Route path="/appointment/success" element={<VerifyPayment />} />
          <Route path="/appointment/cancel" element={<VerifyPayment />} />

          <Route
            path="/service-appointment/success"
            element={<VerifyServicePaymentPage />}
          />
          <Route
            path="/service-appointment/cancel"
            element={<VerifyServicePaymentPage />}
          />
        </Routes>
      </div>

      <ScrollButton />
    </>
  );
};

export default App;
