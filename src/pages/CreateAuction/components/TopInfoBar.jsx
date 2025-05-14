import React, { use } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import  getUserFromToken  from "./../../common/GetUserFromToken"; 
import { useNavigate } from "react-router-dom";
import { startConnection } from "./../../../assets/Services/notificationService";


const TopInfoBar = ({ car, auctionData }) => {
  const [isActive, setIsActive] = React.useState(auctionData?.data?.isActive);

  const navigate = useNavigate();

  const handleStopAuction = async () => {
    try {
      const token = getUserFromToken();
  
      await axios.delete(
        `https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/DeleteAuction?id=${auctionData.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Auksion dayandırıldı");
  
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
        setIsActive(true); // auction aktiv oldu
      } else {
        toast.error("Auksion aktiv edilə bilmədi.");
      }
    } catch (error) {
      console.error("Auksion aktiv edilərkən xəta:", error);
      toast.error("Xəta baş verdi. Daha sonra yenidən cəhd edin.");
    }
  };

  const userId = getUserFromToken(); // 

  // Conditional rendering: Show button only if auctionData.data.sellerId matches userId
  const shouldShowButton = auctionData?.data?.sellerId === parseInt(userId.id);
 


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
        {shouldShowButton && (
        <button
          onClick={isActive ? handleStopAuction : handleStartAuction}
          className={`${
            isActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-10 py-2 rounded-md mt-2 text-[15px] font-medium`}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      )}
      </div>
    </div>
  );
};

export default TopInfoBar;
