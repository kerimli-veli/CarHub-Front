import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaExchangeAlt,
  FaHeart,
  FaCar,
  FaSearch,
  FaCog,
  FaPlusSquare,
  FaLifeRing,
  FaSignOutAlt,
} from "react-icons/fa";
import getUserFromToken from "./../../common/GetUserFromToken";
import CarFavorites from "./CarFavorites";
import Account from "./Account";
import React from "react";
import AddCarForm from "./AddCarForm";
import MyCars from "./MyCars";
import Cart from "../../shop/cart/Cart";
import UserBaskets from "../Admin/UserBaskets";
import CategoryController from "../Admin/CategoryController";
import ProductController from "../Admin/ProductController";
import UserController from "../Admin/UserController"; // ✅ Eklendi

const getMenuItems = (isAdmin) => [
  {
    id: "cart",
    icon: <FaShoppingCart />,
    label: isAdmin ? "User Baskets" : "Basket",
    path: "cart",
  },
  isAdmin
    ? { id: "category", icon: <FaCog />, label: "Category Controller", path: "category" }
    : { id: "cards", icon: <FaCreditCard />, label: "Card Manager", path: "cards" },
  { id: "account", icon: <FaUser />, label: "Account", path: "account" },
  isAdmin
    ? { id: "productController", icon: <FaCog />, label: "Product Controller", path: "product" }
    : { id: "transactions", icon: <FaExchangeAlt />, label: "Transactions", path: "transactions" },
  { id: "favorites", icon: <FaHeart />, label: "Favorites", path: "favorites" },
  { id: "myCars", icon: <FaCar />, label: "My Cars", path: "myCars" },
  { id: "addCar", icon: <FaPlusSquare />, label: "Add Car", path: "addCar" },
];

const getOtherMenu = (isAdmin) => [
  isAdmin
    ? { id: "userController", icon: <FaUser />, label: "User Controller", path: "userController" }
    : { id: "help", icon: <FaLifeRing />, label: "Help Center", path: "help" },
];

const Sidebar = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userFromToken = getUserFromToken();
        if (!userFromToken?.id) return;

        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await fetch(
          `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/GetById?Id=${userFromToken.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setUser({
            ...data,
            isAdmin: data.userRole?.toLowerCase() === "admin",
          });
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleItemClick = (path) => {
    navigate(`/userProfile/${path}`);
  };

  const menuItems = getMenuItems(user?.isAdmin);
  const otherMenu = getOtherMenu(user?.isAdmin);

  return (
    <div className="flex min-h-screen bg-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 flex items-center space-x-3"
          >
            <div className="w-12 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow">
              <img
                className="rounded-full"
                src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
                alt="Profile"
              />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {user.name} {user.surname}
            </span>
          </motion.div>

          <nav className="px-4">
            <span className="text-xs text-gray-400 uppercase mb-2 block">Menu</span>
            {menuItems.map((item) => {
              const isActive = location.pathname === `/userProfile/${item.path}`;
              return (
                <motion.div
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm font-medium cursor-pointer relative transition-all duration-300 group ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"
                    />
                  )}
                  <span
                    className={`${
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
                    } text-lg`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.div>
              );
            })}

            <span className="text-xs text-gray-400 uppercase mt-6 mb-2 block">Other Menu</span>
            {otherMenu.map((item) => {
              const isActive = location.pathname === `/userProfile/${item.path}`;
              return (
                <motion.div
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 pb-6"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-300">
            <FaSignOutAlt />
            Logout
          </div>
        </motion.div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 p-6"
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-blue-400 text-white text-center py-3 rounded text-lg font-semibold shadow"
        >
          {location.pathname === "/userProfile/favorites" && "View your favorites"}
          {location.pathname === "/userProfile/cart" &&
            (user?.isAdmin ? "View Users' Baskets" : "Your basket")}
          {location.pathname === "/userProfile/cards" && "Manage Your Cards"}
          {location.pathname === "/userProfile/account" && "View Account Details"}
          {location.pathname === "/userProfile/product" &&
            (user?.isAdmin ? "Manage All Products" : "Track Your Transactions")}
          {location.pathname === "/userProfile/myCars" && "Manage your cars"}
          {location.pathname === "/userProfile/addCar" && "Add your car"}
          {location.pathname === "/userProfile/userController" && "User Management Panel"}
          {location.pathname === "/userProfile/help" && "Help Center"}
        </motion.div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {location.pathname === "/userProfile/favorites" && <CarFavorites />}
            {location.pathname === "/userProfile/account" && <Account />}
            {location.pathname === "/userProfile/addCar" && <AddCarForm />}
            {location.pathname === "/userProfile/myCars" && <MyCars />}
            {location.pathname === "/userProfile/cart" &&
              (user?.isAdmin ? <UserBaskets /> : <Cart />)}
            {location.pathname === "/userProfile/category" && <CategoryController />}
            {location.pathname === "/userProfile/product" &&
              (user?.isAdmin ? <ProductController /> : <div>Transactions Component</div>)}
            {location.pathname === "/userProfile/userController" && user?.isAdmin && (
              <UserController />
            )}
            {location.pathname === "/userProfile/help" && !user?.isAdmin && (
              <div>Help Center İçeriği</div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default Sidebar;
