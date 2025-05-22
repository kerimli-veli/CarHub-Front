import React, { useState } from "react";
import { Button } from "./../../common/Ui/button";
import { Card, CardContent } from "./../../common/Ui/card";
import { MdVideoLibrary } from "react-icons/md";
import { FaShareAlt, FaHeart, FaBalanceScale, FaCalendarAlt, FaRoad, FaCogs, FaGasPump, FaWhatsapp } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { Car, Calendar, Gauge, Fuel, KeyRound, Palette, Barcode } from "lucide-react";
import EditCarForm from "../../common/Ui/EditCarForm";
import Message from "../../message/Message";
import { useNavigate, useLocation } from "react-router-dom";

const CarInfoView = ({
  car,
  user,
  isOwner,
  mainImage,
  otherImages,
  handleImageClick,
  toggleSave,
  savedCars
}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const showMessage = location.state?.showInlineChat && location.state?.receiverId === car.createdBy;


  const handleSendMessage = () => {
    navigate(`/messages/${car.createdBy}`, {
      state: {
        background: location, // indiki yeri yadda saxla
        receiverId: car.createdBy,
        showInlineChat: true, // biz əlavə olaraq bunu yoxlayaq
      },
    });
  };
  

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          {/* Başlıq */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{`${car.brand} ${car.model}`}</h1>
              <p className="text-gray-500 text-sm">{car.text}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black px-2 py-1 rounded-md">
                <FaShareAlt /> Share
              </button>
              <button
                onClick={() => toggleSave({ carId: car.id })}
                className={`flex items-center gap-1 text-sm ${
                  savedCars[car.id] ? "text-red-500" : "text-gray-600"
                } hover:text-black px-2 py-1 rounded-md`}
              >
                <FaHeart /> {savedCars[car.id] ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Car xüsusiyyətləri */}
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

          {/* Şəkillər */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
  <div className="lg:col-span-2 relative h-[420px]">
    <img
      src={mainImage || "https://via.placeholder.com/150"}
      alt={car.model}
      className="w-full h-full object-cover rounded-xl"
    />
    <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
      ${car.price}
    </span>
  </div>
  <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[420px]">
  {otherImages.map((img, index) => (
    <img
      key={index}
      src={img.imagePath}   // burada imagePath olacaq
      alt={`car-${index + 1}`}
      className="w-full h-full object-cover rounded-xl cursor-pointer"
      onClick={() => handleImageClick(img.imagePath, index)}
    />
  ))}
</div>
</div>


          {/* Car Overview */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Car Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-800">
              <div className="flex items-center gap-2"><Car className="w-4 h-4 text-gray-600" /><span><strong>Body:</strong> {car.body}</span></div>
              <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-gray-600" /><span><strong>Mileage:</strong> {car.miles}</span></div>
              <div className="flex items-center gap-2"><Fuel className="w-4 h-4 text-gray-600" /><span><strong>Fuel Type:</strong> {car.fuel}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-600" /><span><strong>Year:</strong> {car.year}</span></div>
              <div className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-gray-600" /><span><strong>Transmission:</strong> {car.transmission}</span></div>
              <div className="flex items-center gap-2"><Palette className="w-4 h-4 text-gray-600" /><span><strong>Color:</strong> {car.color}</span></div>
              <div className="flex items-center gap-2"><Barcode className="w-4 h-4 text-gray-600" /><span><strong>VIN:</strong> {car.vin}</span></div>
            </div>
          </div>

        </div>

            <div className="w-full lg:w-1/3">
                    {isOwner ? (
            <div className="mt-10">
                <EditCarForm car={car} />   
            </div>
            ) : showMessage ? (
                
            <div className="mt-10 relative">
                <button
                onClick={() => navigate(location.pathname)} // mesaj state olmadan eyni səhifəyə qayıdır
                className="absolute top-0 right-0 text-sm text-gray-500 hover:text-black px-2 py-1"
                >
                ✕ Close
                </button>
                <Message receiverId={car.createdBy} miniMode={true} />
            </div>
            ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <img
                  src={user.userImagePath || "https://randomuser.me/api/portraits/men/32.jpg"}
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  alt="dealer"
                />
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-gray-500 mb-2">{user?.address || "943 Broadway, Brooklyn"}</p>
                <Button variant="link" className="text-blue-600 underline">Get Direction</Button>
                <p className="text-sm text-gray-700 mt-2"><IoMdCall className="inline mr-1" /> {user.phone}</p>
                <p className="text-sm text-gray-700 mt-2"><FaWhatsapp className="inline mr-1" /> {user.whatsapp}</p>
                <Button
                  onClick={handleSendMessage}
                  className="mt-4 w-full py-2 text-white bg-blue-600 hover:bg-blue-700"
                >
                  Message Dealer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInfoView;
