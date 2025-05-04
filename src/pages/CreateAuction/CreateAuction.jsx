import React from 'react'
import Header from '../landing/components/Header'
import { useLocation } from "react-router-dom";
import TopInfoBar from "./components/TopInfoBar"
import CarInfoSection from './components/CarInfoSection';
import JoinChat from './components/JoinChat';

const CreateAuction = () => {
    const location = useLocation();
    const car = location.state?.car?.data?.car;
  
    if (!car) {
      return <div>No car data provided.</div>;
    }

    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto p-10'>
                <TopInfoBar car={car} />
            </div>

            <div className='w-auto p-10 grid grid-cols-2'>
                <CarInfoSection car={car}/>
                <JoinChat/>
            </div>

         </div>
    )
}

export default CreateAuction;
