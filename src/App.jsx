import {BrowserRouter, Routes, Route } from "react-router"
import React from "react";
import ShopPage from "./pages/shop/ShopPage";




function App() {
  

  return (
    <>
      <div>
      
      </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ShopPage/>}/>

          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
