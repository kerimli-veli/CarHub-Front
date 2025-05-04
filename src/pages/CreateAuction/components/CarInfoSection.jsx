import React, { useState } from "react";

const CarInfoSection = ({ car }) => {
  const imageData =  car?.carImagePaths?.[0];

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
    <div className="flex bg-white p-4 rounded-lg shadow border border-gray-100 mb-6">
      {/* Main Image */}
      <div className="w-4/5 flex flex-col items-center">
        <img
          src={`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${imageList[selectedIndex]}`}
          alt="Selected"
          className="w-full h-[350px] object-contain rounded-lg"
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
      <div className="w-1/5 flex flex-col justify-between items-center ml-4">
        {imageList.map((img, index) => (
          <img
            key={index}
            src={`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${img}`}
            alt={`Thumb ${index}`}
            onClick={() => setSelectedIndex(index)}
            className={`w-[80px] h-[60px] object-cover rounded cursor-pointer mb-2 border-2 ${
              index === selectedIndex ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarInfoSection;
