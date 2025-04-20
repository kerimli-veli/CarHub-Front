import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCart = ({ product }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/product', { state: product });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // navigate tetiklenmesin
    console.log(`Sepete eklendi: ${product.name} | ID: ${product.id}`);
    // burada redux veya context'e ürün ekleyebilirsin
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all"
      onClick={handleNavigate}
    >
      <div className="w-full h-48 bg-white flex items-center justify-center mb-3 overflow-hidden rounded-md">
        <img
          src={product.imagePath?.[0]}
          alt={product.name}
          className="object-contain h-full max-w-full"
        />
      </div>

      <h3 className="text-gray-900 font-medium text-base mb-1">{product.name}</h3>
      <p className="text-red-500 font-semibold mb-2">${product.unitPrice}</p>

      <button
        onClick={handleAddToCart}
        className="bg-black text-white text-xs font-semibold py-2 px-4 rounded w-full hover:bg-gray-800 transition"
      >
        Add To Basket
      </button>
    </div>
  );
};

export default ProductCart;
