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
  { name: "Ferarri", logo: "https://i.postimg.cc/gk1zR4tH/Brand-Ferarri.jpg" },
];

const PremiumBrands = () => {
  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Explore Our Premium Brands</h2>
        <a
          href="#"
          className="text-gray-700 text-lg font-medium relative group transition duration-300"
        >
          Show All Brands →
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-8 items-center justify-center">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer transition transform duration-300 hover:scale-105"
          >
            <img src={brand.logo} alt={brand.name} className="w-19 h-17 mb-2 transition duration-300 hover:opacity-80" />
            <span className="text-gray-700 text-sm font-medium transition duration-300 hover:text-gray-900">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumBrands;