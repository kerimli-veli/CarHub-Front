import React from "react";

const AuctionTimer = ({ seconds }) => {
    return (
      <div className="mt-2 text-center">
        <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-semibold">
        {seconds}
        </span>
      </div>
    );
  };
  
  export default AuctionTimer;
  