import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaGavel, FaHourglassHalf } from "react-icons/fa";
import DropdownButton from "./DropdownButton";
import DateDropdown from "./DateDropdown";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const AuctionFilterBar = ({ selectedCarId }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  console.log("test 1:", selectedCarId);
  
  const handleApply = () => {
    if (!selectedCarId) {
      alert("Please select a car first.");
      return;
    }
  
    console.log("test 2:", selectedCarId);
  
    axios
      .get(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/Car/GetById?Id=${selectedCarId}`)
      .then(() => navigate("/AuctionSeller"))
      .catch((error) => {
        console.error("Apply click failed:", error);
      });
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
                  console.log("Saved Time in Parent:", start, end);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <DropdownButton
          icon={<FaGavel size={16} />}
          label="Auction Number"
          active={active === "auction"}
          onClick={() => setActive("auction")}
        />
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
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Apply
      </button>
      </div>
    </motion.div>
  );
}

export default AuctionFilterBar;