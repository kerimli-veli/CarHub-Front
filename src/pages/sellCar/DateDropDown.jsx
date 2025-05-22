import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";

export default function DateDropdown({ onSave }) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("Today");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const setMessageWithType = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 4000);
  };

  useEffect(() => {
    const now = new Date();
  
    const isoDate = now.toISOString().slice(0, 10);
  
    const startHours = String(now.getHours()).padStart(2, "0");
    const startMinutes = String(now.getMinutes()).padStart(2, "0");
    const startTime = `${startHours}:${startMinutes}`;
  
    const end = new Date(now.getTime() + 1 * 60 * 1000);
    const endHours = String(end.getHours()).padStart(2, "0");
    const endMinutes = String(end.getMinutes()).padStart(2, "0");
    const endTime = `${endHours}:${endMinutes}`;
  
    setStartDate(isoDate);
    setEndDate(isoDate);
    setStartTime(startTime);
    setEndTime(endTime);
  }, []);
  
  const handleStartTimeChange = (value) => {
    setStartTime(value);
  
    const [hour, minute] = value.split(":").map(Number);
    const start = new Date(`${startDate}T${value}:00`);
    const end = new Date(start.getTime() + 1 * 60000); 
  
    const newEndTime = end.toTimeString().slice(0, 5);
    const newEndDate = end.toISOString().slice(0, 10);
  
    setEndTime(newEndTime);
    setEndDate(newEndDate);
  };

  const handleEndTimeChange = (value) => {
    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${endDate}T${value}:00`);
  
    const diffInMinutes = (end - start) / (1000 * 60);
  
    if (end <= start) {
      setMessageWithType("End time must be later than start time.", "error");
      return;
    }
  
    if (diffInMinutes < 1) {
      setMessageWithType("Minimum auction duration is 1 minutes.", "error");
      return;
    }
  
    setEndTime(value);
  };

  const getCorrectedDate = (value) => {
    const selected = new Date(value);
    const day = String(selected.getDate()).padStart(2, "0");
    const fixedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${day}`;
    return fixedDate;
  };

  const handleStartDateChange = (value) => {
    const corrected = getCorrectedDate(value);
    setStartDate(corrected);

    if (new Date(corrected) > new Date(endDate)) {
      setEndDate(corrected);
    }

    setSelectedShortcut(null);
  };

  const handleEndDateChange = (value) => {
    const corrected = getCorrectedDate(value);
    if (new Date(corrected) >= new Date(startDate)) {
      setEndDate(corrected);
    } else {
      setMessageWithType("End date cannot be earlier than start date.", "error");
    }
    setSelectedShortcut(null);
  };

  const isReadyToSave = () => startTime && endTime;

  const handleSave = () => {
    if (!isReadyToSave()) return;

    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    const diffInMinutes = (endDateTime - startDateTime) / (1000 * 60);
    if (diffInMinutes < 1) {
      setMessageWithType("Minimum auction duration is 1 minutes.", "error");
      return;
    }

    if (onSave) onSave(startDateTime, endDateTime);

    setMessageWithType("Time saved!", "success");
  };

  const maxDate = today.toISOString().slice(0, 10);
  const minDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;

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
              min={minDate}
              max={maxDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
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
              min={startDate}
              max={maxDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
        </div>
      </div>

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
          className={`absolute top-[-60px] left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-sm font-medium z-50 ${
            messageType === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
