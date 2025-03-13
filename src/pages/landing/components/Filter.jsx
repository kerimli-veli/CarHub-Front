import React, { useState } from "react";

const carData = {
  Audi: ["Q7", "A4", "A6", "R8"],
  BMW: ["X5", "M3", "M5", "i8"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "G-Wagon"],
  Toyota: ["Corolla", "Camry", "RAV4", "Supra"],
};

const Filter = () => {
  const [selectedType, setSelectedType] = useState("New");
  const [selectedMake, setSelectedMake] = useState("Audi");
  const [selectedModel, setSelectedModel] = useState(carData["Audi"][0]);
  const [price, setPrice] = useState(125000);

  const handleBrandChange = (e) => {
    const newMake = e.target.value;
    setSelectedMake(newMake);
    setSelectedModel(carData[newMake][0]);
  };

  return (
    <div className="w-[330px] h-[400px] bg-white shadow-xl rounded-2xl p-4">
      <div className="flex border rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 text-lg font-medium transition-all ${
            selectedType === "New"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={() => setSelectedType("New")}
        >
          New
        </button>
        <button
          className={`flex-1 py-2 text-lg font-medium transition-all ${
            selectedType === "Used"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={() => setSelectedType("Used")}
        >
          Used
        </button>
      </div>

      <div className="mt-3">
        <label className="block text-gray-500 mb-1">Select Makes</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedMake}
          onChange={handleBrandChange}
        >
          {Object.keys(carData).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-gray-500 mb-1">Select Models</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {carData[selectedMake].map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-gray-500 mb-2">Select Price</label>
        <input
          type="range"
          min="0"
          max="250000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
        <div className="flex justify-between text-blue-600 text-sm mt-1">
          <span>$0</span>
          <span>${price.toLocaleString()}</span>
          <span>$250,000</span>
        </div>
      </div>

      <button className="w-full mt-5 bg-blue-600 text-white py-3 rounded-md flex justify-center items-center text-lg transition-all duration-300 hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg">
        🔍 Search
      </button>
    </div>
  );
};

export default Filter;
