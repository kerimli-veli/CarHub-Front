import React, { useEffect, useRef, useState  } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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


import Header from "./pages/landing/components/Header";
import ChooseTemplateModal from "./pages/common/modals/ChooseTemplateModal";

import { startConnection, registerOnNotification } from "./assets/Services/notificationService";
import BuyCar from "./pages/buyCar/BuyCar";
import MiniAuctionTimer from "./pages/common/modals/MiniAuctionTimer"
import getUserFromToken from "./pages/common/GetUserFromToken";
import Notifications from "./pages/userProfil/components/Notifications";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const lastMessageRef = useRef(null);
  const navigate = useNavigate();
  const token = getUserFromToken();
  const [isModalOpen, setIsModalOpen] = useState(false);  

  useEffect(() => {
    const setupNotifications = async () => {
      const connection = await startConnection();
      if (connection) {
        registerOnNotification((message) => {
          toast.info(message.message);

          if (message.message?.toLowerCase().includes("auction time out")) {
            navigate("/auctionList");
          }          
        });
      }
    };
  
    setupNotifications();
  }, []);
  

  useEffect(() => {
    window.openGlobalModal = () => setIsModalOpen(true);
    window.closeGlobalModal = () => setIsModalOpen(false);
  }, []);

  return (
    <>
      <ToastContainer position="top-center" />
      
      <Routes location={state?.background || location}>
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/" element={<Landing />} />
        <Route path="/shopPage" element={<ShopPage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/carList" element={<CarList />} />
        <Route path="/carDetails/:carId" element={<CarDetail />} />

        {token &&
          <>
            <Route path="/AuctionList" element={<BuyCar />} />
        <Route path="/CreateAuction/:auctionId" element={<CreateAuction />} />
        <Route path="/createNewAuction" element={<SellCar />} />
        
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
          <Route path="notifications" element={<Notifications/>}/>
        </Route>
        
        <Route path="/messages/:receiverId" element={<Message />} />

        
        <Route path="/cart" element={<CartPayment />} />
          <Route path="/cartEmpty" element={<CartEmpty />} />
          </>
        }
          
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/messages/:receiverId" element={<Message isModal />} />
        </Routes>
      )}
      
      <ChooseTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <MiniAuctionTimer />
    </>
  );
}


function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;