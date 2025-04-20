import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ products, currentProduct }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  if (!products || !currentProduct) return null;

  const related = products.filter(
    (item) =>
      item.categoryId === currentProduct.categoryId &&
      item.id !== currentProduct.id
  );

  const scrollAmount = 400;

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center">
        <span className="w-1.5 h-6 bg-red-500 mr-2 rounded-sm"></span> Related Items
      </h2>

      <div className="relative">
        <div className="flex items-center">
          {/* Left Button */}
          <button
            onClick={scrollLeft}
            className="bg-white shadow-lg text-gray-700 hover:bg-red-100 hover:text-red-500 rounded-full p-2 transition-all duration-300 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Product Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth mx-4"
          >
            {related.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.1)] p-4 cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:-translate-y-1"
                onClick={() => {
                  navigate(`/product-details/${product.id}`);
                  window.location.reload();
                }}
              >
                <div className="overflow-hidden rounded-md mb-3">
                  <img
                    src={Array.isArray(product.imagePath) ? product.imagePath[0] : product.imagePath}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="text-gray-900 font-semibold text-base mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-red-500 font-bold text-lg">
                  ${product.unitPrice}
                </p>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={scrollRight}
            className="bg-white shadow-lg text-gray-700 hover:bg-red-100 hover:text-red-500 rounded-full p-2 transition-all duration-300 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
