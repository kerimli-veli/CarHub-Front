import React, { useState } from 'react';

const ProductDescription = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-4 w-[500px]">
      {/* Name */}
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

      {/* Stock */}
      <p className="text-green-600 font-medium text-sm">In Stock</p>

      {/* Price */}
      <div className="text-3xl font-semibold text-gray-800">${product.unitPrice}</div>

      {/* Description */}
      <p className="text-gray-600">{product.description}</p>
      <hr className="my-4" />

      {/* Quantity & Add to Basket */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={decrement}
            className="px-3 py-2 text-xl font-bold text-gray-700"
          >
            −
          </button>
          <span className="px-4 text-lg">{quantity}</span>
          <button
            onClick={increment}
            className="px-3 py-2 text-xl font-bold text-gray-700"
          >
            +
          </button>
        </div>

        <button
          onClick={() => console.log(`Sepete eklendi: ${product.id}, Adet: ${quantity}`)}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 px-6 rounded-md"
        >
          Add to Basket
        </button>
      </div>

      {/* Delivery Info */}
      <div className="border border-gray-300 rounded-md mt-6 divide-y">
        <div className="flex items-start gap-4 p-4">
          <span className="text-2xl">🚚</span>
          <div>
            <h3 className="font-semibold">Free Delivery</h3>
            <p className="text-sm text-gray-600">Enter your postal code for Delivery Availability</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4">
          <span className="text-2xl">🔁</span>
          <div>
            <h3 className="font-semibold">Return Delivery</h3>
            <p className="text-sm text-gray-600">Free 30 Days Delivery Returns. <a className="text-blue-500 underline" href="#">Details</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
