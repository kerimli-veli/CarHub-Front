import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";

const FilterBar = () => {
  const [active, setActive] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const handleClick = (filter) => {
    setActive(active === filter ? null : filter);
  };

  useEffect(() => {
    // API-dən brendləri və modelləri al
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7282/api/Car/GetAll");
        const data = await response.json();

        const uniqueBrands = [...new Set(data.map(car => car.brand))];
        const uniqueModels = [...new Set(data.map(car => car.model))];

        setBrands(uniqueBrands);
        setModels(uniqueModels);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  const getDropdownContent = (filter) => {
    switch (filter) {
      case "New or Used":
        return ["New", "Used"];
      case "Any Brands":
        return brands;
      case "Any Models":
        return models;
      case "Prices: All Prices":
        return ["0-10K", "10K-20K", "20K-30K", "30K+"];
      default:
        return [];
    }
  };

  const filters = ["New or Used", "Any Brands", "Any Models", "Prices: All Prices"];

  return (
    <div className="flex gap-3 flex-wrap items-center bg-white shadow-lg rounded-full p-3 mx-auto mt-5">
      {filters.map((filter, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => handleClick(filter)}
            className="p-2 px-4 flex items-center gap-8 text-gray-700 hover:bg-gray-100 transition-all rounded-md"
          >
            {filter}
            <p className="text-[10px]">▼</p>
          </button>
          {active === filter && (
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-white shadow-lg rounded-md p-2 z-10 scrollable-dropdown"
          >
              {getDropdownContent(filter).map((item, idx) => (
                <p key={idx} className="text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer">
                  {item}
                </p>
              ))}
            </motion.div>
          )}

        </div>
      ))}

      <button className="p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-all flex items-center gap-2">
        <FaFilter /> More Filters
      </button>

      <button className="p-2 px-4 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
        <FaSearch /> Find Listing
      </button>
    </div>
  );
};

export default FilterBar;
