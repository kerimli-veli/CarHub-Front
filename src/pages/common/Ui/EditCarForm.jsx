import { Car, Calendar, Paintbrush, DollarSign, TextCursorInput, Gauge, Settings, Fuel, Fingerprint, Truck, ChevronDown, X, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import React from "react";
import { useState, useRef, useEffect } from "react";


const EditCarForm = ({ car }) => {
  const brandRef = useRef();
  const modelRef = useRef();
  const yearRef = useRef();
  const colorRef = useRef();
  const priceRef = useRef();
  const milesRef = useRef();
  const transmissionRef = useRef();
  const fuelRef = useRef();
  const vinRef = useRef();
  const bodyRef = useRef();
  const textRef = useRef();

  const [showImages, setShowImages] = useState(false);
  const [editingImages, setEditingImages] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedMainImageFile, setSelectedMainImageFile] = useState(null);


  const imageLabels = [
    "Main Image",
    "First Side Image",
    "Second Side Image",
    "Engine Image",
    "Salon Image"
  ];
  
  const [images, setImages] = useState([
    null, null, null, null, null
  ]);
  
  useEffect(() => {
    if (car?.carImagePaths?.length > 0) {
      const imagesObj = car.carImagePaths[0];
      const initialImages = [
        imagesObj.mainImage || null,
        imagesObj.firstSideImage || null,
        imagesObj.secondSideImage || null,
        imagesObj.engineImage || null,
        imagesObj.salonImage || null,
      ];
      setImages(initialImages);
    }
  }, [car]);
  
  


  const handleSaveChanges = async () => {
    const formData = new FormData();
  
    formData.append('CarId', car.id);
    formData.append('Brand', brandRef.current.value);
    formData.append('Model', modelRef.current.value);
    formData.append('Year', yearRef.current.value);
    formData.append('Price', priceRef.current.value);
    formData.append('Miles', milesRef.current.value);
    formData.append('Color', colorRef.current.value);
    formData.append('VIN', vinRef.current.value);
    formData.append('Text', textRef.current.value);
    formData.append('Fuel', fuelRef.current.value);
    formData.append('Transmission', transmissionRef.current.value);
    formData.append('Body', bodyRef.current.value);
  
    // Şəkilləri yoxlayaq və yalnız FILE olanları yollayaq
    if (images[0] instanceof File) {
      formData.append('MainImage', images[0]);
    }
    if (images[1] instanceof File) {
      formData.append('FirstSideImage', images[1]);
    }
    if (images[2] instanceof File) {
      formData.append('SecondSideImage', images[2]);
    }
    if (images[3] instanceof File) {
      formData.append('EngineImage', images[3]);
    }
    if (images[4] instanceof File) {
      formData.append('SalonImage', images[4]);
    }
  
    try {
      const response = await fetch('https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Car/CarUpdate', {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update car');
      }
  
      const data = await response.json();
      console.log('Car updated successfully:', data);
      // success notification vs
    } catch (error) {
      console.error('Update failed:', error);
    }
  };
  


  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null; // Silinən şəkili null edirik
    setImages(updatedImages);
  };
  
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file; // <--- BURA!
      setImages(newImages);
    }
  };
  


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 mx-4 sm:mx-8 md:ml-[8%] md:-mt-[10%] md:-mr-10 mt-6 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6"
    >
      {/* Şəkil Edit İkonu */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold text-gray-900">Edit Your Car</h2>
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => setEditingImages(prev => !prev)}
          >
            {editingImages ? (
              <div className="flex items-center gap-2">
                <ChevronDown className="w-6 h-6 rotate-90" /> {/* Geri üçün ikon fırladılmış */}
                <span className="text-md font-medium">Back to Edit</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ChevronDown className="w-6 h-6" />
                <span className="text-md font-medium">Edit Images</span>
              </div>
            )}
          </div>
      </div>

      {editingImages && (
  <div className="flex flex-col items-center space-y-8 mb-8">
    {/* Böyük əsas şəkil */}
    <div className="w-full max-w-3xl h-[200px] border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white relative">
      {images[mainImageIndex] ? (
        <>
          <img
            src={
    images[mainImageIndex] instanceof File
      ? URL.createObjectURL(images[mainImageIndex])
      : `https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/${images[mainImageIndex]}`
  }
            alt={`Main Car Image`}
            className="object-cover w-full h-full"
          />
          <button
            onClick={() => handleRemoveImage(mainImageIndex)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-200 transition">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(mainImageIndex, e)}
            className="hidden"
          />
          <ImagePlus className="w-10 h-10 text-gray-400" />
          <span className="text-lg text-gray-400 mt-2">
          {imageLabels[mainImageIndex] || "Additional Image"}
          </span>
        </label>
      )}
    </div>

    {/* Thumbnail-lar */}
    <div className="flex flex-wrap gap-4 justify-center">
      {images.map((img, index) => (
        <div
          key={index}
          className={`w-24 h-24 border-2 ${
            index === mainImageIndex ? "border-blue-500" : "border-gray-300"
          } rounded-xl overflow-hidden cursor-pointer transition shadow-sm bg-white relative`}
          onClick={() => setMainImageIndex(index)}
        >
          {img ? (
            <img
              src={img instanceof File ? URL.createObjectURL(img) : `https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/${img}`}
              alt={`Thumbnail ${index}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-200 transition">
              <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    handleFileChange(index, e);
    
  }}
  className="hidden"
/>

              <ImagePlus className="w-6 h-6 text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-1 text-center">
              {imageLabels[index] || "Additional Image"}
              </span>
            </label>
          )}
        </div>
      ))}
    </div>
  </div>
)}


        {!editingImages && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Car className="w-4 h-4" /> Brand
            </label>
            <input
              type="text"
              ref={brandRef}
              defaultValue={car.brand}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Model */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <TextCursorInput className="w-4 h-4" /> Model
            </label>
            <input
              type="text"
              ref={modelRef}
              defaultValue={car.model}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Year */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" /> Year
            </label>
            <input
              type="number"
              ref={yearRef}
              defaultValue={car.year}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Color */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Paintbrush className="w-4 h-4" /> Color
            </label>
            <input
              type="text"
              ref={colorRef}
              defaultValue={car.color}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" /> Price ($)
            </label>
            <input
              type="number"
              ref={priceRef}
              defaultValue={car.price}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Miles */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4" /> Miles
            </label>
            <input
              type="number"
              ref={milesRef}
              defaultValue={car.miles}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Transmission */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4" /> Transmission
            </label>
            <input
              type="text"
              ref={transmissionRef}
              defaultValue={car.transmission}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Fuel Type */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Fuel className="w-4 h-4" /> Fuel Type
            </label>
            <input
              type="text"
              ref={fuelRef}
              defaultValue={car.fuel}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* VIN */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Fingerprint className="w-4 h-4" /> VIN
            </label>
            <input
              type="text"
              ref={vinRef}
              defaultValue={car.vin}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Body Type */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4" /> Body Type
            </label>
            <input
              type="text"
              ref={bodyRef}
              defaultValue={car.body}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
            />
          </div>
  
          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
              <TextCursorInput className="w-4 h-4" /> Description
            </label>
            <textarea
              rows={4}
              defaultValue={car.text}
              ref={textRef}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm resize-none"
            />
          </div>
        </div>
        )}

{!editingImages && (
  <Button 
  onClick={handleSaveChanges} 
  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all duration-300"
>
  Save Changes
</Button>

)}

    </motion.div>
  );
};

export default EditCarForm;
