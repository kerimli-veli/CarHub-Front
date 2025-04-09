import React from 'react';
import { useNavigate } from "react-router-dom";

const Footer = () => {

  const navigate = useNavigate()
  return (
    <footer className="bg-[#050B20] text-white py-10 px-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-start ">
        
        <div className="flex justify-between items-center mb-6 space-x-110 ">
          <div>
            <h3 className="text-lg font-semibold">Join CarHub</h3>
            <p className="text-sm text-gray-400">Receive pricing updates, shopping tips & more!</p>
          </div>
          <div className="flex items-center h-[61px] w-[542px] bg-[#1C1F2E] rounded-full px-4 py-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent outline-none text-white placeholder-gray-400 px-2"
            />
            <button onClick={() =>{ navigate('SignUp')}} className="bg-blue-600 text-white w-[115px] h-[51px] ml-[200px] rounded-full hover:bg-blue-700 transition">
              Sign Up
            </button>
          </div>
           
        </div>

        
        <div className="flex flex-wrap flex-grow justify-between gap-8 border-t border-gray-700 mt-6 pt-12 ">
          <div className="flex flex-wrap flex-grow justify-between gap-8  ">

            {[
              { title: "Company", links: ["About Us", "Blog", "Services", "FAQs", "Terms", "Contact Us"] },
              { title: "Quick Links", links: ["Get in Touch", "Help Center", "Live Chat", "How it Works"] },
              { title: "Our Brands", links: ["Toyota", "Porsche", "Audi", "BMW", "Ford", "Nissan", "Peugeot", "Volkswagen"] },
              { title: "Vehicles Type", links: ["Sedan", "Hatchback", "SUV", "Hybrid", "Electric", "Coupe", "Truck", "Convertible"] },
            ].map((section, index) => (
              <div key={index} className="min-w-[150px]">
                <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-8">Our Mobile App</h4>
              <div className="space-y-3">
                <a href="#" className="block w-[198px] bg-gray-800 text-white py-2 px-5 rounded-[17px] flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/apple.svg" alt="Apple" className="w-6  " />
                  <span>Download on the Apple Store</span>
                </a>
                <a href="#" className="block w-[198px] bg-gray-800 text-white py-2 px-5 rounded-[17px] flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/googleplay.svg" alt="Google Play" className="w-6" />
                  <span>Get it on <br /> Google Play</span>

                </a>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
              <div className="flex space-x-4">
                {[
                  { url: "https://facebook.com", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" },
                  { url: "https://twitter.com", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/twitter.svg" },
                  { url: "https://instagram.com", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/instagram.svg" },
                  { url: "https://linkedin.com", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/linkedin.svg" },
                ].map((social, index) => (
                  <a href={social.url} key={index} target="_blank" rel="noopener noreferrer">
                    <img src={social.iconUrl} alt={`Social ${index + 1}`} className="w-6 opacity-75 hover:opacity-100 transition" />
                  </a>
                ))}
              </div>
            </div>

          </div>
          
          
        </div>

        
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-sm flex flex-col sm:flex-row justify-between text-gray-400 px-4 ">
        <div className="pl-[161px]" >© 2024 Boxcars.com. All rights reserved.</div>
        <div className="flex space-x-4 pr-[167px]">
          <a href="#" className="hover:text-white transition">Terms & Conditions</a>
          <a href="#" className="hover:text-white transition">Privacy Notice</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
