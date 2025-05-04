import React from 'react';
import { Check } from 'lucide-react';

const CarCardAuction = ({ car, selectedCarId, onSelect, userId }) => {
  const isSelected = selectedCarId === car.id;

  return (
    <div className={`relative w-70 m-4 p-4 shadow-lg rounded-2xl border transition-all duration-300 ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold overflow-hidden text-ellipsis text-lg whitespace-nowrap">
          {car.brand} {car.model}
        </h2>
        <div
          onClick={() => onSelect(car.id)} // Seçim funksiyasını tetik edirik
          className={`w-5 h-5 rounded-sm border-2 cursor-pointer flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}
        >
          {isSelected && <Check size={14} className="text-white" />}
        </div>
      </div>
      <p className="text-sm text-blue-500 mb-4">{car.category}</p>
      <img src={car.image} alt={car.name || 'Car'} className="h-50 w-full object-contain mb-4" />
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          {car.fuel}
        </div>
        <div className="flex items-center gap-1">
          {car.transmission}
        </div>
        <div className="flex items-center gap-1">
          {car.body}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xl font-bold">{car.price}</span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Edit Car
        </button>
      </div>
    </div>
  );
};

export default CarCardAuction;