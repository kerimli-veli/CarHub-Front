import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import getUserFromToken from "./../../common/GetUserFromToken";

export default function useFavoriteCars(initialCars = []) {
  const [savedCars, setSavedCars] = useState({});
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setAccessToken(token);
      const user = getUserFromToken();

      if (user?.id) {
        fetch(`https://localhost:7282/api/User/GetById?Id=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((userData) => {
            const favIds = userData?.data?.favoriteCarIds || [];
            const initialSaved = {};
            initialCars.forEach((car) => {
              initialSaved[car.id] = favIds.includes(car.id);
            });
            setSavedCars(initialSaved);
          })
          .catch((err) => console.error("Error fetching user data:", err));
      }
    }
  }, [initialCars]);

  const toggleSave = ({ carId, onFail }) => {
    const token = accessToken || Cookies.get("accessToken");
    const user = getUserFromToken();

    if (!token || !user?.id) {
      onFail?.(); 
      return;
    }

    const isSaved = savedCars[carId];
    const url = isSaved
      ? `https://localhost:7282/api/Favorite/RemoveFavoriteCar?UserId=${user.id}&CarId=${carId}`
      : `https://localhost:7282/api/Favorite/AddUserFavorites?UserId=${user.id}&CarId=${carId}`;

    fetch(url, {
      method: isSaved ? "DELETE" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.isSuccess !== undefined) {
          setSavedCars((prev) => ({
            ...prev,
            [carId]: !isSaved,
          }));
        }
      })
      .catch((err) => console.error("Error toggling favorite:", err));
  };

  return { savedCars, toggleSave, accessToken };
}
