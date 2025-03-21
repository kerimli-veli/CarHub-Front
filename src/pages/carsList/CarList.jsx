import CarSearchBar from './components/CarSearchBar';
import Header from '../landing/components/Header';
import CarListing from './components/Listing';
import React from 'react';

const CarList = () => {
    return (
        <div className="relative min-h-screen flex flex-col bg-[#050B20]">
            
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-[85%] z-20">
                <Header />
                
            </div>

            <div className='flex justify-center mt-[10%]'>
                <CarSearchBar/>
            </div>
            <div className='mt-[5%]'>
                <CarListing />
            </div>
        {/*       
            <div className="absolute top-[22%] left-[8.5%] grid gap-8  z-10 text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Let’s Find Your  Perfect Car
                </h1>
                <Filter />
                <div className='w-100'></div>
            </div> */}
        </div>
    )
}

export default CarList;
