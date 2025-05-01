import { useState, useEffect } from "react";
import React from "react";
import CarCard from "./../../common/CarCard";
import Cookies from "js-cookie";
import getUserFromToken from "../../common/GetUserFromToken";
import { FaRegSadCry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getUserFromToken();
        if (!user || !user.id) {
          console.error("User ID not found in token");
          return;
        }

        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetById?Id=${user.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.data.id);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserCars = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetUserCars?UserId=${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCars(data.data || []);
        } else {
          console.error("Failed to fetch user's cars");
        }
      } catch (error) {
        console.error("Error fetching user's cars:", error);
      }
    };

    fetchUserCars();
  }, [userId]);

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      {cars.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center mt-28 transition-transform transform hover:scale-105 hover:opacity-90 duration-300 cursor-pointer"
          onClick={() => navigate("/userProfile/addCar")}
        >
            <img
            src="https://i.postimg.cc/cHtQtWZs/add.png"
            alt="No favorite cars"
            className="w-48 mb-5 transition duration-300 rounded-2xl"
          />
          <p className="text-lg text-gray-500 font-medium hover:text-gray-600">
            You haven’t added any cars yet. Click to add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;
