import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaCar, FaCalendarAlt } from "react-icons/fa";
import { useRef } from "react";

const FilterSidebar = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [colors, setColors] = useState([]);
 
  const [yearRange, setYearRange] = useState([1900, 2025]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [kilometers, setKilometers] = useState([0, 500000]);
 
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBody, setSelectedBody] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [carType, setCarType] = useState("Used");
  const didMount = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
  
    const brand = params.get("Brand");
    const model = params.get("Model");
    const body = params.get("Body");
    if (body) setSelectedBody(body);

    const color = params.get("Color");
  
    const minPrice = params.get("MinPrice");
    const maxPrice = params.get("MaxPrice");
    const minMiles = params.get("MinMiles");
    const maxMiles = params.get("MaxMiles");
  
    if (brand) setSelectedBrand(brand);
    if (model) setSelectedModel(model);
    if (body) setSelectedBody(body);
    if (color) setSelectedColor(color);
    
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : priceRange[0],
        maxPrice ? Number(maxPrice) : priceRange[1],
      ]);
    }
  
    if (minMiles || maxMiles) {
      setKilometers([
        minMiles ? Number(minMiles) : kilometers[0],
        maxMiles ? Number(maxMiles) : kilometers[1],
      ]);
    }
  
    fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAll")
    .then((res) => res.json())
    .then((data) => {
      setCars(data);
      setBrands([...new Set(data.map((c) => c.brand))]);
      setColors([...new Set(data.map((c) => c.color))]);

      const prices = data.map((c) => c.price);
      setPriceRange([
        Math.min(...prices),
        Math.max(...prices),
      ]);
    });

  fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Car/GetAllBodyTypes")
    .then((res) => res.json())
    .then((data) => setBodyTypes(data));
  }, []);
  
  const updateParams = (key, value) => {
    const params = new URLSearchParams(location.search);
  
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  
    navigate({ search: params.toString() });
  };
  

  useEffect(() => {
    if (selectedBrand && cars.length > 0) {
      const filteredModels = cars
        .filter((car) => car.brand === selectedBrand)
        .map((car) => car.model);
      setModels([...new Set(filteredModels)]);
    } else {
      setModels([]);
    }
  }, [selectedBrand, cars]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("MinYear", yearRange[0]);
    params.set("MaxYear", yearRange[1]);
    params.set("MinMiles", kilometers[0]);
    params.set("MaxMiles", kilometers[1]);
    navigate({ search: params.toString() });
  }, [yearRange, kilometers]);
  
  useEffect(() => {
    if (didMount.current) {
      const params = new URLSearchParams(location.search);
  
      if (yearRange[0] !== 1900) params.set("MinYear", yearRange[0]);
      else params.delete("MinYear");
  
      if (yearRange[1] !== 2025) params.set("MaxYear", yearRange[1]);
      else params.delete("MaxYear");
  
      if (kilometers[0] !== 0) params.set("MinMiles", kilometers[0]);
      else params.delete("MinMiles");
  
      if (kilometers[1] !== 500000) params.set("MaxMiles", kilometers[1]);
      else params.delete("MaxMiles");
  
      navigate({ search: params.toString() });
    } else {
      didMount.current = true;
    }
  }, [yearRange, kilometers]);
  
  const priceChangedRef = useRef(false); 

useEffect(() => {
  if (priceChangedRef.current) {
    const params = new URLSearchParams(location.search);

    if (priceRange[0] !== 0) params.set("MinPrice", priceRange[0]);
    else params.delete("MinPrice");

    if (priceRange[1] !== 1000000) params.set("MaxPrice", priceRange[1]);
    else params.delete("MaxPrice");

    navigate({ search: params.toString() });
  }
}, [priceRange]);

useEffect(() => {
  if (selectedBrand === "") {
    setSelectedModel("");  
    const params = new URLSearchParams(location.search);
    params.delete("Model"); 
    navigate({ search: params.toString() });
  }
}, [selectedBrand]);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  
  if (selectedBrand) {
    params.set("Brand", selectedBrand);
  } else {
    params.delete("Brand");
  }
  
  if (selectedModel) {
    params.set("Model", selectedModel);
  } else {
    params.delete("Model");
  }
  
  if (selectedColor) {
    params.set("Color", selectedColor);
  } else {
    params.delete("Color");
  }
  
  navigate({ search: params.toString() });
}, [selectedBrand, selectedModel, selectedColor]);


return (
  <div className="bg-white p-4 rounded-lg w-full max-w-xs shadow-md text-sm">
    <h2 className="text-base font-semibold mb-4">Filter</h2>

    <div className="relative flex mb-4 bg-gray-100 rounded-full p-1">
  
  <div
    className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-blue-500 transition-all duration-300 ease-in-out ${
      carType === "Used" ? "left-1" : "left-1/2"
    }`}
  />

  {["Used", "New"].map((type) => (
    <button
      key={type}
      onClick={() => {
        setCarType(type);
        const params = new URLSearchParams(location.search);
        if (type === "Used") {
          params.set("MinMiles", "0");
          params.delete("MaxMiles");
        } else {
          params.set("MaxMiles", "1");
          params.delete("MinMiles");
        }
        navigate({ search: params.toString() });
      }}
      className={`flex-1 relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
        carType === type ? "text-white" : "text-gray-600"
      }`}
    >
      {type} Cars
    </button>
  ))}
</div>


    {/* Brand/Model/Body */}
    <div className="border-t pt-6 mt-6">
  <div className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-4">
    <FaCar /> 
    <span>Type, Brand, Model</span>
  </div>

  {/* Brand */}
  <div className="mb-4">
    <label className="block text-xs text-gray-500 mb-1">Select Brand</label>
    <select
      value={selectedBrand}
      onChange={(e) => {
        const newBrand = e.target.value;
      
        setSelectedBrand(newBrand);
        setSelectedModel(""); // Model sıfırlansın
        updateParams("Brand", newBrand);
      
        const params = new URLSearchParams(location.search);
        params.delete("Model"); // URL-dən model silinsin
        navigate({ search: params.toString() });
      }}
      
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
    >
      <option value="">Brand</option>
      {brands.map((b, i) => (
        <option key={i} value={b}>
          {b}
        </option>
      ))}
    </select>
  </div>

  {/* Model */}
  <div className="mb-4">
    <label className="block text-xs text-gray-500 mb-1">Select Model</label>
    <select
      value={selectedModel}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedModel(value);
        updateParams("Model", value);
      }}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
    >
      <option value="">Model</option>
      {models.map((m, i) => (
        <option key={i} value={m}>
          {m}
        </option>
      ))}
    </select>
  </div>

  {/* Body Type */}
  <div className="mb-2">
    <label className="block text-xs text-gray-500 mb-1">Body Style</label>
    <select
      value={selectedBody}
      onChange={(e) => {
        setSelectedBody(e.target.value);
        updateParams("Body", e.target.value);
      }}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
    >
      <option value="">Body Style</option>
      {bodyTypes.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  </div>
</div>


    {/* Vehicle Info */}
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
    <FaCalendarAlt /> Vehicle info
  </div>

  {/* Year */}
  <div className="mb-4">
    <label className="text-xs block mb-1">Manufacturing Year</label>
    <div className="flex gap-4">
      <input
        type="number"
        min={1900}
        max={2025}
        maxLength={4}
        value={yearRange[0]}
        onInput={(e) => {
          if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
          }
        }}
        onChange={(e) => setYearRange([+e.target.value, yearRange[1]])}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="From"
      />
      <input
        type="number"
        min={1900}
        max={2025}
        maxLength={4}
        value={yearRange[1]}
        onInput={(e) => {
          if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
          }
        }}
        onChange={(e) => setYearRange([yearRange[0], +e.target.value])}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="To"
      />
    </div>
  </div>

  {/* Kilometers */}
  <div className="mb-4">
    <label className="text-xs block mb-1">Kilometre Run</label>
    <div className="flex gap-4">
      <input
        type="number"
        min={0}
        max={500000}
        value={kilometers[0]}
        onChange={(e) => setKilometers([+e.target.value, kilometers[1]])}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Min"
      />
      <input
        type="number"
        min={0}
        max={500000}
        value={kilometers[1]}
        onChange={(e) => setKilometers([kilometers[0], +e.target.value])}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Max"
      />
    </div>
  </div>

  {/* Price */}
  <div className="mb-4">
    <label className="text-xs block mb-1">Price</label>
    <div className="flex gap-4">
      <input
        type="number"
        min={0}
        max={1000000}
        value={priceRange[0]}
        onChange={(e) => {
          priceChangedRef.current = true;
          setPriceRange([+e.target.value, priceRange[1]]);
        }}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Min"
      />
      <input
        type="number"
        min={0}
        max={1000000}
        value={priceRange[1]}
        onChange={(e) => {
          priceChangedRef.current = true;
          setPriceRange([priceRange[0], +e.target.value]);
        }}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Max"
      />
    </div>
  </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
        <div className="relative">
          <select
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              updateParams("Color", e.target.value);
            }}
            className="w-full appearance-none bg-white text-sm px-4 py-2.5 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select Color</option>
            {colors.map((color, i) => (
              <option key={i} value={color}>
                {color}
              </option>
            ))}
          </select>

          {/* Optional: Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
 
export default FilterSidebar;