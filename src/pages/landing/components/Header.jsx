import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate()

  return (
    <nav className="text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-xl font-bold sm:text-2xl md:text-3xl">
          CarHub
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="hover:text-gray-400">Home</a>

          <div className="relative group">
            <button className="hover:text-gray-400">Listings ▼</button>
            <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg hidden group-hover:block">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 1</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 2</a>
            </div>
          </div>

          <div className="relative group">
            <button className="hover:text-gray-400">Blog ▼</button>
            <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg hidden group-hover:block">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Article 1</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Article 2</a>
            </div>
          </div>

          <a href="#" className="hover:text-gray-400">Pages</a>
          <a href="#" className="hover:text-gray-400">About</a>
          <a href="#" className="hover:text-gray-400">Contact</a>

          {/* Sign In Button */}
          <button onClick={() =>{ navigate('signIn')}}
            className="flex items-center hover:text-gray-400 transition duration-300 ease-in-out transform hover:scale-105">
            <span className="mr-2 text-lg font-semibold">Sign in</span>
            <svg className="w-6 h-6 text-white transition-colors duration-300 ease-in-out hover:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0h-4m4 0h4"></path>
            </svg>
          </button>

          {/* Submit Listing Button */}
          <button className="border border-white px-6 py-2 rounded-full text-lg font-medium text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            Submit Listing
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-400 hover:border-gray-400" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="fill-current h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18m-9 6h9"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 text-white p-4 space-y-2">
          <a href="#" className="block hover:text-gray-400">Home</a>
          <a href="#" className="block hover:text-gray-400">Listings</a>
          <a href="#" className="block hover:text-gray-400">Blog</a>
          <a href="#" className="block hover:text-gray-400">Pages</a>
          <a href="#" className="block hover:text-gray-400">About</a>
          <a href="#" className="block hover:text-gray-400">Contact</a>
          <button className="w-full border border-white px-6 py-2 rounded-full text-lg font-medium text-white hover:bg-white hover:text-black transition-all duration-300">
            Submit Listing
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;