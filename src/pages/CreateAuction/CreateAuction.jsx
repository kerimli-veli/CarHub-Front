import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Header from '../landing/components/Header';
import TopInfoBar from "./components/TopInfoBar";
import CarInfoSection from './components/CarInfoSection';
import JoinChat from './components/auctionComponents/JoinChat';
import axios from 'axios';

const CreateAuction = () => {
  const { auctionId } = useParams(); 
  const [auctionData, setAuctionData] = useState(null);
  const [car, setCar] = useState(null);

  useEffect(() => {
  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/AuctionGetById?AuctionId=${auctionId}`);
      const data = response.data.data;
      setAuctionData(response.data);
      setCar(data.car);
    } catch (error) {
      console.error("Auction və ya car məlumatı alınarkən xəta:", error);
    }
  };

  fetchAuctionDetails();
}, [auctionId]);


  if (!car || !auctionData) {
    return <div className="text-center mt-10 text-gray-500">Məlumatlar yüklənir...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div>
        <Header />
      </div>

      <div className='w-auto p-10'>
        
        <TopInfoBar car={car} auctionData={auctionData} />
      </div>

      <div className="w-auto p-10 gap-15 -mt-[2%] grid grid-cols-1 md:grid-cols-2">
        <CarInfoSection car={car} auctionData={auctionData}/>
        <JoinChat  auctionId={auctionId}/>
      </div>
    </div>
  );
};

export default CreateAuction;
