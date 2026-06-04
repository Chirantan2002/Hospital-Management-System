import React from "react";
import C3 from "../assets/C3.png";
import C1 from "../assets/C1.png";
import C2 from "../assets/C2.png";
import C4 from "../assets/C4.svg";
import C5 from "../assets/C5.png";
import C6 from "../assets/C6.png";
import C7 from "../assets/C7.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { certificationStyles as cs } from "../assets/dummyStyles";

const Stats = () => {
  const stats = [
    {
      title: "100+",
      subtitle: "National Awards",
    },
    {
      title: "125+",
      subtitle: "Expert Doctors",
    },
    {
      title: "5k+",
      subtitle: "Satisfied Patients",
    },
    {
      title: "8k+",
      subtitle: "Operation Success",
    },
  ];

  const certifications = [
    { id: 1, name: "Medical Commission", image: C1, type: "international" },
    { id: 2, name: "Government Approved", image: C2, type: "government" },
    {
      id: 3,
      name: "NABH Accredited",
      image: C3,
      alt: "NABH Accreditation",
      type: "healthcare",
    },
    { id: 4, name: "Medical Council", image: C4, type: "government" },
    {
      id: 5,
      name: "Quality Healthcare",
      image: C5,
      alt: "Quality Healthcare",
      type: "healthcare",
    },
    {
      id: 6,
      name: "Paramedical Council",
      image: C6,
      alt: "Patient Safety",
      type: "healthcare",
    },
    {
      id: 7,
      name: "Ministry of Health",
      image: C7,
      alt: "Ministry of Health",
      type: "government",
    },
  ];

  const duplicatedCertifications = [
    ...certifications,
    ...certifications,
    ...certifications,
  ];

  return (
    <div className="bg-[#1d5dbc] overflow-x-clip">
      <div className="max-w-6xl w-full mx-auto mb-8 md:mb-16 px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              className="flex flex-col items-center gap-2 text-white"
              key={index}
            >
              <h1 className="font-bold text-3xl md:text-6xl google-sans-600">
                {stat.title}
              </h1>
              <h2 className="google-sans-400">{stat.subtitle}</h2>
            </div>
          ))}
        </div>

        {/* Certification */}
        <div className="mt-8 md:mt-16 mb-8 md:mb-16">
          <h1 className="google-sans-500 md:text-3xl text-white text-center">
            Certifications
          </h1>
        </div>
        <div className={`${cs.logoContainer}`}>
          <div className={`${cs.logoInner}`}>
            <div className={`${cs.logosFlexContainer}`}>
              <div className={`${cs.logosMarquee}`}>
                {duplicatedCertifications.map((certification, index) => (
                  <div
                    key={`${certification.name}-${certification.id}-${index}`}
                    className={`${cs.logoItem}`}
                  >
                    <div className="relative">
                      <img
                        src={certification.image}
                        alt={certification.name}
                        className={`${cs.logoImage}`}
                      />
                    </div>
                    <span className={`${cs.logoText}`}>
                      {certification.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{cs.animationStyles}</style>
    </div>
  );
};

export default Stats;
