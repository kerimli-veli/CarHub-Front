import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5">
      <div className="flex flex-wrap justify-between">
        {/* Join BoxCar Section */}
        <div className="flex-1 min-w-[250px] mb-6">
          <h3 className="mb-2 text-lg font-semibold">Join BoxCar</h3>
          <p className="mb-4">Receive pricing updates, shopping tips & more!</p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="p-3 rounded border border-gray-300 text-black"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap gap-12 flex-grow">
          {/* Company Links */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="mb-2 text-lg font-semibold">Company</h4>
            <ul className="list-none pl-0">
              {['About Us', 'Blog', 'Services', 'FAQs', 'Terms', 'Contact Us'].map((item) => (
                <li key={item} className="mb-2">
                  <a href="#" className="text-white hover:underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="mb-2 text-lg font-semibold">Quick Links</h4>
            <ul className="list-none pl-0">
              {['Get in Touch', 'Help Center', 'Live Chat', 'How it Works'].map((item) => (
                <li key={item} className="mb-2">
                  <a href="#" className="text-white hover:underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Brands */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="mb-2 text-lg font-semibold">Our Brands</h4>
            <ul className="list-none pl-0">
              {['Toyota', 'Porsche', 'Audi', 'BMW', 'Ford', 'Nissan', 'Peugeot', 'Volkswagen'].map((brand) => (
                <li key={brand} className="mb-2">
                  <a href="#" className="text-white hover:underline">
                    {brand}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Types */}
          <div className="flex-1 min-w-[150px]">
            <h4 className="mb-2 text-lg font-semibold">Vehicle Types</h4>
            <ul className="list-none pl-0">
              {['Sedan', 'Hatchback', 'SUV', 'Hybrid', 'Electric', 'Coupe', 'Truck', 'Convertible'].map((type) => (
                <li key={type} className="mb-2">
                  <a href="#" className="text-white hover:underline">
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* our mobile app */}
        <div>
            <div className="grid gap-2">
                <h4 className="mb-2 text-lg font-semibold">Our Mobile App</h4>

                 <div className="w-[198px] h-[60px] bg-[#FFFFFF12]  rounded-[10px] flex justify-center items-center flex-col ">
                    
                    
                    <div>
                        <p className="text-sm" >Download on the</p>
                    </div>

                    <div>
                        <p className="pr-[15px]" >Apple Store</p>
                    </div>
                    
                 </div>

                 <div className="w-[198px] h-[60px] bg-[#FFFFFF12]  rounded-[10px] flex justify-center items-center flex-col ">
                    <div>
                        <p className="text-sm" >Get in on</p>
                    </div>

                    <div>
                        <p className="pr-[15px]" >Google Play</p>
                    </div>
                </div>
             </div>

        {/* logolar */}
        <div className="flex-basis-[200px] mb-6">
          <h4 className="mb-2 text-lg font-semibold">Connect With Us</h4>
          <div className="flex gap-3">
            {[
              { url: "https://facebook.com", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
              { url: "https://twitter.com", iconUrl: "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg" },
              { url: "https://instagram.com", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" },
              { url: "https://linkedin.com", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Linkedin_icon.svg" }
            ].map((social, index) => (
              <a href={social.url} key={index} target="_blank" rel="noopener noreferrer">
                <img src={social.iconUrl} alt={`Social media ${index + 1}`} className="w-7" />
              </a>
            ))}
          </div>
        </div>
        </div>
       
      </div>

      {/* en asagi */}
      <div className="flex justify-between border-t border-gray-700 mt-6 pt-3 pl-[150px] pr-[150px] text-sm">
        <div>© 2024 Boxcars.com. All rights reserved.</div>
        <div>
          <a href="#" className="text-white hover:underline mr-4">Terms & Conditions</a>
          <a href="#" className="text-white hover:underline">Privacy Notice</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
