import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFavoriteCars from "./../common/Ui/userFavoriteCars";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { savedCars, toggleSave, accessToken } = useFavoriteCars([car]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleToggleSave = (id) => {
    toggleSave({
      carId: id,
      onFail: () => {
        setModalMessage("Please log in or sign up to save this car.");
        setShowModal(true);
      },
    });
  };

  const handleViewDetails = () => {
    if (!accessToken) {
      setModalMessage("Please log in or sign up to view details.");
      setShowModal(true);
      return;
    }

    navigate(`/carDetails/${car.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md relative transition-transform duration-300 hover:scale-105">
      {/* Favori icon */}
      <button
        className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition z-10 ${
          accessToken
            ? savedCars[car.id]
              ? "bg-green-500 text-white"
              : "bg-white hover:bg-gray-200"
            : "bg-white hover:bg-gray-200"
        }`}
        onClick={() => handleToggleSave(car.id)}
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

      {/* Badge-lər */}
      {car.price < 50000 && (
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
          Great Price
        </span>
      )}
      {car.miles <= 100 && (
        <span className="absolute top-10 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
          Low Mileage
        </span>
      )}

      {/* Image */}
      <img
        src={car.carImagePaths[0]?.imagePath}
        alt={car.model}
        className="w-full h-50 object-cover rounded-md"
      />

      {/* Info */}
      <div className="p-7 grid gap-2">
        <h2 className="text-xl mt-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {car.brand} {car.model} - {car.year}
        </h2>

        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="grid gap-3 place-items-center">
            <img src="https://i.postimg.cc/q7WtFCBS/Miles.png" alt="" />
            {car.miles} Miles
          </span>
          <span className="grid gap-3 place-items-center">
            <img src="https://i.postimg.cc/MKVZtrg7/Petrol.png" alt="" />
            {car.fuel}
          </span>
          <span className="grid gap-3 place-items-center">
            <img src="https://i.postimg.cc/tJrczypq/Transmission.png" alt="" />
            {car.transmission}
          </span>
        </div>

        <div>
          <p className="text-xl font-bold mt-2">${car.price}</p>
          <button
            onClick={handleViewDetails}
            className="mt-3 font-medium text-blue-500 flex gap-2 py-2 rounded-lg border-2 border-transparent transition-all duration-300 hover:px-4 transform hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-none"
          >
            View Details
            <img
              className="w-3 h-3"
              src="https://i.postimg.cc/QCmSx9yY/Arrow-Up-Right.png"
              alt=""
            />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center relative transform transition-all scale-105">
            <h2 className="text-xl font-semibold text-gray-800">
              Hold Up ✋
            </h2>
            <p className="text-gray-600 mt-2">{modalMessage}</p>

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
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCard;
