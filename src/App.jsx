import ShopPage from "./pages/shop/ShopPage";
import { useState } from 'react';
import Landing from './pages/landing/Landing';
import CarList from './pages/carsList/CarList';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import { Toaster } from 'react-hot-toast';
import UserProfile from './pages/userProfil/UserProfil';
import CarFavorites from './pages/userProfil/components/CarFavorites';
import Account from './pages/userProfil/components/Account';
import CarDetail from './pages/carDetails/CarDetail';
import AddCarForm from "./pages/userProfil/components/AddCarForm";
import MyCars from "./pages/userProfil/components/MyCars";
import Cart from "./pages/shop/cart";
import Message from "./pages/message/Message";
import SellCar from "./pages/sellCar/SellCar";
import CreateAuction from "./pages/CreateAuction/CreateAuction";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Routes location={state?.background || location}>
        <Route path="/" element={<Landing />} />
        <Route path="/AuctionSeller" element={<CreateAuction/>}/>
        <Route path="/createNewAuction" element={<SellCar/>}/>
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
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="/carDetails/:carId" element={<CarDetail />} />
        <Route path="/messages/:receiverId" element={<Message />} />
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
