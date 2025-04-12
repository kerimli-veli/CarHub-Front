import React, { useState } from 'react';
import CategorySidebar from './common/CategorySidebar';
import Products from './common/Products';
import Footer from '../landing/components/Footer';
import Header from '../landing/components/Header';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 360 });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  return (
    <>
      <Header />

      <div className="pt-15 pl-23 ">
        
        <h1 className="text-4xl font-bold">Shop</h1>
      </div>

      <div className="flex">
        <CategorySidebar
          onCategoryClick={handleCategoryClick}
          onPriceRangeChange={handlePriceRangeChange}
        />
        <div className="flex-grow">
          <Products selectedCategory={selectedCategory} priceRange={priceRange} />
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default ShopPage;
