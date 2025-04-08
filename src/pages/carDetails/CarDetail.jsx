import React  from "react";
import Footer from "../landing/components/Footer";
import Header from "../landing/components/Header";
import CarInfo from "./components/CarInfo";

const CarDetail = () => {
    return (
        <div className="relative min-h-screen flex flex-col">
            
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-[85%] z-20">
                <Header />
                
            </div>

            <div className='flex justify-center mt-[10%]'>
                <CarInfo/>
            </div>
            <div className='mt-[5%]'>
                {/* <CarListing /> */}
            </div>
            <div className='mt-[8%]'>
                {/* <Footer/> */}
            </div>
        </div>
    )
}

export default CarDetail;