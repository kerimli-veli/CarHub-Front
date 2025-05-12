import React from "react";

const BidControls = ({ onBid }) => {
    return (
      <div className="flex gap-2 mt-4">
        {[100, 250, 350].map((amount) => (
          <button
            key={amount}
            onClick={() => onBid(amount)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            +{amount} AZN
          </button>
        ))}
      </div>
    );
  };
  
  export default BidControls;
  