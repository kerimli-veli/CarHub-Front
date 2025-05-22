import { useState, useEffect } from "react";
import React from "react";
import CarCard from "./../../common/CarCard";
import Cookies from "js-cookie";
import getUserFromToken from "../../common/GetUserFromToken";
import { useNavigate } from "react-router-dom";

const CarFavorites = () => {
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

        const response = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/User/GetById?Id=${user.id}`, {
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

    const fetchFavorites = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/User/GetUserFavorites?UserId=${userId}`, {
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
          console.error("Failed to fetch favorite cars");
        }
      } catch (error) {
        console.error("Error fetching favorite cars:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div>
      {cars.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center mt-24 cursor-pointer transition-transform transform hover:scale-105 hover:opacity-90 duration-300"
          onClick={() => navigate("/carList")}
        >
          <img
            src="https://i.postimg.cc/5ygPt1bs/Screenshot-2025-04-12-234916.png"
            alt="No favorite cars"
            className="w-48 mb-5 transition duration-300 rounded-2xl"
          />

          <p className="text-xl text-gray-600 font-medium hover:text-gray-700 transition">
            You haven’t favorited any cars yet.
          </p>
          <p className="text-sm text-gray-400 mt-1 hover:text-gray-500 transition">
            Click here to explore and add your favorites!
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

export default CarFavorites;
