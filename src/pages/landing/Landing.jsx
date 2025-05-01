import React from 'react'
import Header from './components/Header'
import BrowseByType from './components/BrowseByType';
import PremiumBrands from './components/PremiumBrands';
import FeaturedListings from './components/FeaturedListings'
import ElectricVehicles from './components/ElectricVehicles'
import Filter from './components/Filter';
import Background from './../../assets/images/Background.mp4'; 
import Footer from './components/Footer';
import CarSaleSection from './components/CarSaleSection';
import ActionCards from './components/ActionsCard';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      
      <div className="w-full h-full">
        <video
          src={Background}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[85%] z-20">
        <Header bgColor=''/>
          <div className='grid gap-8 mt-[20%] ml-[1%]'>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
                Dawn of a new era.
            </h1>
            <h1 className="text-xs md:text-xl font-bold text-white">
              Let’s Find Your  Perfect Car
            </h1>
          </div>
      </div>
    
      <div className="grid grid-cols-1 gap-40 p-[12%] justify-center items-center  mt-[40%]">
        <BrowseByType />
        <FeaturedListings/>
        <ActionCards/>
        <ElectricVehicles/>
        <CarSaleSection/>
      </div>

      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
