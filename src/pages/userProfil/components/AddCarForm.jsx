import React, { useState, useEffect } from 'react';
import GetUserFromToken from './../../common/GetUserFromToken';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';


export default function AddCarForm() {

  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissionTypes, setTransmissionTypes] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  

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
    images: [] 
  });

  const isFormValid = () => {
  return (
    formData.brand.trim() &&
    formData.model.trim() &&
    formData.year &&
    formData.price &&
    formData.fuel &&
    formData.transmission &&
    formData.miles &&
    formData.body &&
    formData.color.trim() &&
    formData.vin.trim() &&
    formData.text.trim() &&
    formData.images.length === 5
  );
};



  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const [fuels, transmissions, bodies] = await Promise.all([
        axios.get('https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAllFuelTypes'),
        axios.get('https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAllTransmissionTypes'),
        axios.get('https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAllBodyTypes'),
      ]);
      setFuelTypes(fuels.data);
      setTransmissionTypes(transmissions.data);
      setBodyTypes(bodies.data);
    } catch (error) {
      console.error("Failed to load car options:", error);
    }
  };

  fetchOptions();
}, []);


  const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  if (['year', 'price', 'miles'].includes(name)) {
    const numericValue = parseInt(value, 10);

    if (name === 'year') {
      if (numericValue < 1800) {
        newValue = 1800;
      } else {
        newValue = numericValue;
      }
    } else if (name === 'miles'){
      if (numericValue < 0) {
        newValue = 0;
      } else {
        newValue = numericValue;
      }
    }
    else {
      if (numericValue < 1) {
        newValue = 1;
      } else {
        newValue = numericValue;
      }
    }

    if (value === '') {
      newValue = '';
    }
  }

  setFormData({ ...formData, [name]: newValue });
};


  const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files);
  const totalFiles = formData.images.length + newFiles.length;

  if (totalFiles > 5) {
    toast.error("You must upload exactly 5 images!", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  const updatedImages = [...formData.images, ...newFiles].slice(0, 5);
  setFormData({ ...formData, images: updatedImages });
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
      data.append('CarImagePaths', file); 
    });
  
    try {
      await axios.post(
        'https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car',
        data
      );
      setShowSuccess(true); 
      window.location.reload();
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
          { name: 'year', placeholder: 'Year', type: 'number', min: '1800' },
          { name: 'price', placeholder: 'Price', type: 'number', min: '1' },
          { name: 'miles', placeholder: 'Miles', type: 'number', min: '0' },
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

        <select
  name="fuel"
  value={formData.fuel}
  onChange={handleChange}
  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800"
>
  <option value="">Select Fuel Type</option>
  {fuelTypes.map((fuel) => (
    <option key={fuel.id} value={fuel.name}>{fuel.name}</option>
  ))}
</select>

<select
  name="transmission"
  value={formData.transmission}
  onChange={handleChange}
  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800"
>
  <option value="">Select Transmission</option>
  {transmissionTypes.map((trans) => (
    <option key={trans.id} value={trans.name}>{trans.name}</option>
  ))}
</select>

<select
  name="body"
  value={formData.body}
  onChange={handleChange}
  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800"
>
  <option value="">Select Body Type</option>
  {bodyTypes.map((body) => (
    <option key={body.id} value={body.name}>{body.name}</option>
  ))}
</select>

        
        <textarea
          name="text"
          placeholder="Other info..."
          value={formData.text}
          onChange={handleChange}
          rows={4}
          className="md:col-span-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400 text-gray-800"
        />

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Upload image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
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
          disabled={!isFormValid()}
          className={`md:col-span-2 mt-4 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform duration-200
            ${isFormValid() ? 'bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-xl hover:scale-[1.01]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Add Car
        </button>
      </form>
    </div>
  );
}
