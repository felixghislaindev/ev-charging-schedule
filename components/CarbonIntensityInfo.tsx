import React from "react";

interface CarbonIntensityInfoProps {
  forecast: number | null;
  index: string | null;
}

const CarbonIntensityInfo: React.FC<CarbonIntensityInfoProps> = ({ forecast, index }) => {
  return (
    <div className="">
      <div className="bg-green-200 bg-opacity-50 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Carbon Intensity</h2>
        <p className="text-4xl text-green-500 font-semibold">{forecast ?? "N/A"}</p>
        <p className="text-gray-600">{index ? index : "Intensity not available"}</p>
      </div>
    </div>
  );
};

export default CarbonIntensityInfo;

