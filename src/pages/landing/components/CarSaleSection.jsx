import React from "react";

const CarSaleSection = () => { 
  return ( 
  <div className="flex flex-col lg:flex-row items-center justify-between px-10 py-16 bg-white"> 
  <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2"> 
      <img
          src="https://i.postimg.cc/fLTXWFJc/CarSale1.png"
          alt="Car 1"
          className="w-full rounded-xl"/> 
      <img
          src="https://i.postimg.cc/L4TTKc88/CarSale2.png"
          alt="Car 2"
          className="w-full rounded-xl"/> 
      <img
          src="https://i.postimg.cc/qqzgF67n/CarSale3.png"
          alt="Car 3"
          className="col-span-2 w-full rounded-xl"/>
   </div>

{/* Text Section */}
  <div className="lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
    <h2 className="text-3xl font-bold text-gray-900">
      Get A Fair Price For Your Car Sell To Us Today
    </h2>
    <p className="text-gray-600 mt-4">
      We are committed to providing our customers with exceptional service,
      competitive pricing, and a wide range of options.
    </p>
    <ul className="mt-4 space-y-2 text-gray-700">
      <li className="flex items-center gap-2">
        ✅ We are the UK's largest provider, with more patrols in more places
      </li>
      <li className="flex items-center gap-2">
        ✅ You get 24/7 roadside assistance
      </li>
      <li className="flex items-center gap-2">
        ✅ We fix 4 out of 5 cars at the roadside
      </li>
    </ul>
    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700">
      Get Started →
    </button>
  </div>
</div>

); };

export default CarSaleSection;