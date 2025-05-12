import React, { useEffect, useRef  } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ShopPage from "./pages/shop/ShopPage";
import Landing from './pages/landing/Landing';
import CarList from './pages/carsList/CarList';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import UserProfile from './pages/userProfil/UserProfil';
import CarFavorites from './pages/userProfil/components/CarFavorites';
import Account from './pages/userProfil/components/Account';
import AddCarForm from "./pages/userProfil/components/AddCarForm";
import MyCars from "./pages/userProfil/components/MyCars";


import Message from "./pages/message/Message";
import SellCar from "./pages/sellCar/SellCar";
import CreateAuction from "./pages/CreateAuction/CreateAuction";
import CarDetail from './pages/carDetails/CarDetail';

import Cart from "./pages/shop/cart/Cart";
import CartPayment from "./pages/shop/CartPaymetn";
import CartEmpty from "./pages/shop/cart/CartEmpty";
import ProductDetails from "./pages/shop/ProductDetails";
import AboutUs from "./pages/aboutus/AboutUs";
import CategoryController from "./pages/userProfil/Admin/CategoryController";
import ProductController from "./pages/userProfil/Admin/ProductController";
import UserController from "./pages/userProfil/Admin/UserController";



import { startConnection, registerOnNotification } from "./assets/Services/notificationService";
import BuyCar from "./pages/buyCar/BuyCar";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const setupNotifications = async () => {
      const connection = await startConnection();
      if (connection) {
        registerOnNotification((message) => {
          toast.info(message.message);
        });
      }
    };
  
    setupNotifications();
  }, []);
  

  return (
    <>
      <ToastContainer position="top-center" />
      <Routes location={state?.background || location}>
        <Route path="/" element={<Landing />} />
        <Route path="/AuctionList" element={<BuyCar />} />
        
        <Route path="/CreateAuction/:auctionId" element={<CreateAuction />} />

        <Route path="/createNewAuction" element={<SellCar />} />
        <Route path="/shopPage" element={<ShopPage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/carList" element={<CarList />} />
        <Route path="/userProfile" element={<UserProfile />}>
          <Route path="favorites" element={<CarFavorites />} />
          <Route path="account" element={<Account />} />
          <Route path="addCar" element={<AddCarForm />} />
          <Route path="myCars" element={<MyCars />} />
          <Route path="shopPage" element={<ShopPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="category" element={<CategoryController />} />
          <Route path="product" element={<ProductController />} />
          <Route path="userController" element={<UserController />} />
        </Route>
        
        <Route path="/carDetails/:carId" element={<CarDetail />} />
        <Route path="/messages/:receiverId" element={<Message />} />

        
        <Route path="/cart" element={<CartPayment />} />
          <Route path='/carDetails/:carId' element={<CarDetail />} />
          <Route path="/cartEmpty" element={<CartEmpty />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/aboutus" element={<AboutUs />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/messages/:receiverId" element={<Message isModal />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" />
      </div>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
