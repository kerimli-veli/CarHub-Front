import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { startAuctionConnection, joinAuction } from "./../../../assets/Services/auctionHubService"
import getUserFromToken from '../../common/GetUserFromToken';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All Auctions');
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const navigate = useNavigate();


  const handleJoinAuction = async (auctionId) => {
    try {
      const userInfo = getUserFromToken();
      if (!userInfo) {
        console.error("Token tapılmadı və ya istifadəçi məlumatı alınmadı.");
        return;
      }
  
      const response = await fetch(
        `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/GetById?Id=${userInfo.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      const user = await response.json();
      const fullName = `${user.name} ${user.surname}`;
  
      const connection = await startAuctionConnection(userInfo.token);
      await joinAuction(userInfo.id, fullName);
  
      navigate(`/auction/${auctionId}`);
    } catch (error) {
      console.error("Auction-a qoşulmaq mümkün olmadı:", error);
    }
  };



  const normalizeImagePath = (path) => {
    const baseUrl = "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/";
    return `${baseUrl}${path}`;
  };

  const fetchAuctions = async (filter) => {
    try {
      let url = "";
      if (filter === 'All Auctions') {
        url = "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Auction/GetAllAuctions";
      } else if (filter === 'Ongoing') {
        url = "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Auction/AuctionsGetAllActive";
      } else {
        // Not Started
        url = "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Auction/GetAllAuctions";
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
      
      {/* Filter buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['All Auctions', 'Ongoing', 'Not Started'].map((label) => (
            <button
              key={label}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                selectedFilter === label
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              } hover:bg-blue-200 transition`}
              onClick={() => setSelectedFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>

        
      </div>

      <h1 className="text-2xl font-semibold mb-4">Auctions</h1>
      <div className="grid gap-6">
        {auctions.map(auction => (
          <div
          key={auction.id}
          onClick={() => setSelectedAuctionId(auction.id)}
          className={`bg-white shadow-md rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer transition-all duration-300 
            ${selectedAuctionId === auction.id ? 'border-1 border-blue-500' : 'border border-transparent'}`}
        >
                  <div className="w-full sm:w-40 h-28 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={
                    auction.car?.carImagePaths?.[0]?.mainImage
                    ? normalizeImagePath(auction.car.carImagePaths[0].mainImage)
                    : "https://via.placeholder.com/300x200"
                }
                alt={auction.car?.model} 
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold">{auction.car?.year} {auction.car?.brand} {auction.car?.model}</h2>
              <p className="text-sm text-gray-500">{auction.car?.miles} Miles • {auction.car?.transmission} • {auction.car?.fuel}</p>
              <p className="text-sm text-gray-400">{auction.car?.body} • {auction.car?.color}</p>
              <p className="mt-1 text-sm text-gray-600">{auction.car?.text}</p>
              <div className="mt-2 text-sm text-gray-700 font-semibold">
                Market Price: ${auction.car?.price?.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-lg font-semibold text-black">${auction.startingPrice}</div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 text-sm"
                  onClick={() => handleJoinAuction(auction.id)}
                >
                  Join Auction
                </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
