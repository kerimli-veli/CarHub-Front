import React, { useState } from 'react';
import CategorySidebar from './common/CategorySidebar';
import Products from './common/Products';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 360 });

  const handleCategoryClick = (category) => {setSelectedCategory(category);};

  const handlePriceRangeChange = (newPriceRange) => {setPriceRange(newPriceRange);};

  return (
    <div className="flex">
      <CategorySidebar
        onCategoryClick={handleCategoryClick}
        onPriceRangeChange={handlePriceRangeChange}/>
      <div className="flex-grow">
        <Products selectedCategory={selectedCategory} priceRange={priceRange} />
      </div>
    </div>
  );
};

export default ShopPage;
