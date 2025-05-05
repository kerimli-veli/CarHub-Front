import React, { useState } from "react";
import AuctionTimeSide from "./AuctionTimeSide";
import { useLocation } from "react-router";

const CarInfoSection = ({ car }) => {
  const imageData = car?.carImagePaths?.[0];
  const location = useLocation();
  const auctionData = location.state?.car?.data;

  const imageList = [
    imageData?.mainImage,
    imageData?.firstSideImage,
    imageData?.secondSideImage,
    imageData?.engineImage,
    imageData?.salonImage,
  ].filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow border border-gray-100 mb-6">
      {/* Top: Main image + Side thumbnails */}
      <div className="flex flex-col md:flex-row">
        {/* Main Image */}
        <div className="w-full md:w-4/5 flex flex-col items-center">
          <img
            src={`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${imageList[selectedIndex]}`}
            alt="Selected"
            className="w-full h-[250px] md:h-[350px] object-contain rounded-lg"
          />
          {/* Controls */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
            >
              &gt;
            </button>
          </div>
        </div>
  
        {/* Side Images */}
        <div className="w-full md:w-1/5 flex md:flex-col flex-row flex-wrap justify-center items-center md:ml-4 mt-4 md:mt-0">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${img}`}
              alt={`Thumb ${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`w-[60px] h-[50px] md:w-[80px] md:h-[60px] object-cover rounded cursor-pointer mb-2 md:mb-2 md:mr-0 mr-2 border-2 ${
                index === selectedIndex ? "border-blue-500" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>
  
      {/* Auction Info aşağıda */}
      <div className="mt-6">
        <AuctionTimeSide auctionData={auctionData} />
      </div>
    </div>
  );
  
};

export default CarInfoSection;
