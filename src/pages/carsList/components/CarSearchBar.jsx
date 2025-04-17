import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaCar, FaCalendarAlt } from "react-icons/fa";
 
const FilterSidebar = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [colors, setColors] = useState([]);
 
  const [yearRange, setYearRange] = useState([2016, 2023]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [kilometers, setKilometers] = useState([0, 500000]);
  const [seats, setSeats] = useState([2, 8]);
  const [hp, setHP] = useState([50, 1000]);
 
  const [selectedBrand, setSelectedBrand] = useState("BMW");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBody, setSelectedBody] = useState("Coupe");
  const [selectedColor, setSelectedColor] = useState("");
  const [carType, setCarType] = useState("Used");
 
  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    fetch("https://localhost:7282/api/Car/GetAll")
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setBrands([...new Set(data.map((c) => c.brand))]);
        setModels([...new Set(data.map((c) => c.model))]);
        setColors([...new Set(data.map((c) => c.color))]);
 
        const prices = data.map((c) => c.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      });
 
    fetch("https://localhost:7282/api/Car/GetAllBodyTypes")
      .then((res) => res.json())
      .then((data) => setBodyTypes(data.map((b) => b.name)));
  }, []);
 
  const updateParams = (key, value) => {
    const params = new URLSearchParams(location.search);
    params.set(key, value);
    navigate({ search: params.toString() });
  };
 
  return (
<div className="bg-white p-4 rounded-lg w-full max-w-xs shadow-md text-sm">
<h2 className="text-base font-semibold mb-4">Filter</h2>
 
      {/* Toggle Used / New */}
<div className="flex mb-4 bg-gray-100 rounded-full p-1">
        {["Used", "New"].map((type) => (
<button
            key={type}
            onClick={() => {
              setCarType(type);
              type === "Used"
                ? updateParams("MinMiles", "0")
                : updateParams("MaxMiles", "1");
            }}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
              carType === type
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
>
            {type} Cars
</button>
        ))}
</div>
 
      {/* Location */}
<div className="text-xs text-gray-500 mb-3">
        Location 📍{" "}
<span className="text-blue-600 underline cursor-pointer">
          Bangladesh
</span>
</div>
 
      {/* Brand/Model/Body */}
<div className="border-t pt-4 mt-2">
<div className="flex items-center gap-2 text-sm font-semibold mb-3">
<FaCar /> Type, Brand, Model
</div>
 
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            updateParams("Brand", e.target.value);
          }}
          className="w-full mb-2 border rounded p-2 text-sm"
>
<option value="">Brand</option>
          {brands.map((b, i) => (
<option key={i} value={b}>
              {b}
</option>
          ))}
</select>
 
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            updateParams("Model", e.target.value);
          }}
          className="w-full mb-2 border rounded p-2 text-sm"
>
<option value="">Model</option>
          {models.map((m, i) => (
<option key={i} value={m}>
              {m}
</option>
          ))}
</select>
 
        <select
          value={selectedBody}
          onChange={(e) => {
            setSelectedBody(e.target.value);
            updateParams("BodyType", e.target.value);
          }}
          className="w-full border rounded p-2 text-sm"
>
<option value="">Body Style</option>
          {bodyTypes.map((b, i) => (
<option key={i} value={b}>
              {b}
</option>
          ))}
</select>
</div>
 
      {/* Vehicle Info */}
<div className="border-t pt-4 mt-4">
<div className="flex items-center gap-2 text-sm font-semibold mb-3">
<FaCalendarAlt /> Vehicle info
</div>
 
        {/* Year */}
<div className="mb-4">
<label className="text-xs block mb-1">Manufacturing Year</label>
<div className="flex gap-2 mb-2">
<input
              value={yearRange[0]}
              onChange={(e) =>
                setYearRange([+e.target.value, yearRange[1]])
              }
              className="w-1/2 border rounded p-1 text-sm"
              placeholder="From"
            />
<input
              value={yearRange[1]}
              onChange={(e) =>
                setYearRange([yearRange[0], +e.target.value])
              }
              className="w-1/2 border rounded p-1 text-sm"
              placeholder="To"
            />
</div>
<Slider
            range
            min={2000}
            max={2025}
            value={yearRange}
            onChange={setYearRange}
            trackStyle={[{ backgroundColor: "#3B82F6" }]}
            handleStyle={[
              { borderColor: "#3B82F6" },
              { borderColor: "#3B82F6" },
            ]}
          />
</div>
 
        {/* Kilometer */}
<div className="mb-4">
<label className="text-xs block mb-1">Kilometre Run</label>
<div className="flex gap-2 mb-2">
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Min" />
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Max" />
</div>
<Slider
            min={0}
            max={500000}
            range
            value={kilometers}
            onChange={setKilometers}
            trackStyle={[{ backgroundColor: "#3B82F6" }]}
            handleStyle={[{ borderColor: "#3B82F6" }, { borderColor: "#3B82F6" }]}
          />
</div>
 
        {/* Seats */}
<div className="mb-4">
<label className="text-xs block mb-1">No of Seats</label>
<div className="flex gap-2 mb-2">
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Min" />
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Max" />
</div>
<Slider
            min={2}
            max={8}
            range
            value={seats}
            onChange={setSeats}
            trackStyle={[{ backgroundColor: "#3B82F6" }]}
            handleStyle={[{ borderColor: "#3B82F6" }, { borderColor: "#3B82F6" }]}
          />
</div>
 
        {/* Power HP */}
<div className="mb-4">
<label className="text-xs block mb-1">Power HP</label>
<div className="flex gap-2 mb-2">
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Min" />
<input className="w-1/2 border rounded p-1 text-sm" placeholder="Max" />
</div>
<Slider
            min={50}
            max={1000}
            range
            value={hp}
            onChange={setHP}
            trackStyle={[{ backgroundColor: "#3B82F6" }]}
            handleStyle={[{ borderColor: "#3B82F6" }, { borderColor: "#3B82F6" }]}
          />
</div>
 
        {/* Price */}
<div className="mb-4">
<label className="text-xs block mb-1">Price</label>
<div className="flex gap-2 mb-2">
<input
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([+e.target.value, priceRange[1]])
              }
              className="w-1/2 border rounded p-1 text-sm"
              placeholder="Min"
            />
<input
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value])
              }
              className="w-1/2 border rounded p-1 text-sm"
              placeholder="Max"
            />
</div>
<Slider
            min={0}
            max={1000000}
            range
            value={priceRange}
            onChange={setPriceRange}
            trackStyle={[{ backgroundColor: "#3B82F6" }]}
            handleStyle={[{ borderColor: "#3B82F6" }, { borderColor: "#3B82F6" }]}
          />
</div>
 
        {/* Color */}
<div className="mb-2">
<label className="text-xs block mb-1">Color</label>
<select
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              updateParams("Color", e.target.value);
            }}
            className="w-full border rounded p-2 text-sm"
>
<option value="">Select Color</option>
            {colors.map((color, i) => (
<option key={i} value={color}>
                {color}
</option>
            ))}
</select>
</div>
</div>
</div>
  );
};
 
export default FilterSidebar;