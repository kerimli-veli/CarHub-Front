import { useState, useEffect } from "react";
import React from "react";
import CarCard from "./../../common/CarCard";
import Cookies from "js-cookie";
import getUserFromToken from "../../common/GetUserFromToken";
import { data } from "react-router-dom";

const CarFavorites = () => {
  const [cars, setCars] = useState([]);
  const [userId, setUserId] = useState(null);

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

        const response = await fetch(`https://localhost:7282/api/User/GetById?Id=${user.id}`, {
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

        const response = await fetch(`https://localhost:7282/api/User/GetUserFavorites?UserId=${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCars(data.data);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarFavorites;
