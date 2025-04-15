import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FilterBar = () => {
  const [active, setActive] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedBodyType, setSelectedBodyType] = useState("Body Type");
  const [bodyTypeActive, setBodyTypeActive] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const selectedType = queryParams.get("MaxMiles") === "1" ? "New" : queryParams.get("MinMiles") === "0" ? "Used" : null;
  const selectedBrand = queryParams.get("Brand");
  const selectedModel = queryParams.get("Model");
  const maxPrice = queryParams.get("MaxPrice");

  const handleClick = (filter) => setActive(active === filter ? null : filter);

  const handleItemSelect = (filter, item) => {
    const newParams = new URLSearchParams(location.search);
    if (filter === "New or Used") {
      item === "New" ? (newParams.set("MaxMiles", "1"), newParams.delete("MinMiles")) :
                      (newParams.set("MinMiles", "0"), newParams.delete("MaxMiles"));
    } else if (filter === "Brand") newParams.set("Brand", item);
    else if (filter === "Model") newParams.set("Model", item);
    else if (filter === "Price") newParams.set("MaxPrice", item);
    else if (filter === "Body Type") {
      newParams.set("BodyType", item);
      setSelectedBodyType(item);
      setBodyTypeActive(false);
    }

    navigate({ search: newParams.toString() });
    setActive(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7282/api/Car/GetAll");
        const data = await response.json();
        setBrands([...new Set(data.map((car) => car.brand))]);
        setModels([...new Set(data.map((car) => car.model))]);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const response = await fetch("https://localhost:7282/api/Car/GetAllBodyTypes");
        const result = await response.json();
        console.log("Body types response:", result);
        setBodyTypes(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching body types:", error);
        setBodyTypes([]);
      }
    };

    if (showMoreFilters) fetchBodyTypes();
  }, [showMoreFilters]);

  const filters = [
    { key: "New or Used", label: selectedType || "New or Used", options: ["New", "Used"] },
    { key: "Brand", label: selectedBrand || "Brand", options: Array.isArray(brands) ? brands : [] },
    { key: "Model", label: selectedModel || "Model", options: Array.isArray(models) ? models : [] },
    { key: "Price", label: maxPrice || "Price", options: ["0-10K", "10K-20K", "20K-30K", "30K+"] },
  ];

  return (
    <motion.div
      layout
      className="bg-white shadow-md rounded-2xl px-6 py-4 mt-6 w-full max-w-[1200px] mx-auto transition-all duration-300"
    >
      <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-between">
        {filters.map(({ key, label, options }) => (
          <div key={key} className="relative">
            <button
              onClick={() => handleClick(key)}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:bg-blue-100 transition"
            >
              {label} <span className="ml-1">▼</span>
            </button>
            <AnimatePresence>
              {active === key && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 w-44 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20"
                >
                  {Array.isArray(options) && options.length > 0 ? (
                    options.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleItemSelect(key, item)}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-all ${
                          item === label ? "bg-blue-100 font-semibold" : ""
                        }`}
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">No options found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
          >
            {showMoreFilters ? "Hide Filters" : "More Filters"}
          </button>

          <button className="bg-blue-800 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-900 transition text-sm font-medium shadow-sm">
            <FaSearch /> Find Listing
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <button
                    onClick={() => setBodyTypeActive(!bodyTypeActive)}
                    className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:bg-blue-100 transition"
                  >
                    {selectedBodyType || "Select Body Type"} <span className="ml-1">▼</span>
                  </button>
                  <AnimatePresence>
                    {bodyTypeActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 mt-2 w-44 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20"
                      >
                        {Array.isArray(bodyTypes) && bodyTypes.length > 0 ? (
                          bodyTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={() => handleItemSelect("Body Type", type.name)}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-all ${
                                selectedBodyType === type.name ? "bg-blue-100 font-semibold" : ""
                              }`}
                            >
                              {type.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-400">No body types found</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 font-medium mb-2">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {["Black", "White", "Gray", "Red", "Blue", "Green"].map((color) => (
                    <button
                      key={color}
                      className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-800 hover:bg-blue-50 transition"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterBar;
