import React, { useState } from 'react';
import GetUserFromToken from './../../common/GetUserFromToken';
import axios from 'axios';

export default function AddCarForm() {
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
    images: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user?.id || 1,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      fuel: parseInt(formData.fuel),
      transmission: parseInt(formData.transmission),
      miles: parseInt(formData.miles),
      carImagePaths: formData.images.map((path) => ({
        id: 0,
        carId: 0,
        imagePath: path
      })),
      body: parseInt(formData.body),
      color: formData.color,
      vin: formData.vin,
      text: formData.text
    };

    try {
      await axios.post('https://localhost:7282/api/Car', payload);
      alert('Maşın uğurla əlavə olundu!');
    } catch (error) {
      console.error(error);
      alert('Xəta baş verdi');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-12 transition-all duration-500 ease-in-out">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight text-center">🚗 Add new car</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'brand', placeholder: 'Brand' },
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
          <label className="block text-gray-700 font-medium mb-2">Şəkil Linkləri</label>
          {formData.images.map((img, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Image URL ${index + 1}`}
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="w-full px-4 py-2 mb-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-500 hover:text-blue-600 transition"
          >
            + Yeni şəkil əlavə et
          </button>
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
