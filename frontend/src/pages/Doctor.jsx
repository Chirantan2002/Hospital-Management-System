import React from "react";
import Navbar from "../components/Navbar";
import DoctorsPage from "../components/DoctorsPage";
import usePageTitle from "../hooks/usePageTitle";

const Doctor = () => {
  // custom page title
  usePageTitle("Doctors");
  
  return (
    <div>
      <Navbar />
      <DoctorsPage />
    </div>
  );
};

export default Doctor;
