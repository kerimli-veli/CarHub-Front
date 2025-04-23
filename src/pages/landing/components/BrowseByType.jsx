import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Suv from "./../../../assets/images/BrowseByTypeImages/Suv.svg";
import Sedan from "./../../../assets/images/BrowseByTypeImages/Sedan.svg";
import Hatchback from "./../../../assets/images/BrowseByTypeImages/Hatchback.svg";
import Coupe from "./../../../assets/images/BrowseByTypeImages/Coupe.svg";
import Hybrid from "./../../../assets/images/BrowseByTypeImages/Hybrid.svg";
import Convertible from "./../../../assets/images/BrowseByTypeImages/Convertible.svg";
import Van from "./../../../assets/images/BrowseByTypeImages/Van.svg";
import Truck from "./../../../assets/images/BrowseByTypeImages/Truck.svg";
import Electric from "./../../../assets/images/BrowseByTypeImages/Electric.svg";

const bodyTypeImages = {
  Suv: Suv,
  Sedan: Sedan,
  Hatchback: Hatchback,
  Coupe: Coupe,
  Hybrid: Hybrid,
  Convertible: Convertible,
  Van: Van,
  Truck: Truck,
  Electric: Electric,
};


const BrowseByType = () => {
  const [bodyTypes, setBodyTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const response = await fetch("https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Car/GetAllBodyTypes");
        const result = await response.json();
  
        console.log("Gelen body types:", result);
  
        setBodyTypes(result);
      } catch (error) {
        console.error("Error fetching body types:", error);
      }
    };
  
    fetchBodyTypes();
  }, []);
  
  

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-gray-800">Browse by Type</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
      {bodyTypes.map((type, index) => (
  <div
    key={index}
    className="flex flex-col items-center justify-center p-5 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:bg-white hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
    onClick={() => {
      const params = new URLSearchParams();
      params.set("Body", type.id); // ID istifadə olunur
      navigate({
        pathname: "/carList", // ya da n hara yönəltmək istəyirsənsə
        search: params.toString(),
      });
    }}
  >
    <img
      src={bodyTypeImages[type.name] || "/images/default.svg"}
      alt={type.name}
      className="w-16 h-12 mb-3"
    />
    <span className="text-md font-medium text-gray-700">{type.name}</span>
  </div>
))}
      </div>
    </div>
  );
};

export default BrowseByType;
