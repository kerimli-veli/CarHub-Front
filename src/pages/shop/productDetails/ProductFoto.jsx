import React, { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const ProductFoto = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(images[0] || '');
  }, [images]);

  const slides = images.map((img) => ({ src: img }));

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row">
      
      <div
        className="relative w-[500px] h-[500px] bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden group border border-gray-200 cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        <img
          src={selectedImage}
          alt="Selected"
          loading="lazy"
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 text-xs px-3 py-1 rounded-full shadow text-gray-700">
          Preview
        </div>
      </div>

      
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible max-w-full md:max-w-none">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedImage(img);
            }}
            className={`w-20 h-20 rounded-lg border-2 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedImage === img ? 'border-blue-500 scale-105' : 'border-gray-200'
            }`}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={images.indexOf(selectedImage)}
        plugins={[Zoom]}
      />
    </div>
  );
};

export default ProductFoto;
