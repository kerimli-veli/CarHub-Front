import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./../../common/Ui/button";
import { Card, CardContent } from "./../../common/Ui/card";
import { FaWhatsapp } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { FaCalendarAlt, FaRoad, FaCogs, FaGasPump, FaShareAlt, FaHeart, FaBalanceScale } from "react-icons/fa";
import {
    Car,
    Calendar,
    Gauge,
    Fuel,
    Settings,
    DoorOpen,
    BadgeCent,
    Thermometer,
    Palette,
    KeyRound,
    Barcode
  } from "lucide-react"

const CarInfo = () => {
  const [car, setCar] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7282/api/Car/GetById?Id=1")
      .then((res) => {
        console.log("GELƏN CAVAB:", res);
        setCar(res.data.data);
      })
      .catch((err) => console.error("API xətası:", err));
  }, []);

  if (!car) return <div>Loading...</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="flex justify-between gap-6">
      <div className="w-2/3">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold">{`${car.brand} ${car.model} New`}</h1>
        <p className="text-gray-500 text-sm">{car.text}</p>
      </div>
      {/* Sağ üst düymələr */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors">
          <FaShareAlt /> Share
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors">
          <FaHeart /> Save
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer px-2 py-1 rounded-md transition-colors">
          <FaBalanceScale /> Compare
        </button>
      </div>
    </div>

    {/* İkonlu info badge-lər */}
    <div className="flex gap-2 my-3">
      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
        <FaCalendarAlt /> {car.year}
      </span>
      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
        <FaRoad /> {car.miles} miles
      </span>
      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
        <FaCogs /> {car.transmission === 1 ? 'Manual' : 'Automatic'}
      </span>
      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
        <FaGasPump /> {car.fuel === 1 ? 'Petrol' : car.fuel === 2 ? 'Diesel' : 'Electric'}
      </span>
    </div>


          {/* Şəkil qalereyası */}
<div className="grid grid-cols-3 gap-2 mb-4">
  {/* Sol tərəfdə böyük şəkil */}
  <div className="col-span-2 relative h-[420px]">
    <img
      src={car.carImagePaths[0]?.imagePath}
      alt={car.model}
      className="w-full h-full object-cover rounded-xl"
    />
    <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
      Great Price
    </span>
    <Button className="absolute bottom-4 left-4 flex items-center gap-2 text-black bg-white hover:bg-gray-100 shadow-md">
      <MdVideoLibrary /> Video
    </Button>
  </div>

  {/* Sağ tərəfdə 4 kiçik şəkil */}
  <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[420px]">
    {car.carImagePaths.slice(1, 5).map((img, i) => (
      <img
        key={i}
        src={img.imagePath}
        className="w-full h-full object-cover rounded-xl"
        alt={`car-${i + 1}`}
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
      <span><strong>Fuel Type:</strong> {car.fuel === 1 ? 'Petrol' : car.fuel === 2 ? 'Diesel' : 'Electric'}</span>
    </div>
    
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-gray-600" />
      <span><strong>Year:</strong> {car.year}</span>
    </div>
    
    <div className="flex items-center gap-2">
      <KeyRound className="w-4 h-4 text-gray-600" />
      <span><strong>Transmission:</strong> {car.transmission === 1 ? 'Manual' : 'Automatic'}</span>
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

        </div>

        <div className="w-1/3">
          <Card>
            <CardContent className="p-6 text-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-16 h-16 rounded-full mx-auto mb-2"
                alt="admin"
              />
              <p className="font-bold">admin</p>
              <p className="text-sm text-gray-500 mb-2">943 Broadway, Brooklyn</p>
              <Button variant="link" className="text-blue-600 underline">Get Direction</Button>
              <p className="text-sm text-gray-700 mt-2"><IoMdCall className="inline mr-1" /> +88-123456789</p>
              <Button className="w-full mt-4">Message Dealer</Button>
              <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                <FaWhatsapp /> Chat Via Whatsapp
              </Button>
              <Button variant="link" className="mt-2 text-sm text-blue-600">View all stock at this dealer</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Description</h2>
        <p className="text-gray-700 mt-2">{car.text}</p>
      </div>
    </div>
  );
};

export default CarInfo;
