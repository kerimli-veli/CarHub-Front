import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ products, currentProduct }) => {
  const navigate = useNavigate();

  const related = products.filter(
    (item) =>
      item.categoryId === currentProduct.categoryId && item.id !== currentProduct.id
  );

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-lg font-bold text-red-500 mb-4">Related Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 shadow-md p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/product-details/${product.id}`, { state: product })}
          >
            <img
              src={product.imagePath}
              alt={product.name}
              className="w-full h-48 object-cover mb-3 rounded-md"
            />
            <h3 className="text-gray-900 font-medium text-base mb-1 truncate">{product.name}</h3>
            <p className="text-red-500 font-semibold mb-2">${product.unitPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;