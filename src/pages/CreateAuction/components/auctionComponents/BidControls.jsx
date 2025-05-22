import React from "react";

const BidControls = ({ onBid }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 sm:mt-10">
      {[100, 250, 350].map((amount) => (
        <button
          key={amount}
          onClick={() => onBid(amount)}
          className="px-3 py-2 sm:px-5 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition"
        >
          +{amount} AZN
        </button>
      ))}
    </div>
  );
};

export default BidControls;
