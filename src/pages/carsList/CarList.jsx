import CarSearchBar from './components/CarSearchBar';
import Header from '../landing/components/Header';
import CarListing from './components/Listing';
import Footer from '../landing/components/Footer';
import React from 'react';

const CarList = () => {
    return (
        <div className="relative min-h-screen flex gap-5 flex-col bg-[#050B20]">
            
            <div className="w-full p-[1%]">
                <Header />
            </div>


            <div className='flex justify-center mt-[3%]'>
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
