import React from 'react'
import Header from '../landing/components/Header'
import AuctionFilterBar from './AuctionFilterBar'
import AuctionUserCars from './AuctionUserCars'
const SellCar = () => {
    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto p-6 grid gap-10 mt-[5%]'>
            <AuctionUserCars /> 
            </div>

         </div>
    )
}

export default SellCar;
