import { Activity } from "lucide-react";
import React from "react";

const MedicalServices = () => {
  const services = [
    {
      name: "Cardiology",
      image: "human-heart.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
    {
      name: "Neurology",
      image: "human-brain.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
    {
      name: "Urology",
      image: "human-urine-system.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
    {
      name: "Pulmonary",
      image: "human-lungs.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
    {
      name: "Radiology",
      image: "MRI-machine.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
    {
      name: "Hypotherapy",
      image: "human-head-brain.svg",
      description: "lorem ipsum",
      link: "/services/cardiology",
    },
  ];
  return (
    <div className="mb-8 md:mb-16">
      <div>
        <div className="flex items-center justify-center mb-6">
          <span className="text-emerald-400 flex gap-3 uppercase google-sans-500">
            <Activity className="" size={22} />
            medical services
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-6xl google-sans-500">
            Find out more about
            <br /> our services
          </h1>
        </div>
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 place-items-center gap-8 px-8 mt-12 md:mt-24">
          {services.map((service, index) => {
            return (
              <div
                className="flex flex-col items-center rounded-xl bg-[#ebf9f7] p-10"
                key={index}
              >
                <div className="flex items-center justify-center">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-25 h-25 bg-emerald-500 rounded-full flex items-center justify-center p-2"
                  />
                </div>
                <h1 className="google-sans-600 text-3xl mt-5">
                  {service.name}
                </h1>
                <p className="google-sans-400 text-center mt-5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quidem nisi optio unde vel veritatis amet explicabo ratione
                  odit?
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;
