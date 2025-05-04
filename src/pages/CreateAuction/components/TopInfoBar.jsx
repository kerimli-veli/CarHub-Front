import React from "react";

const TopInfoBar = ({ car }) => {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-10 rounded-lg shadow mb-6 w-full">
      {/* Left */}
      <div className="flex flex-col">
        <p className="text-xs text-gray-500">{car.condition || "Used"}</p>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {car.year} {car.brand} {car.model}
          <span className="text-blue-600 text-lg">💙</span>
        </h2>
        <p className="text-sm text-gray-400">{car.body}</p>
      </div>

      {/* Middle */}
      <div className="flex gap-12 text-sm text-gray-700">
        <div className="text-center">
          <p className="font-medium">Mileage</p>
          <p className="text-sm">{car.miles?.toLocaleString() || "—"}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Transmission</p>
          <p className="text-sm">{car.transmission || "—"}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Color</p>
          <p className="text-sm">{car.color}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Fuel</p>
          <p className="text-sm">{car.fuel || "—"}</p>
        </div>
      </div>

      {/* Right */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Start Price</p>
        <p className="text-2xl font-semibold text-gray-800">
          ${car.price || 0} <span className="text-base font-normal"></span>
        </p>
      </div>

      <div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-md mt-2 text-[15px] font-medium">
            Start
        </button>
      </div>
    </div>
  );
};

export default TopInfoBar;
