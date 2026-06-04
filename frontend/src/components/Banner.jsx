import React from "react";
import { bannerStyles as bs } from "../assets/dummyStyles";
import DoctorImage from "../assets/D1.png";
import { ShieldPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  
  return (
    <div className={`${bs.bannerContainer}`}>
      <div
        className={`px-8 py-4 md:py-0 md:px-24 bg-linear-to-r from-[#3a6b7d] via-[#4d97ac] to-[#56a5b8]`}
      >
        <div className="flex flex-col justify-between items-center mx-auto md:flex-row max-w-7xl w-full">
          {/* Left side text */}
          <div className="max-w-3xl w-full flex flex-col gap-3 mt-8">
            <div className="flex gap-3 mb-6">
              <ShieldPlus className="text-white w-4 h-4 md:w-6 md:h-6" />
              <h3 className="text-xs md:text-lg text-white mona-sans-500 uppercase">
                Welcome to CareSync
              </h3>
            </div>
            <h1 className="text-3xl md:text-6xl mb-8 space-x-4 google-sans-600 font-bold wrap-break-word text-white">
              <span>
                Taking care of <br />
              </span>
              <span>
                your health is our
                <br />
              </span>
              <span>top priority</span>
            </h1>
            <p className="wrap-break-word google-sans-400 text-white">
              Begin healthy is more than just getting sick. It entails mental,
              physical, and social well-being. It is not just about treatment,
              it is about healing.
            </p>
            <button
              className="google-sans-500 bg-blue-400 text-white py-3 px-5 max-w-fit rounded-lg cursor-pointer"
              onClick={() => navigate("/doctors")}
            >
              Book an Appointment
            </button>
          </div>
          {/* Right side image */}
          <div className="max-w-3xl w-full hidden md:block">
            <img
              src="banner-doctor-image.PNG"
              alt="doctor_image"
              width={500}
              height={500}
              className="hidden md:block object-cover place-self-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
