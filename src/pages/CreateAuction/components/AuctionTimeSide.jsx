import React from "react";
import { FaClock, FaCalendarAlt, FaUsers, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const formatDate = (datetime) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(datetime).toLocaleDateString(undefined, options);
};

const formatTime = (datetime) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(datetime).toLocaleTimeString(undefined, options);
};

const AuctionTimeSide = ({ auctionData }) => {
  if (!auctionData) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white px-6 py-8 rounded-lg shadow-md w-full">
      {/* Start Date */}
      <div className="flex items-center gap-4">
        <FaCalendarAlt className="text-blue-500 text-xl" />
        <div>
          <p className="text-gray-500 text-sm">Start Date</p>
          <p className="text-gray-800 font-medium">{formatDate(auctionData.startTime)}</p>
        </div>
      </div>

      {/* Start Time */}
      <div className="flex items-center gap-4">
        <FaClock className="text-green-500 text-xl" />
        <div>
          <p className="text-gray-500 text-sm">Start Time</p>
          <p className="text-gray-800 font-medium">{formatTime(auctionData.startTime)}</p>
        </div>
      </div>

      {/* End Time */}
      <div className="flex items-center gap-4">
        <FaHourglassHalf className="text-yellow-500 text-xl" />
        <div>
          <p className="text-gray-500 text-sm">End Time</p>
          <p className="text-gray-800 font-medium">{formatTime(auctionData.endTime)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <FaCheckCircle className={`text-xl ${auctionData.isActive === "True" ? "text-green-600" : "text-gray-400"}`} />
        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <p className={`font-semibold ${auctionData.isActive === "True" ? "text-green-700" : "text-gray-700"}`}>
            {auctionData.isActive}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionTimeSide;
