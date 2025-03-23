import { useState, useEffect } from "react";
import React from "react";

const FuelTypes = [
  { id: 1, name: "Diesel" },
  { id: 2, name: "Petrol" },
  { id: 3, name: "Electric" },
];

const TransmissionTypes = [
  { id: 1, name: "Automatic" },
  { id: 2, name: "Manual" },
];

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  useEffect(() => {
    fetch("https://localhost:7282/api/Car/GetAll")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getFuelType = (fuelId) => {
    const fuel = FuelTypes.find(f => f.id === fuelId);
    return fuel ? fuel.name : "Unknown";
  };

  const getTransmissionType = (transmissionId) => {
    const transmission = TransmissionTypes.find(t => t.id === transmissionId);
    return transmission ? transmission.name : "Unknown";
  };

  // Səhifələmə loqikası
  const totalPages = Math.ceil(cars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div className="bg-gray-100 min-h-screen p-35 rounded-[100px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl mt-10 font-semibold mb-15">Listing</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentCars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md relative transition-transform duration-300 hover:scale-105">
              {car.price < 50000 && (
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
                  Great Price
                </span>
              )}
              {car.miles <= 100 && (
                <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
                  Low Mileage
                </span>
              )}
              
              <img
                src={car.carImagePaths[0]?.imagePath}
                alt={car.model}
                className="w-full h-50 object-cover rounded-md"
              />
              <div className="p-7 grid gap-2">
                <h2 className="text-xl mt-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{car.brand} {car.model} - {car.year}</h2>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span className="grid gap-3 place-items-center">
                    <img src="https://i.postimg.cc/q7WtFCBS/Miles.png" alt="" />
                    {car.miles} Miles
                  </span>
                  <span className="grid gap-3 place-items-center">
                    <img src="https://i.postimg.cc/MKVZtrg7/Petrol.png" alt="" />
                    {getFuelType(car.fuel)}
                  </span>
                  <span className="grid gap-3 place-items-center">
                    <img src="https://i.postimg.cc/tJrczypq/Transmission.png" alt="" />
                    {getTransmissionType(car.transmission)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold mt-2">${car.price}</p>
                  <button className="mt-3 font-medium text-blue-500 flex gap-2 py-2 rounded-lg border-2 border-transparent transition-all duration-300 hover:px-4 transform hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-none">
                    View Details 
                    <img className="w-3 h-3" src="https://i.postimg.cc/QCmSx9yY/Arrow-Up-Right.png" alt="" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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