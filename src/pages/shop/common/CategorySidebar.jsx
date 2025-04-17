import React, { useState, useEffect, useRef, useCallback } from 'react';

const CategorySidebar = ({ onCategoryClick, onPriceRangeChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 360 });
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(360);
  const categoriesListRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7282/api/Category/GetAll');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleMaxPriceChange = useCallback((event) => {
    const newMaxPrice = parseInt(event.target.value, 10);
    setSelectedMaxPrice(newMaxPrice);
    onPriceRangeChange({ minPrice: 0, maxPrice: newMaxPrice }); 
  }, [onPriceRangeChange]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryClick(category); 
  };

  return (
    <div className="pt-15 pl-23 sticky top-24 max-h-screen overflow-auto">
      

      
      <div className="space-y-9">
        
        <div className="bg-white shadow-sm w-[327px] h-[377px] p-4 border border-[#E9E9E9] rounded-[16px]">
          <h2 className="text-lg font-bold mb-4 text-[18px]">Categories</h2>
          <div ref={categoriesListRef} className="overflow-auto scrollbar-hide"
            style={{ maxHeight: '250px', scrollbarWidth: 'none' }}>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id} className={`flex justify-between text-gray-700 cursor-pointer transition-all duration-300 ease-in-out 
                  ${selectedCategory?.id === category.id ? 'text-black font-semibold scale-105' : 'text-gray-700 hover:text-black hover:scale-105'} 
                  p-2 rounded-md`} onClick={() => handleCategoryClick(category)}>
                  <span className="text-[15px]">{category.name}</span>
                  {/* <span className="text-[15px]">({category.count})</span> */}
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="bg-white shadow-sm w-[327px] h-[150px] p-4 border border-[#E9E9E9] rounded-[16px]">
          <h2 className="text-lg font-bold mb-4 text-[18px]">Prices</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <input type="range" min={priceRange.min} max={priceRange.max} value={selectedMaxPrice} onChange={handleMaxPriceChange}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #000 0%, #000 ${(selectedMaxPrice / priceRange.max) * 100}%, #ccc ${(selectedMaxPrice / priceRange.max) * 100}%, #ccc 100%)`, height: '4px' }} />
              <div className="absolute flex justify-between text-sm text-gray-500 w-full top-6">
                <span>${priceRange.min}</span>
                <span>${selectedMaxPrice}</span>
              </div>
            </div>
          </div>

            <style jsx>{`.w-full::-webkit-scrollbar {width: 8px;}.w-full::-webkit-scrollbar-thumb {background-color: black;border-radius: 10px;} .w-full::-webkit-scrollbar-track {background-color: black;}
             input[type='range']::-webkit-slider-runnable-track {background-color: #f9fbfc;height: 8px;}
             input[type='range']::-webkit-slider-thumb {background-color: black;border-radius: 50%;border: 3px solid #000;width: 16px;height: 16px;margin-top: -4px;}
             input[type='range']:focus {outline: none;}`}
            </style>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
