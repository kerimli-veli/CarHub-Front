import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { FaShoppingCart, FaCreditCard, FaUser, FaExchangeAlt, FaSignOutAlt, FaHeart, FaCar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; 
import TopBar from "./TopBar";
import getUserFromToken from "./../../common/GetUserFromToken";
import CarFavorites from "./CarFavorites";
import React from "react";

const menuItems = [
  { id: "dashboard", icon: <FaShoppingCart />, label: "Dashboard", path: "dashboard" },
  { id: "cards", icon: <FaCreditCard />, label: "Card Manager", path: "cards" },
  { id: "account", icon: <FaUser />, label: "Account", path: "account" },
  { id: "transactions", icon: <FaExchangeAlt />, label: "Transactions", path: "transactions" },
  { id: "favorites", icon: <FaHeart />, label: "Favorites", path: "favorites" },
  { id: "myCars", icon: <FaCar />, label: "My Cars", path: "myCars" },
];

const Sidebar = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate(); 
  const location = useLocation(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userFromToken = getUserFromToken();
        if (!userFromToken || !userFromToken.id) return;

        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch(`https://localhost:7282/api/User/GetById?Id=${userFromToken.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleItemClick = (itemId) => {
    navigate(`/userProfile/${itemId}`);
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-[250px] min-h-screen p-7 shadow-md bg-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
          </svg>
          <h2 className="text-lg font-semibold">{user.email}</h2>
        </div>

        {/* Menu */}
        <nav className="flex-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.path)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                location.pathname === `/userProfile/${item.path}` ? "bg-white shadow-md" : "hover:bg-gray-200"
              }`}
            >
              <span className="text-gray-700 text-lg">{item.icon}</span>
              <span className="text-gray-700 text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="flex items-center space-x-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-200 rounded-lg mt-4">
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm">Logout</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-gray-100 text-center p-4 bg-blue-400 rounded-sm"
        >
          {location.pathname === "/userProfile/favorites" && "View your favorites"}
          {location.pathname === "/userProfile/dashboard" && "Welcome to Dashboard"}
          {location.pathname === "/userProfile/cards" && "Manage Your Cards"}
          {location.pathname === "/userProfile/account" && "View Account Details"}
          {location.pathname === "/userProfile/transactions" && "Track Your Transactions"}
          {location.pathname === "/userProfile/myCars" && "Manage your cars"}
        </motion.div>

        <div className="mt-6">
          {location.pathname === "/userProfile/favorites" && <CarFavorites />}
          {location.pathname === "/userProfile/account" && "Salammm"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
