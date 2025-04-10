
import React from "react";
import ShopPage from "./pages/shop/ShopPage";

import { useState } from 'react'
import Landing from './pages/landing/Landing'
import CarList from './pages/carsList/CarList'
import {BrowserRouter, Routes, Route } from "react-router"
import React from "react";
import SignIn from './pages/sign-in/SignIn'
import SignUp from './pages/sign-up/SignUp'
import { Toaster } from 'react-hot-toast'
import UserProfile from './pages/userProfil/UserProfil'
import CarFavorites from './pages/userProfil/components/CarFavorites'
import Account from './pages/userProfil/components/Account';
import CarDetail from './pages/carDetails/CarDetail';


function App() {
  

  return (
    <>
      <div>
      <Toaster position='top-center'/>
      </div>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing/>}/>

          <Route path="/" element={<ShopPage/>}/>
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/SignUp" element={<SignUp/>} />

          <Route path='/carList' element={<CarList/>}/>

          <Route path="/userProfile" element={<UserProfile />}>
            {/* <Route index element={<Dashboard />} />  */}
            <Route path="favorites" element={<CarFavorites />} />
            {/* <Route path="account" element={</>}/> */}
            <Route path="account" element={<Account />} />
          </Route>

          <Route path='/carDetails/:carId' element={<CarDetail/>}/>

         
          {/* <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signUp' element={<SignUpPage/>}/> */}
 
          {/* {token &&
            <>
            <Route path='/home' element={<Homepage/>}/>
            <Route path='/details' element={<Details/>}/>
            </>
          } */}

          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
