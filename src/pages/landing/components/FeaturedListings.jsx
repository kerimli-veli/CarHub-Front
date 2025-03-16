import React from "react";

export default function FeaturedListings() {
  const cars = [
    {
      id: 1,
      image: "https://via.placeholder.com/300x200", 
      tag: "Great Price",
      model: "Ford Transit",
      year: "2021",
      mileage: "2500 Miles",
      fuel: "Diesel",
      transmission: "Manual",
      price: "$22,000"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x200",
      tag: "Low Mileage",
      model: "New GLC",
      year: "2023",
      mileage: "50 Miles",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "$95,000"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x200",
      tag: "New",
      model: "Audi A6 3.5",
      year: "New",
      mileage: "100 Miles",
      fuel: "Petrol",
      transmission: "Automatic",
      price: "$58,000"
    },
    {
      id: 4,
      image: "https://via.placeholder.com/300x200",
      tag: "New",
      model: "Corolla Altis",
      year: "2023",
      mileage: "8000 Miles",
      fuel: "Petrol",
      transmission: "CVT",
      price: "$45,000"
    }
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Featured Listings</h2>
      <div className="flex gap-4 overflow-x-auto">
        {cars.map((car) => (
          <div key={car.id} className="w-72 bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={car.image} alt={car.model} className="w-full h-40 object-cover" />
            <div className="p-4">
              <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded">
                {car.tag}
              </span>
              <h3 className="mt-2 font-semibold">{car.model} - {car.year}</h3>
              <p className="text-sm text-gray-600">{car.mileage} - {car.fuel} - {car.transmission}</p>
              <p className="text-lg font-bold mt-2">{car.price}</p>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
