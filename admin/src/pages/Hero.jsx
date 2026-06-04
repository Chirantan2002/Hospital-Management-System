import React from "react";
import Navbar from "../components/Navbar";
import { heroStyles as hs } from "../assets/dummyStyles";
import LogoImg from "../assets/logo.png";
import {
  Clock10Icon,
  HeartPlus,
  LockKeyholeOpenIcon,
  MonitorCheckIcon,
} from "lucide-react";

const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";

  return (
    <div className={hs.container}>
      <Navbar />
      <main
        className={`w-full max-w-4xl  md:mx-auto mt-12 flex flex-col gap-16 items-center justify-center`}
      >
        <section
          className={`max-w-4xl w-full flex items-center justify-center`}
        >
          {/* Central Box */}
          <div
            className={`relative flex flex-col bg-[#0c756f] text-white mx-4 rounded-lg p-4 w-full h-50`}
          >
            <div className="flex flex-row justify-between items-start">
              <h1 className={`mona-sans-900 text-3xl`}>
                {isDoctor ? (
                  <span className="flex flex-col">
                    <span className="text-sm tracking-wide">Hello, </span>
                    <span className="">Dr. ${userName}</span>
                  </span>
                ) : (
                  <span className="flex flex-col">
                    <span className="text-sm tracking-wide">
                      Welcome to Care Sync
                    </span>
                    <span className="">ADMIN PANEL</span>
                  </span>
                )}
              </h1>
              <div className="absolute right-2 top-2 md:right-4 md:top-4">
                <HeartPlus className="h-10 w-10 md:h-15 md:w-15 hover:animate-pulse" />
              </div>
            </div>

            <p className="mona-sans-400 mt-4">
              {isDoctor
                ? "Access your patient records, manage appointments, and review medical reports securely from your dashboard"
                : "Manage hospital operations, doctors, staff, patient records, and system settings from a centralized control panel"}
            </p>
          </div>
        </section>
        {/* info cards section*/}
        <section className="w-full max-w-4xl flex items-center justify-center flex-col md:flex-row">
          {/* Card-1 */}
          <div className="bg-[#377cf7] text-gray-100 rounded-2xl mx-6 mb-4 md:w-[33%] h-40 p-4">
            <div className="text-left">
              <div className="relative flex flex-row items-center space-y-4">
                <h1 className="mona-sans-800 text-2xl md:text-xl">
                  Secure Access
                </h1>
                <LockKeyholeOpenIcon className="absolute right-0 top-0 md:w-6 md:h-6" />
              </div>
              <p className="mona-sans-400">
                Role-based login with protected medical data.
              </p>
            </div>
          </div>
          {/* Card-2 */}
          <div className="bg-gray-300 rounded-2xl mx-6 mb-4 md:w-[33%] h-40 p-4">
            <div className="text-left">
              <div className="relative flex flex-row items-center space-y-4">
                <h1 className="mona-sans-800 text-2xl md:text-xl">
                  Realtime
                  <br /> Management
                </h1>
                <Clock10Icon className="absolute right-0 top-0 md:w-6 md:h-6" />
              </div>
              <p className="mona-sans-400">
                Monitor hospital activity and patient flow.
              </p>
            </div>
          </div>
          {/* Card-3 */}
          <div className="bg-[#ede0d9] rounded-2xl mx-6 mb-4 md:w-[33%] h-40 p-4">
            <div className="text-left">
              <div className="relative flex flex-row items-center space-y-4">
                <h1 className="mona-sans-800 text-2xl md:text-xl ">
                  Medical
                  <br /> Dashboard
                </h1>
                <MonitorCheckIcon className="absolute right-0 top-0 md:w-6 md:h-6" />
              </div>
              <p className="mona-sans-400">
                Clean, fast, and doctor-friendly interface.
              </p>
            </div>
          </div>
        </section>
        {/*  */}
      </main>
    </div>
  );
};

export default Hero;
