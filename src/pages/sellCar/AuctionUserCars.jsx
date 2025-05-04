import React, { useEffect, useState } from 'react';
import getUserFromToken from "./../common/GetUserFromToken";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import CarCardAuction from './CarCardAuction';  
import AuctionFilterBar from './AuctionFilterBar';

const AuctionUserCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [userId, setUserId] = useState(null);  
  const [errorMessage, setErrorMessage] = useState("");

  const normalizeImagePath = (path) => {
    const baseImageUrl = "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/";

    if (!path) return "https://via.placeholder.com/300x200";  
    return path.startsWith("http") ? path : `${baseImageUrl}${path}`;  
  };

  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const user = getUserFromToken();
        setUserId(user.id);  

        const token = Cookies.get("accessToken");

        const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/GetUserCars?UserId=${user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const formattedCars = data.data.map((car, index) => ({
          id: car.id,
          image: car.carImagePaths.length > 0 && car.carImagePaths[0].mainImage
            ? normalizeImagePath(car.carImagePaths[0].mainImage)
            : "https://via.placeholder.com/300x200",
          model: `${car.brand} ${car.model}`,
          year: car.year,
          mileage: car.miles,
          fuel: car.fuel || "Unknown",
          transmission: car.transmission || "Unknown",
          body: car.body || "Unknown",
          price: `$${car.price.toLocaleString()}`,
        }));

        setCars(formattedCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);
  

  const handleSelect = (carId) => {
    if (selectedCarId && selectedCarId !== carId) {
        console.log("Selected car ID on select:", carId);
      setErrorMessage("You can choice only one car");
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      setSelectedCarId(carId === selectedCarId ? null : carId);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AuctionFilterBar selectedCarId={selectedCarId} />
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md z-50 shadow-lg"
          >
            You can choice only one car
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-wrap justify-center">
        {cars.map((car) => (
          <CarCardAuction
            key={car.id}
            car={car}
            selectedCarId={selectedCarId} 
            userId={userId}  
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionUserCars;
