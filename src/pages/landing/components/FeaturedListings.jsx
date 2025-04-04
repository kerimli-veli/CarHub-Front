import React, { useEffect, useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import getUserFromToken from "./../../common/GetUserFromToken";

const fuelTypes = ["None", "Diesel", "Petrol", "Electric"];
const transmissionTypes = ["Automatic", "Manual", "CVT"];

export default function FeaturedListings() {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCars, setSavedCars] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [accessToken, setAccessToken] = useState(""); 

  const itemsPerPage = 4;

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setAccessToken(token);
    }

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
          isFavorite: car.isFavorite,
        }));

        const initialSavedCars = {};
        formattedCars.forEach((car) => {
          initialSavedCars[car.id] = car.isFavorite;
        });

        setCars(formattedCars);
        setSavedCars(initialSavedCars);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getAccessToken = () => {
    return accessToken || Cookies.get("accessToken");
  };

  const toggleSave = (id) => {
    const token = getAccessToken();
    
    if (token) {
      const user = getUserFromToken();
      if (user && user.id) {
        const isCurrentlySaved = savedCars[id];
        const url = isCurrentlySaved
          ? `https://localhost:7282/api/User/RemoveFavoriteCar?UserId=${user.id}&CarId=${id}`
          : `https://localhost:7282/api/User/AddUserFavorites?UserId=${user.id}&CarId=${id}`;

        fetch(url, {
          method: isCurrentlySaved ? "DELETE" : "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.isSuccess !== undefined) {
              setSavedCars((prev) => ({
                ...prev,
                [id]: !isCurrentlySaved,
              }));
            } else {
              console.error("Error: Response does not contain 'isSuccess' property");
            }
          })
          .catch((error) => console.error("Error:", error.message));
      } else {
        setModalMessage("Please log in or sign up to save this car.");
        setShowModal(true);
      }
    } else {
      setModalMessage("Please log in or sign up to save this car.");
      setShowModal(true);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % cars.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? cars.length - (cars.length % itemsPerPage || itemsPerPage)
        : prevIndex - itemsPerPage
    );
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-10 bg-gray-100 rounded-lg relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Listings</h2>
        <button
          onClick={() => (window.location.href = "/carList")}
          className="mt-3 font-medium text-blue-500 flex gap-2 py-2 rounded-lg border-2 border-transparent transition-all duration-300 hover:px-4 transform hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-none"
        >
          View All
        </button>
      </div>

      <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cars.slice(currentIndex, currentIndex + itemsPerPage).map((car) => (
          <div
            key={car.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative"
          >
            <div className="relative">
              <img
                src={car.image}
                alt={car.model}
                className="w-full h-[200px] object-cover"
              />
              <button
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                  accessToken
                    ? savedCars[car.id]
                      ? "bg-green-500 text-white"
                      : "bg-white hover:bg-gray-200"
                    : "bg-white hover:bg-gray-200"
                }`}
                onClick={() => toggleSave(car.id)}
              >
                <Heart
                  size={18}
                  className={`transition-transform ${
                    accessToken
                      ? savedCars[car.id]
                        ? "scale-125 text-white"
                        : "text-gray-700"
                      : "text-gray-700"
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


              <div>
                <p className="text-xl font-bold mt-2">{car.price}</p>
                <button className="mt-3 font-medium text-blue-500 flex gap-2 py-2 rounded-lg border-2 border-transparent transition-all duration-300 hover:px-4 transform hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-none">
                  View Details
                  <img
                    className="w-3 h-3"
                    src="https://i.postimg.cc/QCmSx9yY/Arrow-Up-Right.png"
                    alt=""
                  />
                </button>
              </div>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center relative transform transition-all scale-105">
            <h2 className="text-xl font-semibold text-gray-800">
              Save Your Favorite Cars
            </h2>
            <p className="text-gray-600 mt-2">
              Please log in or sign up to save this car.
            </p>

            <div className="mt-6 flex justify-center space-x-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => (window.location.href = "/signIn")}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign Up
              </button>
            </div>

            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
