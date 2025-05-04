import React from 'react'
import Header from '../landing/components/Header'
import AuctionFilterBar from './AuctionFilterBar'
import AuctionUserCars from './AuctionUserCars'
import { useState } from 'react'
const SellCar = () => {
    const [selectedCarId, setSelectedCarId] = useState(null);
    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto grid gap-10 mt-[5%]'>
            <AuctionFilterBar selectedCarId={selectedCarId} /> 
            <AuctionUserCars setSelectedCarId={setSelectedCarId} /> 
            </div>

         </div>
    )
}

export default SellCar;
