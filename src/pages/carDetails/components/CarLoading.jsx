import React from "react";
import { FaCar } from "react-icons/fa";

const CarLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-white text-gray-800">
      <div className="relative mb-4">
        <FaCar className="text-[64px] text-gray-500 animate-pulse" />

        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-t from-blue-500 to-blue-300 animate-fill-up" />
        </div>
      </div>

      <p className="text-lg font-semibold text-gray-600 mt-2 animate-bounce">Loading data...</p>

      <style>
        {`
          @keyframes fillUp {
            0% {
              height: 0%;
              opacity: 0.5;
            }
            50% {
              height: 70%;
              opacity: 0.9;
            }
            100% {
              height: 0%;
              opacity: 0.5;
            }
          }

          .animate-fill-up {
            animation: fillUp 2.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default CarLoading;
