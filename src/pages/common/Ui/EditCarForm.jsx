import { Car, Calendar, Paintbrush, DollarSign, TextCursorInput } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import React from "react";

const EditCarForm = ({ car }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-3xl font-semibold text-gray-900">Edit Your Car</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <Car className="w-4 h-4" /> Brand
          </label>
          <input
            type="text"
            defaultValue={car.brand}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <TextCursorInput className="w-4 h-4" /> Model
          </label>
          <input
            type="text"
            defaultValue={car.model}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" /> Year
          </label>
          <input
            type="number"
            defaultValue={car.year}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <Paintbrush className="w-4 h-4" /> Color
          </label>
          <input
            type="text"
            defaultValue={car.color}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4" /> Price ($)
          </label>
          <input
            type="number"
            defaultValue={car.price}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <TextCursorInput className="w-4 h-4" /> Description
          </label>
          <textarea
            rows={4}
            defaultValue={car.text}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm resize-none"
          />
        </div>
      </div>

      <Button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all duration-300">
        Save Changes
      </Button>
    </motion.div>
  );
};

export default EditCarForm;
