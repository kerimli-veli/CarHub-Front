import React from "react";

import Suv from "./../../../assets/images/BrowseByTypeImages/Suv.svg";
import Sedan from "./../../../assets/images/BrowseByTypeImages/Sedan.svg";
import Hatchback from "./../../../assets/images/BrowseByTypeImages/Hatchback.svg";
import Coupe from "./../../../assets/images/BrowseByTypeImages/Coupe.svg";
import Hybrid from "./../../../assets/images/BrowseByTypeImages/Hybrid.svg";
import Convertible from "./../../../assets/images/BrowseByTypeImages/Convertible.svg";
import Van from "./../../../assets/images/BrowseByTypeImages/Van.svg";
import Truck from "./../../../assets/images/BrowseByTypeImages/Truck.svg";
import Electric from "./../../../assets/images/BrowseByTypeImages/Electric.svg";

const carTypes = [
  { name: "SUV", image: Suv },
  { name: "Sedan", image: Sedan },
  { name: "Hatchback", image: Hatchback },
  { name: "Coupe", image: Coupe },
  { name: "Hybrid", image: Hybrid },
  { name: "Convertible", image: Convertible },
  { name: "Van", image: Van },
  { name: "Truck", image: Truck },
  { name: "Electric", image: Electric },
];

const BrowseByType = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-gray-800">Browse by Type</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
        {carTypes.map((car, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-5 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:bg-white hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <img src={car.image} alt={car.name} className="w-16 h-12 mb-3" />
            <span className="text-md font-medium text-gray-700">{car.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseByType;