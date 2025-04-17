import CarSearchBar from './components/CarSearchBar';
import Header from '../landing/components/Header';
import CarListing from './components/Listing';
import Footer from '../landing/components/Footer';
import React from 'react';

const CarList = () => {
    return (
        <div className="relative min-h-screen bg-[#050B20] flex flex-col">
            <div className="w-full p-[1%]">
                <Header />
            </div>

            <div className="flex flex-1 px-6 gap-6">
                <div className="w-[300px] sticky top-4 self-start">
                    <CarSearchBar />
                </div>

                <div className="flex-1">
                    <CarListing />
                </div>
            </div>

            <div className="mt-[8%]">
                <Footer />
            </div>
        </div>
    );
};

export default CarList;
