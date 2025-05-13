import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Filter = () => {
  const [selectedType, setSelectedType] = useState("New");
  const [makeModelMap, setMakeModelMap] = useState({});
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("None");
  const [price, setPrice] = useState(125000);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAll");
        const data = await response.json();

        const brandMap = {};
        data.forEach((car) => {
          const { brand, model } = car;
          if (!brandMap[brand]) {
            brandMap[brand] = new Set();
          }
          brandMap[brand].add(model);
        });

        const finalMap = {};
        Object.keys(brandMap).forEach((brand) => {
          finalMap[brand] = Array.from(brandMap[brand]);
        });

        setMakeModelMap(finalMap);

        const defaultMake = Object.keys(finalMap)[0];
        setSelectedMake(defaultMake);
        setSelectedModel("None");
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCars();
  }, []);

  const navigate = useNavigate();

const handleSearch = () => {
  const filters = {
    Brand: selectedMake,
    MinPrice: "0",
    MaxPrice: price.toString(),
  };

  if (selectedModel !== "None") {
    filters.Model = selectedModel;
  }

  if (selectedType === "New") {
    filters.MaxMiles = "1";
  } else {
    filters.MinMiles = "0";
  }

  const filteredParams = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== "" && value !== undefined && value !== null
    )
  );

  const queryParams = new URLSearchParams(filteredParams).toString();
  navigate(`/carList?${queryParams}`);
};


  const handleBrandChange = (e) => {
    const newMake = e.target.value;
    setSelectedMake(newMake);
    setSelectedModel("None");
  };

  return (
    <div className="w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px] bg-white shadow-xl rounded-2xl p-3.5">
      <div className="flex border rounded-lg overflow-hidden">
        {["New", "Used"].map((type) => (
          <button
            key={type}
            className={`flex-1 py-2 text-lg font-medium transition-all duration-300 ${
              selectedType === type
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-gray-500 mb-1">Select Make</label>
        <select
          className="w-full p-3 border rounded-md bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedMake}
          onChange={handleBrandChange}
        >
          {Object.keys(makeModelMap).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-500 mb-1">Select Model</label>
        <select
          className="w-full p-3 border rounded-md bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="None">None</option>
          {(makeModelMap[selectedMake] || []).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-500 mb-2">Select Price</label>
        <input
          type="range"
          min="0"
          max="1000000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-blue-600 text-sm mt-1">
          <span>$0</span>
          <span>${price.toLocaleString()}</span>
          <span>$1,000,000</span>
        </div>
      </div>

      <button
        className="w-full mt-5 bg-blue-600 text-white py-3 rounded-md flex justify-center items-center text-lg transition-all duration-300 hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg"
        onClick={handleSearch}
      >
        🔍 Search
      </button>
    </div>
  );
};

export default Filter;
