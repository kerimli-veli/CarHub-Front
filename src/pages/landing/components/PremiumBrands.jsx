import React from "react";

const brands = [
  { name: "Audi", logo: "https://i.postimg.cc/8cW1nSxP/Brand-Audi.jpg" },
  { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
  { name: "Ford", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
  { name: "Mercedes", logo: "https://i.postimg.cc/RCWt7pVW/Brand-Mercedes-Benz.png" },
  { name: "Porsche", logo: "https://i.postimg.cc/xCjRjj9q/Brand-Porsche.jpg" },
  { name: "Volkswagen", logo: "https://i.postimg.cc/6qHwbfhz/Brand-wolksvagen.png" },
  { name: "Bentley", logo: "https://i.postimg.cc/VLXGBWYc/Brand-Bentley.png" },
  { name: "Nissan", logo: "https://i.postimg.cc/qRNym10M/Brand-Nissan.png" },
  { name: "Aston Martin", logo: "https://i.postimg.cc/Bnfpjf35/Brand-Aston-Martin.jpg" },
  { name: "Ferrari", logo: "https://i.postimg.cc/gk1zR4tH/Brand-Ferarri.jpg" },
];

const PremiumBrands = () => {
  return (
    <div className="w-full mx-auto p-4">
      {/* Başlık */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
          Explore Our Premium Brands
        </h2>
        <a
          href="#"
          className="text-gray-700 text-lg font-medium relative group transition duration-300 mt-2 md:mt-0"
        >
          Show All Brands →
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>

      {/* Marka Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-4 sm:gap-6 md:gap-8 items-center justify-center">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer p-2 transition transform duration-300 hover:scale-105"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 transition duration-300 hover:opacity-80"
            />
            <span className="text-gray-700 text-xs sm:text-sm font-medium transition duration-300 hover:text-gray-900">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumBrands;
