import React, { useState, useEffect, useRef, useCallback } from 'react';

const CategorySidebar = ({ onCategoryClick, onPriceRangeChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 20, max: 360 });
  const [selectedMinPrice, setSelectedMinPrice] = useState(20);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(360);
  const categoriesListRef = useRef(null);

  // Fetch categories from API
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

  const handleMinPriceChange = useCallback((event) => {
    const newMinPrice = parseInt(event.target.value, 10);
    setSelectedMinPrice(newMinPrice);
    onPriceRangeChange({ minPrice: newMinPrice, maxPrice: selectedMaxPrice });
  }, [selectedMaxPrice, onPriceRangeChange]);

  const handleMaxPriceChange = useCallback((event) => {
    const newMaxPrice = parseInt(event.target.value, 10);
    setSelectedMaxPrice(newMaxPrice);
    onPriceRangeChange({ minPrice: selectedMinPrice, maxPrice: newMaxPrice });
  }, [selectedMinPrice, onPriceRangeChange]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryClick(category); // Trigger the onCategoryClick with the selected category
  };

  return (
    <div className="pt-15 pl-23">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <span>Home / </span>
        <span className="text-gray-700 font-semibold">Shop</span>
      </nav>

      {/* Shop Title */}
      <h1 className="text-4xl font-bold mb-10">Shop</h1>

      {/* Sidebar */}
      <div className="space-y-9">
        {/* Categories Section */}
        <div className="bg-white rounded-md shadow-sm w-[327px] h-[377px] p-4">
          <h2 className="text-lg font-bold mb-4 text-[18px]">Categories</h2>
          <div
            ref={categoriesListRef}
            className="overflow-auto scrollbar-hide"
            style={{
              maxHeight: '250px',
              /* Webkit scrollbar hidden */
              scrollbarWidth: 'none', /* Firefox */
            }}
          >
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex justify-between text-gray-700 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="text-[15px]">{category.name}</span>
                  <span className="text-[15px]">({category.count})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="bg-white rounded-md shadow-sm w-[327px] h-[150px] p-4">
          <h2 className="text-lg font-bold mb-4 text-[18px]">Prices</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              {/* Price Range Input */}
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={selectedMaxPrice}
                onChange={handleMaxPriceChange}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${(selectedMaxPrice / priceRange.max) * 100}%, #ccc ${(selectedMaxPrice / priceRange.max) * 100}%, #ccc 100%)`,
                  height: '4px',
                }}
              />

              {/* Price Labels */}
              <div className="absolute flex justify-between text-sm text-gray-500 w-full top-6">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Scrollbar Style */}
          <style jsx>{`.w-full::-webkit-scrollbar {width: 8px;} .w-full::-webkit-scrollbar-thumb {background-color: black;border-radius: 10px;}.w-full::-webkit-scrollbar-track {background: transparent;}`}</style>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
