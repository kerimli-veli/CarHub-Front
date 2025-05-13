import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaGavel, FaHourglassHalf } from "react-icons/fa";
import DropdownButton from "./DropdownButton";
import DateDropdown from "./DateDropdown";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import AuctionPriceDropdown from "./AuctionStartPrice";
import getUserFromToken from "../common/GetUserFromToken";

const AuctionFilterBar = ({ selectedCarId }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [price, setPrice] = useState(null);

  const handleApply = async () => {
  if (!selectedCarId || !startTime || !endTime || !price) {
    alert("Zəhmət olmasa bütün sahələri doldurun.");
    return;
  }

  const user = getUserFromToken();

  if (!user || !user.id) {
    alert("İstifadəçi tapılmadı.");
    return;
  }

  const auctionData = {
    carId: selectedCarId,
    sellerId: user.id,
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
    startingPrice: price,
  };

  try {
    const response = await axios.post(
      "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction",
      auctionData
    );

    const auctionId = response.data.data.id; 
    console.log("Auction created:", response.data.data);
    
    console.log(auctionId);
    navigate(`/CreateAuction/${auctionId}`);

  } catch (error) {
    console.error("Auction creation failed:", error);
    alert("Auction yaradılarkən xəta baş verdi.");
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="relative mx-auto my-10 bg-[#2F3B52] px-8 py-4 rounded-2xl shadow-md w-[80%] flex items-center gap-4 justify-center"
    >
      <div className="flex items-center gap-5 flex-grow relative">
        <div className="relative">
          <DropdownButton
            icon={<FaCalendarAlt size={16} />}
            label="Activation Date"
            active={active === "date"}
            onClick={() => setActive(active === "date" ? "" : "date")}
          />
          <AnimatePresence>
            {active === "date" && (
              <DateDropdown
                onSave={(start, end) => {
                  setStartTime(start);
                  setEndTime(end);
                  setActive(""); 
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <DropdownButton
            icon={<FaGavel size={16} />}
            label="Auction start price"
            active={active === "auction"}
            onClick={() => setActive(active === "auction" ? "" : "auction")}
          />
          <AnimatePresence>
            {active === "auction" && (
              <AuctionPriceDropdown
                onSave={(value) => {
                  setPrice(value);
                  setActive(""); 
                }}
              />
            )}

          </AnimatePresence>
        </div>

        <DropdownButton
          icon={<FaHourglassHalf size={16} />}
          label="Status"
          active={active === "status"}
          onClick={() => setActive("status")}
        />
      </div>

      <div className="flex items-center gap-3">
      <button
        onClick={handleApply}
        disabled={!selectedCarId}
        className={`px-6 py-2 rounded-md transition text-white ${!selectedCarId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        Apply
      </button>

      </div>
    </motion.div>
  );
}

export default AuctionFilterBar;