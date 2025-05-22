import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import getUserFromToken from '../../common/GetUserFromToken';
import * as signalR from '@microsoft/signalr';
import AuctionListCard from './AuctionListCard';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All Auctions');
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [joinedParticipants, setJoinedParticipants] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const connectToSignalR = async () => {
      const userInfo = getUserFromToken();
      if (!userInfo) {
        console.error("Token tapılmadı və ya istifadəçi məlumatı alınmadı.");
        return;
      }

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/auctionHub', {
          accessTokenFactory: () => {
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('accessToken='))
              ?.split('=')[1];
            return token;
          }
        })
        .withAutomaticReconnect()
        .build();

      newConnection.on('ParticipantJoined', (participant) => {
        setJoinedParticipants(prev => [...prev, participant]);
      });

      try {
        await newConnection.start();
        setConnection(newConnection);
      } catch (err) {
        console.error("SignalR bağlantısı qurularkən xəta:", err);
      }
    };

    connectToSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const handleJoinAuction = async (auctionId) => {
    try {
      const userInfo = getUserFromToken();
      if (!userInfo) {
        console.error("Token tapılmadı və ya istifadəçi məlumatı alınmadı.");
        return;
      }
  
      const userId = parseInt(userInfo.id);
  
      await axios.post("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/AuctionParticipant/JoinAuction", {
        auctionId: auctionId,
        userId: userId,
      });
  
      if (connection) {
        await connection.invoke('JoinAuction', auctionId, userId);
      }
      
      sessionStorage.setItem(`joined_auction_${auctionId}`, 'true');
      navigate(`/CreateAuction/${auctionId}`);
  
    } catch (error) {
      console.error("Auction-a qoşulmaq mümkün olmadı:", error);
    }
  };
  

  const normalizeImagePath = (path) => {
    const baseUrl = "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/";
    return `${baseUrl}${path}`;
  };

  const fetchAuctions = async (filter) => {
    try {
      let url = "";
      if (filter === 'All Auctions') {
        url = "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/GetAllAuctions";
      } else if (filter === 'Ongoing') {
        url = "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/AuctionsGetAllActive";
      } else {
        url = "https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Auction/GetAllAuctions";
      }

      const response = await axios.get(url);
      let data = response.data;

      if (filter === 'Not Started') {
        data = data.filter(auction => auction.isActive === false);
      }

      setAuctions(data);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAuctions(selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['All Auctions', 'Ongoing', 'Not Started'].map((label) => (
            <button
              key={label}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${selectedFilter === label
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400'} hover:bg-blue-200 transition`}
              onClick={() => setSelectedFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
  
      <h1 className="text-2xl font-semibold mb-4">Auctions</h1>
  
      {auctions.length === 0 ? (
        <div className="flex justify-center items-center mt-[7%]">
          <img 
            src="https://i.postimg.cc/k52DkBDz/Screenshot-2025-05-14-175206.png"
            alt="No auctions found"
            className="max-w-md w-[11%] h-auto opacity-80"
          />
        </div>
      ) : (
        <div className="grid gap-6">
          {auctions.map((auction) => (
            <AuctionListCard
              key={auction.id}
              auction={auction}
              selectedAuctionId={selectedAuctionId}
              setSelectedAuctionId={setSelectedAuctionId}
              handleJoinAuction={handleJoinAuction}
              normalizeImagePath={normalizeImagePath}
              hasJoined={sessionStorage.getItem(`joined_auction_${auction.id}`) === 'true'}
            />
          ))}
        </div>
      )}
    </div>
  );  
};

export default AuctionList;
