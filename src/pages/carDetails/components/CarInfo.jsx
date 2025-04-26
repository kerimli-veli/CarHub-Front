import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import useFavoriteCars from "../../common/Ui/userFavoriteCars"; 
import CarLoading from "./CarLoading";
import getUserFromToken from "../../common/GetUserFromToken";
import EditCarForm from "../../common/Ui/EditCarForm";
import CarInfoView from "./CarInfoView";
import { motion } from "framer-motion";


const CarInfo = () => {
  const { carId } = useParams(); 
  const [car, setCar] = useState(null);
  const [mainImage, setMainImage] = useState(""); 
  const [otherImages, setOtherImages] = useState([]); 
  const [user, setUser] = useState(null); 
  const { savedCars, toggleSave } = useFavoriteCars([car]);
  const navigate = useNavigate();

  useEffect(() => {
    if (carId) {
      axios.get(`https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Car/GetById?Id=${carId}`)
        .then((res) => {
          const carData = res.data.data;
          setCar(carData);
          setMainImage(carData.carImagePaths[0]?.imagePath);
          setOtherImages(carData.carImagePaths.slice(1, 5));
          const userId = carData.createdBy;
          if (userId) {
            axios.get(`https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/User/GetById?Id=${userId}`)
              .then((userRes) => setUser(userRes.data.data))
              .catch((err) => console.error("İstifadəçi məlumatları xətası:", err));
          }
        })
        .catch((err) => console.error("API xətası:", err));
    }
  }, [carId]);

  const handleSendMessage = () => {
    const sender = getUserFromToken();
    if (!sender) {
      alert("Zəhmət olmasa login olun.");
      return;
    }
    navigate(`/messages/${car.createdBy}`); 
  };

  const handleImageClick = (imagePath, index) => {
    const updatedImages = [...otherImages];
    updatedImages[index] = mainImage;
    setMainImage(imagePath);
    setOtherImages(updatedImages);
  };

  const currentUser = getUserFromToken();
  const isOwner = currentUser && String(currentUser.id) === String(car?.createdBy);

  if (!car || !user) return <CarLoading />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-2"
    >
      <CarInfoView
        car={car}
        user={user}
        isOwner={isOwner}
        mainImage={mainImage}
        otherImages={otherImages}
        handleImageClick={handleImageClick}
        toggleSave={toggleSave}
        savedCars={savedCars}
        handleSendMessage={handleSendMessage}
      />
    </motion.div>
  );
  
};

export default CarInfo;
