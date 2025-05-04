import React, { useState } from "react";
import { motion } from "framer-motion";

const AuctionPriceDropdown = ({ onSave }) => {
  const [price, setPrice] = useState("");

  const handleSave = () => {
    const numericPrice = parseFloat(price);
    if (!numericPrice || numericPrice <= 0) {
      alert("Zəhmət olmasa düzgün qiymət daxil edin.");
      return;
    }
    onSave(numericPrice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="absolute top-12 left-0 bg-white text-gray-800 p-5 rounded-xl shadow-xl z-20 w-64"
    >
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Start Price</h3>
      <input
        type="number"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="e.g. 1500"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-3"
      />
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Save
      </button>
    </motion.div>
  );
};

export default AuctionPriceDropdown;
