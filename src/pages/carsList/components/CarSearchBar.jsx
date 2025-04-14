import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const FilterBar = () => {
  const [active, setActive] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const selectedType = queryParams.get("MaxMiles") === "1" ? "New" : queryParams.get("MinMiles") === "0" ? "Used" : null;
  const selectedBrand = queryParams.get("Brand");
  const selectedModel = queryParams.get("Model");
  const maxPrice = queryParams.get("MaxPrice");

  const handleClick = (filter) => {
    setActive(active === filter ? null : filter);
  };

  const handleItemSelect = (filter, item) => {
    const newParams = new URLSearchParams(location.search);

    if (filter === "New or Used") {
      if (item === "New") {
        newParams.set("MaxMiles", "1");
        newParams.delete("MinMiles");
      } else if (item === "Used") {
        newParams.set("MinMiles", "0");
        newParams.delete("MaxMiles");
      }
    } else if (filter === "Any Brands") {
      newParams.set("Brand", item);
    } else if (filter === "Any Models") {
      newParams.set("Model", item);
    } else if (filter === "Prices: All Prices") {
      newParams.set("MaxPrice", item);
    }

    navigate({ search: newParams.toString() });
    setActive(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7282/api/Car/GetAll");
        const data = await response.json();
        const uniqueBrands = [...new Set(data.map((car) => car.brand))];
        const uniqueModels = [...new Set(data.map((car) => car.model))];

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

  const getSelectedValue = (filter) => {
    switch (filter) {
      case "New or Used":
        return selectedType || filter;
      case "Any Brands":
        return selectedBrand || filter;
      case "Any Models":
        return selectedModel || filter;
      case "Prices: All Prices":
        return maxPrice || filter;
      default:
        return filter;
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
            {getSelectedValue(filter)}
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
                <p
                  key={idx}
                  onClick={() => handleItemSelect(filter, item)}
                  className={`text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer ${
                    item === selectedType || item === selectedBrand || item === selectedModel || item === maxPrice
                      ? "bg-gray-200 font-semibold"
                      : ""
                  }`}
                >
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
