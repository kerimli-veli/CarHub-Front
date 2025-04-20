import React, { useState } from 'react';

const ProductFoto = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  return (
    <div className="flex gap-6">
      {/* Thumbnail List */}
      <div className="flex flex-col gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition duration-300 ${
              selectedImage === img ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              className="w-24 h-24 object-cover bg-white p-2"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center bg-white p-4 rounded-xl shadow-md">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-[500px] h-[500px] object-contain"
        />
      </div>
    </div>
  );
};

export default ProductFoto;
