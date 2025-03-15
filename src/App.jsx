import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Landing from './pages/landing/Landing'
import {BrowserRouter, Routes, Route } from "react-router"
import React from "react";
import SignIn from './pages/sign-in/signIn'
import SignUp from './pages/sign-up/signUp'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/SignUp" element={<SignUp/>} />
         
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
