import React from 'react';
import { useNavigate } from "react-router-dom";

const AuctionListCard = ({
  auction,
  selectedAuctionId,
  setSelectedAuctionId,
  handleJoinAuction,
  normalizeImagePath,
}) => {
  const navigate = useNavigate();
  const hasJoined = sessionStorage.getItem(`joined_auction_${auction.id}`) === 'true';

  return (
    <div
      onClick={() => setSelectedAuctionId(auction.id)}
      className={`bg-white shadow-md rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer transition-all duration-300 
        ${selectedAuctionId === auction.id ? 'border-1 border-blue-500' : 'border border-transparent'}`}
    >
      <div className="w-full sm:w-40 h-28 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={auction.car?.carImagePaths?.[0]?.mainImage
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
          className={`px-4 py-2 rounded-xl text-sm transition 
            ${auction.isActive
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            if (!auction.isActive) return;

            if (hasJoined) {
              navigate(`/CreateAuction/${auction.id}`); // 🔁 Sadəcə yönləndir
            } else {
              handleJoinAuction(auction.id); // 🔁 API + SignalR
            }
          }}
          disabled={!auction.isActive}
        >
          {auction.isActive ? (hasJoined ? 'Continue Auction' : 'Join Auction') : 'Waiting...'}
        </button>
      </div>
    </div>
  );
};

export default AuctionListCard;
