import React from 'react'
import Header from './components/Header'
 
const Landing = () => {
 
    return (
        <div className='w-screen'>
          <Header />
          <div className="bg-gradient-to-r from-blue-900 to-black h-screen flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">Car Listings</h1>
          </div>
        </div>
      );
}
 
export default Landing