import React from "react";

const BidControls = ({ onBid }) => {
    return (
      <div className="flex gap-3 mt-[20%] justify-center">
        {[100, 250, 350].map((amount) => (
          <button
            key={amount}
            onClick={() => onBid(amount)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +{amount} AZN
          </button>
        ))}
      </div>
    );
  };
  
  export default BidControls;
  