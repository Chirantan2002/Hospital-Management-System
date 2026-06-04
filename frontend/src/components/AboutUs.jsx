import { Activity, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const items = [
    "15+ Years of excellence",
    "24/7 Hour Medical Service",
    "A Multispecialty hospital",
    "A team of professionals",
  ];
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#f6fcfc] overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto mt-16 mb-16 md:mb-32 md:mt-32 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* left side */}
          <div className="max-w-3xl w-full flex flex-col gap-4">
            {/* badge */}
            <div className="flex text-[#40cab7] gap-2">
              <Activity className="" size={22} />
              <p className="google-sans-600 font-bold">About Us</p>
            </div>
            {/* heading */}
            <div>
              <h1 className="font-bold text-3xl md:text-6xl google-sans-500">
                Welcome to CareSync Central Hospital
              </h1>
            </div>
            {/* subtitle text */}
            <div>
              <p className="google-sans-400 max-w-md text-left">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Fugiat, consequuntur impedit sit provident quam et nulla
                incidunt minima cupiditate sapiente perferendis rerum esse
                dolorem error odit in culpa fugit corporis!
              </p>
            </div>
            {/* features */}
            <div>
              <div className="flex flex-wrap gap-y-4 gap-x-8 mt-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 w-full sm:w-[45%]"
                  >
                    <CheckCircle className="text-[#40cab7]" size={20} />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* CTA button */}
            <div className="mt-6">
              <button className="bg-blue-700 py-3 px-5 rounded-lg google-sans-600 text-gray-200 cursor-pointer"
              onClick={() => navigate("/appointments")}
              >
                Book an appointment
              </button>
            </div>
          </div>
          {/* right side */}
          <div className="hidden md:block">
            {/* image */}
            <div>
              <img
                src="about-doctor-image.jpg"
                alt="about-doctor-image"
                className="rounded-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
