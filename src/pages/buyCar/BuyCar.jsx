import React from 'react'
import Header from '../landing/components/Header'
import AuctionList from './components/AuctionList'
const BuyCar = () => {
    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto p-6 grid gap-10 mt-[5%]'>
                <AuctionList /> 
            </div>

         </div>
    )
}

export default BuyCar;
