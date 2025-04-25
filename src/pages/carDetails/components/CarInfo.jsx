import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./../../common/Ui/button";
import { Card, CardContent } from "./../../common/Ui/card";
import { FaWhatsapp } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { FaCalendarAlt, FaRoad, FaCogs, FaGasPump, FaShareAlt, FaHeart, FaBalanceScale } from "react-icons/fa";
import { Car, Calendar, Gauge, Fuel, Settings, DoorOpen, BadgeCent, Thermometer, Palette, KeyRound, Barcode } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom"; 
import useFavoriteCars from "../../common/Ui/userFavoriteCars"; 
import CarLoading from "./CarLoading";
import getUserFromToken from "../../common/GetUserFromToken";
import EditCarForm from "../../common/Ui/EditCarForm";


const CarInfo = () => {
  const { carId } = useParams(); 
  const [car, setCar] = useState(null);
  const [mainImage, setMainImage] = useState(""); 
  const [otherImages, setOtherImages] = useState([]); 
  const [user, setUser] = useState(null); 
  const { savedCars, toggleSave } = useFavoriteCars([car]);
  const navigate = useNavigate();

  
  useEffect(() => {
    console.log("carId:", carId);

    if (carId) {
      axios
      axios.get(`https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Car/GetById?Id=${carId}`)

    
        .then((res) => {
          const carData = res.data.data;
          setCar(carData);
          setMainImage(carData.carImagePaths[0]?.imagePath);
          setOtherImages(carData.carImagePaths.slice(1, 5));
  
          const userId = carData.createdBy;
          if (userId) {
            axios
              .get(`https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/User/GetById?Id=${userId}`)
              .then((userRes) => {
                setUser(userRes.data.data);
              })
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

  
  const currentUser = getUserFromToken();
const isOwner = currentUser && String(currentUser.id) === String(car?.createdBy);


  if (!car || !user) return <CarLoading />;

  const handleImageClick = (imagePath, index) => {
    const updatedImages = [...otherImages];
    updatedImages[index] = mainImage;
    setMainImage(imagePath);
    setOtherImages(updatedImages);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{`${car.brand} ${car.model} New`}</h1>
              <p className="text-gray-500 text-sm">{car.text}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors">
                <FaShareAlt /> Share
              </button>

              <button
                  onClick={() => toggleSave({ carId: car.id })}
                  className={`flex items-center gap-1 text-sm ${
                    savedCars[car.id] ? "text-red-500" : "text-gray-600"
                  } hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors`}
                >
                  <FaHeart /> {savedCars[car.id] ? "Saved" : "Save"}
              </button>

              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors">
                <FaBalanceScale /> Compare
              </button>
            </div>
          </div>

          <div className="flex gap-2 my-3">
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              <FaCalendarAlt /> {car.year}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              <FaRoad /> {car.miles} miles
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              <FaCogs /> {car.transmission}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              <FaGasPump /> {car.fuel}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
            <div className="lg:col-span-2 relative h-[420px]">
              <img
                src={mainImage}
                alt={car.model}
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ${car.price}
              </span>
              <Button className="absolute bottom-4 left-4 flex items-center gap-2 text-black bg-white hover:bg-gray-100 shadow-md">
                <MdVideoLibrary /> Video
              </Button>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[420px]">
              {otherImages.map((img, index) => (
                <img
                  key={index}
                  src={img.imagePath || img}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                  alt={`car-${index + 1}`}
                  onClick={() => handleImageClick(img.imagePath || img, index)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Car Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-600" />
                <span><strong>Body:</strong> {car.body}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-600" />
                <span><strong>Mileage:</strong> {car.miles}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-gray-600" />
                <span><strong>Fuel Type:</strong> {car.fuel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span><strong>Year:</strong> {car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-gray-600" />
                <span><strong>Transmission:</strong> {car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-600" />
                <span><strong>Color:</strong> {car.color}</span>
              </div>
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-gray-600" />
                <span><strong>VIN:</strong> {car.vin}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full py-3 text-white bg-green-500 hover:bg-green-600 font-bold text-lg rounded-lg shadow-md transition-colors">
              Buy Now
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
  {isOwner ? (
    <div className="mt-10">
    <EditCarForm car={car} />
  </div>
  
  ) : (
    <Card>
      <CardContent className="p-6 text-center">
        <img
          src={user.userImagePath || "https://randomuser.me/api/portraits/men/32.jpg"}
          className="w-16 h-16 rounded-full mx-auto mb-2"
          alt="admin"
        />
        <p className="font-bold">{user.name}</p>
        <p className="text-sm text-gray-500 mb-2">{user?.address || "943 Broadway, Brooklyn"}</p>
        <Button variant="link" className="text-blue-600 underline">Get Direction</Button>
        <p className="text-sm text-gray-700 mt-2"><IoMdCall className="inline mr-1" /> {user.phone}</p>
        <p className="text-sm text-gray-700 mt-2"><FaWhatsapp className="inline mr-1" /> {user.whatsapp}</p>
        <Button onClick={handleSendMessage} className="mt-4 w-full py-2 text-white bg-blue-600 hover:bg-blue-700">Message Dealer</Button>
      </CardContent>
    </Card>
  )}
</div>
      </div>
    </div>
  );
};

export default CarInfo;
