import React from "react";

const AuctionTimer = ({ seconds }) => {
  return (
    <div className="absolute ">
      <div className="bg-white border border-gray-300 px-4 py-1 rounded-md shadow-sm text-gray-800 text-sm font-medium">
        ⏱ {seconds}s
      </div>
    </div>
  );
};

export default AuctionTimer;
