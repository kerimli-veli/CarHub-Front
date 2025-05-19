import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";

export default function DateDropdown({ onSave }) {
  const [startDate, setStartDate] = useState("2019-11-03");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("2019-12-04");
  const [endTime, setEndTime] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState(null);
  const [message, setMessage] = useState("");

  const shortcuts = ["Today"];

  const handleShortcutClick = (label) => {
    const today = new Date();
    let start = new Date(today.setHours(0, 0, 0, 0));
    let end = new Date();
    setSelectedShortcut(label);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
  };

  const isReadyToSave = () => startTime && endTime;

  const handleSave = () => {
    if (!isReadyToSave()) return;
  
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);
  
    if (onSave) onSave(startDateTime, endDateTime);
  
    setMessage("Time saved!");
    setTimeout(() => setMessage(""), 3000);
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="absolute left-0 top-[60px] w-[320px] bg-white shadow-md rounded-xl z-50 p-4 text-sm space-y-3"
    >

      <div className="space-y-3">
        <div>
          <label className="block text-gray-500 mb-1 ml-1">Start Date & Time</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedShortcut(null);
              }}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 mb-1 ml-1">End Date & Time</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedShortcut(null);
              }}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
        </div>
      </div>


      {shortcuts.map((label) => (
        <button
          key={label}
          onClick={() => handleShortcutClick(label)}
          className={`w-full py-2 rounded-lg border transition ${
            selectedShortcut === label
              ? "border-blue-500 bg-blue-50 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}


      <div className="pt-2">
        <button
          disabled={!isReadyToSave()}
          onClick={handleSave}
          className={`w-full py-2 rounded-lg transition font-medium ${
            isReadyToSave()
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-blue-300 text-white cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>


      {message && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-md text-sm font-medium z-50"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
