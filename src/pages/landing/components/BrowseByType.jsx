import React, { useEffect, useState } from "react";

const BrowseByType = () => {
  const [carTypes, setCarTypes] = useState([]);

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await fetch("https://localhost:7282/api/Car/GetAll");
        const data = await response.json();
        setCarTypes(data);
      } catch (error) {
        console.error("Error fetching car types:", error);
      }
    };

    fetchCarTypes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-gray-800">Browse by Type</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
        {carTypes.map((car, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-5 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:bg-white hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <img src={car.bodyTypeImage} alt={car.body} className="w-16 h-12 mb-3"/>
            <span className="text-md font-medium text-gray-700">{car.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseByType;