import React from 'react'
import Header from './components/Header'
import BrowseByType from './components/BrowseByType';
import PremiumBrands from './components/PremiumBrands';
import Filter from './components/Filter';
import Background from './../../assets/images/Background.svg'; 

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      
      <div className="absolute inset-0 p-5">
        <img
          src={Background}
          alt="Background"
          className="object-cover rounded-xl"
        />
      </div>
      
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-[85%] z-20">
        <Header />
      </div>
      
      <div className="absolute top-[22%] left-[8.5%] grid gap-8  z-10 text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Let’s Find Your  Perfect Car
        </h1>
        <Filter />
      </div>

      <div className='grid grid-cols-1 gap-40 absolute min-h-screen p-[12%] justify-center items-center top-[80%]'>
        <BrowseByType />
        <PremiumBrands/>
      </div>

    </div>
    
  );
};

export default Landing;
