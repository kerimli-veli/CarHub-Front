import React from 'react'
import Header from '../landing/components/Header'
import { useLocation } from "react-router-dom";
import TopInfoBar from "./components/TopInfoBar"
import CarInfoSection from './components/CarInfoSection';

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

            <div className='w-auto p-10'>
                <CarInfoSection car={car}/>
            </div>

         </div>
    )
}

export default CreateAuction;
