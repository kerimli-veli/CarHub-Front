import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import React from "react";

const FilterBar = () => {
    const [active, setActive] = useState(null);
  
    const handleClick = (filter) => {
      setActive(active === filter ? null : filter);
    };
  
    return (
      <div className="flex gap-3 flex-wrap items-center bg-white shadow-lg rounded-full p-3 mx-auto mt-5">
        {['Condition', 'Any Makes', 'Any Models', 'Prices: All Prices'].map((filter, index) => (
          <div key={index} className=" relative">
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
                className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2"
              >
                <p className="text-gray-600">Dropdown Content</p>
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