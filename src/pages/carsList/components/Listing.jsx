import { useState, useEffect } from "react";
import React from "react";
import CarCard from "../../common/CarCard";
import { useLocation } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;
  const location = useLocation();

  useEffect(() => {
    const fetchFilteredCars = async () => {
      try {
        const params = new URLSearchParams(location.search);
        let url = "";
        let data = null;
  
        if ([...params].length > 0) {
          url = `https://localhost:7282/api/Car/CarFilter?${params.toString()}`;
          const response = await fetch(url);
          const result = await response.json();
          data = result?.data;
        } else {
          const response = await fetch("https://localhost:7282/api/Car/GetAll");
          const result = await response.json();
          data = Array.isArray(result) ? result : result?.data;
        }
  
        setCars(data || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]); 
      }
    };
  
    fetchFilteredCars();
  }, [location.search]);
  

  const totalPages = Math.ceil(cars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div className="bg-gray-100 min-h-screen p-35 rounded-[100px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl mt-10 font-semibold mb-15">Listing</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {currentCars.length === 0 ? (
  <div className="col-span-full text-center mt-20 flex flex-col items-center justify-center">
    <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mb-4" />
    <p className="text-gray-600 text-xl font-medium">
      Axtarışa uyğun maşın tapılmadı.
    </p>
  </div>
) : (
  currentCars.map((car) => (
    <CarCard key={car.id} car={car} />
  ))
)}

</div>


        <div className="flex items-center justify-center space-x-2 mt-[4%]">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                currentPage === page + 1
                  ? "bg-black text-white scale-110 shadow-md"
                  : "text-black hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              className="w-10 h-8 flex items-center justify-center rounded-full border transition-all duration-300 hover:bg-gray-200 active:scale-90"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListing;
