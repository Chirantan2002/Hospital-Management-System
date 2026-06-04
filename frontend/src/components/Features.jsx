import { ClipboardClock, Dna, Siren } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <div className="relative mx-auto w-full overflow-hidden mb-8 mt-8">
      <div className="flex items-center justify-center">
        <div className="bg-white grid grid-cols-1 md:grid-cols-3 place-items-center items-center gap-8 md:px-32 py-6">
          <div className="flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-gray-400 p-4">
            <Dna className="text-blue-500 w-12 h-12" />
            <h1 className="text-3xl google-sans-400">Qualified Doctors</h1>
            <p className="google-sans-400 text-center">
              Developing individiuals is our goal. We have a flexible,
              high-trust environment.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-gray-400 p-4">
            <Siren className="text-rose-500 w-12 h-12" />
            <h1 className="text-3xl google-sans-400">Emergency Service</h1>
            <p className="google-sans-400 text-center">
              The air ambulance feature is now available to middle class people,
              saving lives.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4">
            <ClipboardClock className="text-amber-500 w-12 h-12" />
            <h1 className="text-3xl google-sans-400">Flexible Timings</h1>
            <p className="google-sans-400 text-center">
              Your health is our priority. We provide flexible timings with
              enriching assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
