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
  
  const priceChangedRef = useRef(false); // yeni dəyişən əlavə et

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
    setSelectedModel("");  // Brand sıfırlanarsa, model sıfırlansın
    const params = new URLSearchParams(location.search);
    params.delete("Model"); // Model parametresi URL-dən silinsin
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

    <div className="flex mb-4 bg-gray-100 rounded-full p-1">
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
          const value = e.target.value;
          setSelectedModel(value);
          updateParams("Model", value);
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
          updateParams("Body", e.target.value);
        }}
        className="w-full border rounded p-2 text-sm"
      >
        <option value="">Body Style</option>
        {bodyTypes.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
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
            type="number"
            min={1900}
            max={2025}
            value={yearRange[0]}
            onChange={(e) =>
              setYearRange([+e.target.value, yearRange[1]])
            }
            className="w-1/2 border rounded p-1 text-sm"
            placeholder="From"
          />
          <input
            type="number"
            min={1900}
            max={2025}
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
          min={1900}
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

      {/* Kilometers */}
      <div className="mb-4">
        <label className="text-xs block mb-1">Kilometre Run</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min={0}
            max={500000}
            value={kilometers[0]}
            onChange={(e) =>
              setKilometers([+e.target.value, kilometers[1]])
            }
            className="w-1/2 border rounded p-1 text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            min={0}
            max={500000}
            value={kilometers[1]}
            onChange={(e) =>
              setKilometers([kilometers[0], +e.target.value])
            }
            className="w-1/2 border rounded p-1 text-sm"
            placeholder="Max"
          />
        </div>
        <Slider
          range
          min={0}
          max={500000}
          value={kilometers}
          onChange={setKilometers}
          trackStyle={[{ backgroundColor: "#3B82F6" }]}
          handleStyle={[
            { borderColor: "#3B82F6" },
            { borderColor: "#3B82F6" },
          ]}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="text-xs block mb-1">Price</label>
        <div className="flex gap-2 mb-2">
          <input
            value={priceRange[0]}
            onChange={(e) => {
              priceChangedRef.current = true;
              setPriceRange([+e.target.value, priceRange[1]]);
            }}
            className="w-1/2 border rounded p-1 text-sm"
            placeholder="Min"
          />
          <input
            value={priceRange[1]}
            onChange={(e) => {
              priceChangedRef.current = true;
              setPriceRange([priceRange[0], +e.target.value]);
            }}
            className="w-1/2 border rounded p-1 text-sm"
            placeholder="Max"
          />
        </div>
        <Slider
          min={0}
          max={1000000}
          range
          value={priceRange}
          onChange={(val) => {
            priceChangedRef.current = true;
            setPriceRange(val);
          }}
          trackStyle={[{ backgroundColor: "#3B82F6" }]}
          handleStyle={[
            { borderColor: "#3B82F6" },
            { borderColor: "#3B82F6" },
          ]}
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