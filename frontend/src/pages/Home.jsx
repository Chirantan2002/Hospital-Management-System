import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Features from "../components/Features";
import AboutUs from "../components/AboutUs";
import Stats from "../components/Stats";
import MedicalServices from "../components/MedicalServices";
import UserStories from "../components/UserStories";
import OurDoctors from "../components/DoctorSection";
import Footer from "../components/Footer";
import usePageTitle from "../hooks/usePageTitle";

const Home = () => {
  // custom page title
  usePageTitle("Home");

  return (
    <div>
      <Navbar />
      <Banner />
      <Features />
      <AboutUs />
      <Stats />
      <MedicalServices />
      <UserStories />
      <OurDoctors />
      <Footer />
    </div>
  );
};

export default Home;
