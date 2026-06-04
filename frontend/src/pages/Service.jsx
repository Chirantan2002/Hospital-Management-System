import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServicePage from "../components/ServicePage";
import usePageTitle from "../hooks/usePageTitle";

const Service = () => {
  // custom page title
  usePageTitle("Services");

  return (
    <div>
      <Navbar />
      <ServicePage />
      <Footer />
    </div>
  );
};

export default Service;
