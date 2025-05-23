import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import getUserFromToken from "./../../common/GetUserFromToken";
import { useNavigate } from "react-router-dom";

const TopInfoBar = ({ car, auctionData }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isActive, setIsActive] = useState(auctionData?.data?.isActive);
  const navigate = useNavigate();

  const startTime = new Date(auctionData.data.startTime);
  const endTime = new Date(auctionData.data.endTime);

  const handleStopAuction = async () => {
    try {
      const token = getUserFromToken();
  
      await axios.delete(
        `https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/DeleteAuction`,
        {
          data: {
            id: auctionData.data.id,
            userId: 0, 
            messageReason: "time"
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      navigate("/auctionList");
    } catch (error) {
      console.error("Stop zamanı xəta:", error);
      toast.error("Auksion dayandırıla bilmədi.");
    }
  };
  

  const handleStartAuction = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Token tapılmadı. Giriş etdiyinizə əmin olun.");
        return;
      }

      const response = await axios.put(
        `https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/SetIsActive?AuctionId=${auctionData.data.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.isSuccess) {
        toast.success("Auksion uğurla aktiv edildi!");
        setIsActive(true);
      } else {
        toast.error("Auksion aktiv edilə bilmədi.");
      }
    } catch (error) {
      console.error("Auksion aktiv edilərkən xəta:", error);
      toast.error("Xəta baş verdi. Daha sonra yenidən cəhd edin.");
    }
  };

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      if (now < startTime) {
        setTimeLeft("Waiting...");
      } else if (now >= startTime && now < endTime) {
        if (!isActive) handleStartAuction();

        const totalSeconds = Math.floor((endTime - now) / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      } else {
        if (isActive) handleStopAuction();
        setTimeLeft("Auction ended");
        
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-100 bg-white px-6 py-6 md:py-6 rounded-lg shadow mb-6 w-full gap-6 md:gap-0">
      {/* Left */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {car.year} {car.brand} {car.model}
          <span className="text-blue-600 text-lg">💙</span>
        </h2>
        <p className="text-sm text-gray-400">{car.body}</p>
      </div>

      {/* Middle */}
      <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-12 text-sm text-gray-700">
        <div className="text-center">
          <p className="font-medium">Mileage</p>
          <p className="text-sm">{car.miles?.toLocaleString() || "—"}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Transmission</p>
          <p className="text-sm">{car.transmission || "—"}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Color</p>
          <p className="text-sm">{car.color}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Fuel</p>
          <p className="text-sm">{car.fuel || "—"}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-500">Start Price</p>
        <p className="text-2xl font-semibold text-gray-800">
          ${auctionData.data.startingPrice || 0}
        </p>

        {/* Countdown Timer */}
        <p className="mt-2 text-lg font-semibold text-blue-600">{timeLeft}</p>
      </div>
    </div>
  );
};

export default TopInfoBar;
