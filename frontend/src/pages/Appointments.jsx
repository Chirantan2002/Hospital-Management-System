import AppointmentPage from "../components/AppointmentPage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import usePageTitle from "../hooks/usePageTitle";

const Appointments = () => {
  // custom page title
  usePageTitle("Appointments");

  return (
    <div>
      <Navbar />
      <AppointmentPage />
      <Footer />
    </div>
  );
};

export default Appointments;
