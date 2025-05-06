import React from 'react'
import Header from '../landing/components/Header'
import { useLocation } from "react-router-dom";
import TopInfoBar from "./components/TopInfoBar"
import CarInfoSection from './components/CarInfoSection';
import JoinChat from './components/JoinChat';

const CreateAuction = () => {
    const location = useLocation();
    const car = location.state?.car?.data?.car;
    const auctionData = location.state?.car?.data;
  
    if (!car) {
      return <div>No car data provided.</div>;
    }

    if (!auctionData) {
        return <div>No auction data provided.</div>;
    }

    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto p-10'>
                <TopInfoBar car={car} auctionData={auctionData} />
            </div>

            <div className="w-auto p-10 gap-4 -mt-[5%] grid grid-cols-1 md:grid-cols-2">
                <CarInfoSection car={car} />
                <JoinChat />
            </div>


         </div>
    )
}

export default CreateAuction;
