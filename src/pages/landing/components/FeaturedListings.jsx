import React, { useEffect, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

const fuelTypes = ["None","Diesel", "Petrol", "Electric"];
const transmissionTypes = ["Automatic", "Manual", "CVT"];

export default function FeaturedListings() {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [savedCars, setSavedCars] = useState({});
  const itemsPerPage = 4;

  useEffect(() => {
    fetch("https://localhost:7282/api/Car/GetAll")
      .then((response) => response.json())
      .then((data) => {
        const formattedCars = data.map((car, index) => ({
          id: car.id,
          image:
            car.carImagePaths.length > 0
              ? car.carImagePaths[0].imagePath
              : "https://via.placeholder.com/300x200",
          tag:
            index % 4 === 0
              ? "Great Price"
              : index % 4 === 1
              ? "Low Mileage"
              : index % 4 === 2
              ? "New"
              : "Featured",
          model: `${car.brand} ${car.model}`,
          year: car.year,
          mileage: car.miles,
          fuel: fuelTypes[car.fuel] || "Unknown",
          transmission: transmissionTypes[car.transmission] || "Unknown",
          price: `$${car.price.toLocaleString()}`,
        }));
        setCars(formattedCars);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredCars = cars.filter((car) => {
    if (filter === "new") return car.mileage === 0;
    if (filter === "used") return car.mileage > 0;
    return true;
  });

  const toggleSave = (id) => {
    setSavedCars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % filteredCars.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? filteredCars.length - (filteredCars.length % itemsPerPage || itemsPerPage)
        : prevIndex - itemsPerPage
    );
  };

  return (
    <div className="p-10 bg-gray-100 rounded-lg relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Listings</h2>
        <a href="/carList" className="text-blue-600 hover:underline flex gap-2">
          View All
          <img className="w-3 h-3" src="https://i.postimg.cc/QCmSx9yY/Arrow-Up-Right.png" alt="" />
        </a>
      </div>

      <div className="flex space-x-6 mb-6 border-b pb-2">
        <button
          className={`text-lg font-semibold border-b-2 ${filter === "all" ? "border-blue-600" : "text-gray-500 hover:text-black"}`}
          onClick={() => setFilter("all")}
        >
          In Stock
        </button>
        <button
          className={`text-lg font-semibold border-b-2 ${filter === "new" ? "border-blue-600" : "text-gray-500 hover:text-black"}`}
          onClick={() => setFilter("new")}
        >
          New Cars
        </button>
        <button
          className={`text-lg font-semibold border-b-2 ${filter === "used" ? "border-blue-600" : "text-gray-500 hover:text-black"}`}
          onClick={() => setFilter("used")}
        >
          Used Cars
        </button>
      </div>

      <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCars.slice(currentIndex, currentIndex + itemsPerPage).map((car) => (
          <div
            key={car.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative"
          >
            <div className="relative">
              <img src={car.image} alt={car.model} className="w-full h-45 object-cover" />
              <button
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                  savedCars[car.id] ? "bg-green-500 text-white" : "bg-white hover:bg-gray-200"
                }`}
                onClick={() => toggleSave(car.id)}
              >
                <Bookmark
                  size={18}
                  className={`transition-transform ${
                    savedCars[car.id] ? "scale-125 text-white" : "text-gray-700"
                  }`}
                />
              </button>
              <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 bg-green-200 text-green-800 rounded">
                {car.tag}
              </span>
            </div>

            <div className="p-4 flex flex-col justify-between min-h-[130px]">
              <h3 className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
                {car.model} – {car.year}
              </h3>

              <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                {car.mileage} Miles • {car.fuel} • {car.transmission}
              </p>

              <p className="text-lg font-bold mt-2">{car.price}</p>

              <a
                href=""
                className="text-blue-600 hover:underline text-s flex items-center h-6 gap-2"
              >
                <span className="whitespace-nowrap overflow-hidden font-normal text-ellipsis">View Details</span>
                <img className="w-3 h-3" src="https://i.postimg.cc/QCmSx9yY/Arrow-Up-Right.png" alt="" />
              </a>
            </div>

          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex space-x-3">
        <button
          onClick={prevSlide}
          className="p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
