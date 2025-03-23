import CarSearchBar from './components/CarSearchBar';
import Header from '../landing/components/Header';
import CarListing from './components/Listing';
import Footer from '../landing/components/Footer';
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
            <div className='mt-[8%]'>
                <Footer/>
            </div>
        </div>
    )
}

export default CarList;
