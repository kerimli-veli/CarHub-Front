import React from "react";
import { useNavigate } from "react-router-dom";

const CartEmpty = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[350px] w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
      <img
        src="/empty-cart.png"
        alt="Empty Cart"
        className="absolute inset-0 object-cover w-full h-full opacity-40"
      />
      <div className="relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-md">
          Your cart is currently empty
        </h2>
        <button
          onClick={() => navigate("/shopPage")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default CartEmpty;