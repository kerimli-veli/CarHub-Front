import React, { useState } from 'react';
import GetUserFromToken from './../../common/GetUserFromToken';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";



export default function AddCarForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const user = GetUserFromToken().id;
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    fuel: '',
    transmission: '',
    miles: '',
    body: '',
    color: '',
    vin: '',
    text: '',
    images: [] // Fayllar üçün
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = formData.images.length + newFiles.length;
  
    if (totalFiles > 5) {
      alert("Ən çox 5 şəkil yükləyə bilərsiniz.");
      return;
    }
  
    setFormData({ ...formData, images: [...formData.images, ...newFiles] });
  };
  
  const handleImageRemove = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('userId', String(user?.id || 1));
    data.append('brand', formData.brand);
    data.append('model', formData.model);
    data.append('year', String(formData.year));
    data.append('price', String(formData.price));
    data.append('fuel', String(formData.fuel));
    data.append('transmission', String(formData.transmission));
    data.append('miles', String(formData.miles));
    data.append('body', String(formData.body));
    data.append('color', formData.color);
    data.append('vin', formData.vin);
    data.append('text', formData.text);
  
    formData.images.forEach((file) => {
      data.append('CarImagePaths', file); // 🎯 DÜZGÜN AD BUDUR!
    });
  
    try {
      await axios.post(
        'https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car',
        data
      );
      setShowSuccess(true); // ✅ Success banneri göstər
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error('Xəta:', error.response?.data || error.message);
      alert('Xəta baş verdi: ' + (error.response?.data?.message || 'Bilinməyən problem'));
    }
  };
  

  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-12 transition-all duration-500 ease-in-out">
      <AnimatePresence>
  {showSuccess && (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-green-300 text-green-700 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-medium text-sm sm:text-base">Maşın uğurla əlavə olundu!</span>
    </motion.div>
  )}
</AnimatePresence>


      <h2 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight text-center">🚗 Add new car</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ name: 'brand', placeholder: 'Brand' },
          { name: 'model', placeholder: 'Model' },
          { name: 'year', placeholder: 'Year', type: 'number' },
          { name: 'price', placeholder: 'Price', type: 'number' },
          { name: 'fuel', placeholder: 'Fuel (0=Petrol, 1=Diesel)', type: 'number' },
          { name: 'transmission', placeholder: 'Transmission (0=Manual, 1=Auto)', type: 'number' },
          { name: 'miles', placeholder: 'Miles', type: 'number' },
          { name: 'body', placeholder: 'Body Type', type: 'number' },
          { name: 'color', placeholder: 'Color' },
          { name: 'vin', placeholder: 'VIN' },
        ].map((field, i) => (
          <input
            key={i}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400 text-gray-800"
          />
        ))}
        
        <textarea
          name="text"
          placeholder="Əlavə məlumatlar..."
          value={formData.text}
          onChange={handleChange}
          rows={4}
          className="md:col-span-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400 text-gray-800"
        />

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Şəkil Yüklə</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          {/* Preview added images */}
<div className="flex flex-wrap gap-4 mt-4">
  {formData.images.map((img, index) => (
    <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
      <img
        src={URL.createObjectURL(img)}
        alt={`Şəkil ${index + 1}`}
        className="object-cover w-full h-full"
      />
      <button
        type="button"
        onClick={() => handleImageRemove(index)}
        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
        title="Sil"
      >
        ✕
      </button>
    </div>
  ))}
</div>

        </div>

        <button
          type="submit"
          className="md:col-span-2 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-transform duration-200"
        >
          ✅ Maşını Əlavə Et
        </button>
      </form>
    </div>
  );
}
