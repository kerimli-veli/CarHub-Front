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
    <div className="bg-white rounded-2xl shadow-md relative transition hover:shadow-lg overflow-hidden">
      
      <div className="relative h-52 w-full">
        <img
          src={car.carImagePaths?.[0]?.imagePath || "https://via.placeholder.com/400"}
          alt={car.model}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow">
          1/{car.carImagePaths?.length || 1}
        </span>
        <button
          onClick={() => handleToggleSave(car.id)}
          className={`absolute top-2 right-2 p-2 rounded-full shadow transition ${
            accessToken && savedCars[car.id] ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100"
          }`}
        >
          <Heart
            size={18}
            className={`${
              accessToken && savedCars[car.id] ? "text-white" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      {/* Badges */}
      {car.price < 50000 && (
        <span className="absolute top-14 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
          Great Price
        </span>
      )}
      {car.miles <= 100 && (
        <span className="absolute top-24 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-xl">
          Low Mileage
        </span>
      )}

      {/* Car Info */}
      <div className="p-5">
        <h2 className="text-lg font-semibold truncate">{car.brand} {car.model} - {car.year}</h2>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <div className="flex flex-col items-center">
            <img src="https://i.postimg.cc/q7WtFCBS/Miles.png" alt="Miles" className="w-5 h-5" />
            {car.miles} mi
          </div>
          <div className="flex flex-col items-center">
            <img src="https://i.postimg.cc/MKVZtrg7/Petrol.png" alt="Fuel" className="w-5 h-5" />
            {car.fuel}
          </div>
          <div className="flex flex-col items-center">
            <img src="https://i.postimg.cc/tJrczypq/Transmission.png" alt="Gear" className="w-5 h-5" />
            {car.transmission}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-center">HP</span>
            {car.horsePower || 200}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-lg font-bold text-gray-900">${car.price}</p>
          <p className="text-xs text-gray-500 truncate">{car.text}</p>

          <button
            onClick={handleViewDetails}
            className="mt-3 w-full text-center bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            View Deal
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold">Hold Up ✋</h3>
            <p className="text-sm mt-2">{modalMessage}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => (window.location.href = "/signIn")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => (window.location.href = "/signup")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
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
