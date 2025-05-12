import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ onAuctionClick, bgColor = "bg-[#050B20]" }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAuctionClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("accessToken");
      const email = Cookies.get("email");

      if (!token || !email) {
        setUser(null);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/GetUserByEmail?Email=${email}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.data);
        } else {
          console.error("User data didn't get it:", response.status);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);




  const handleProductSearch = async (query) => {
    try {
      const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Product/GetByNameProduct?name=${query}`);
      const result = await response.json();

      if (Array.isArray(result)) {
        setSearchResults(result);
      } else if (result.data && Array.isArray(result.data)) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setSearchResults([]);
    }
  };



  useEffect(() => {
    if (!showSearchInput) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [showSearchInput]);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (!e.target.closest("#search-box")) {
        setShowSearchInput(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);



  const handleBasketClick = () => {
    navigate("/cart");
  };

  const handleNavigate = () => {
    navigate('/aboutus');
  };

  return (
    <nav className={`${bgColor} text-white p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-xl font-bold sm:text-2xl md:text-4xl">
          CarHub
        </a>



        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>


        <div className={`md:flex md:space-x-6 items-center ${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
          <a href="/" className="text-lg font-medium text-white hover:text-blue-300 relative group">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500"></span>
          </a>




          <div className="relative group" id="search-box">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="text-lg font-medium text-white hover:text-blue-300 transition duration-300 ease-in-out"
            >
              Product Search
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500"></span>
            </button>

            {showSearchInput && (
              <div
                className="absolute top-full mt-3 right-0 w-[420px] z-50 bg-white p-4 rounded-lg shadow-lg max-h-[500px] overflow-y-auto scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Product search..."
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      if (value.trim() !== "") {
                        handleProductSearch(value);
                      } else {
                        setSearchResults([]);
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black"
                  />
                  <button
                    onClick={() => handleProductSearch(searchQuery)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {searchQuery.trim() !== "" ? (
                  searchResults.length > 0 &&
                    searchResults.some(
                      (product) => product.name && product.unitPrice !== undefined && product.unitPrice !== null
                    ) ? (
                    <div className="space-y-3">
                      {searchResults
                        .filter(
                          (product) =>
                            product.name &&
                            product.unitPrice !== undefined &&
                            product.unitPrice !== null
                        )
                        .map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  Array.isArray(product.imagePath)
                                    ? product.imagePath[0]
                                    : (() => {
                                      try {
                                        const parsed = JSON.parse(product.imagePath);
                                        return Array.isArray(parsed) ? parsed[0] : "/placeholder.jpg";
                                      } catch {
                                        return "/placeholder.jpg";
                                      }
                                    })()
                                }
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded bg-gray-200 shadow-sm"
                              />
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {product.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  ${product.unitPrice?.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                navigate(`/product-details/${product.id}`, {
                                  state: product,
                                })
                              }
                              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                              Details
                            </button>
                          </div>
                        ))}

                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No products found.</div>
                  )
                ) : null}
              </div>
            )}
          </div>


          <div className="relative group">
            <button className="text-lg font-medium text-white hover:text-blue-300 transition duration-300 ease-in-out">
              Pages
            </button>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500"></span>

            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-white text-black rounded-xl shadow-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 origin-top z-50">
              <a href="/shopPage" className="block px-4 py-3 hover:bg-blue-50 rounded-t-xl">Shop</a>

              <a href="#" onClick={(e) => {
                e.preventDefault();
                onAuctionClick();
              }} className="block px-4 py-3 hover:bg-blue-50 rounded-t-xl">Auction</a>

              <button
                onClick={handleBasketClick}
                className="block px-4 py-3 hover:bg-blue-50 rounded-t-xl">Basket
              </button>

            </div>
          </div>

          <button
            onClick={handleNavigate}
            className="text-lg font-medium text-white hover:text-blue-300 relative group"
          >
            About
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500"></span>
          </button>

          <a href="#" className="text-lg font-medium text-white hover:text-blue-300 relative group">
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500"></span>
          </a>

          {user ? (
            <div className="relative group z-20">
              {user.userImagePath ? (
                <img
                  src={
                    user.userImagePath
                      ? `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${user.userImagePath}`
                      : "https://via.placeholder.com/150"}
                  alt="User"
                  className="w-15 h-15 rounded-full shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-110 hover:shadow-2xl"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
              )}

              <div className="absolute top-14 right-0 w-64 bg-white shadow-lg rounded-xl p-4 opacity-0 transform scale-95 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center space-x-3 border-b pb-3 mb-3">
                  <img
                    src={
                      user.userImagePath
                        ? `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${user.userImagePath}`
                        : "https://via.placeholder.com/150"}
                    alt="User"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-semibold text-gray-800">{user.name} {user.surname}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <span className="text-xs text-white w-15 bg-green-400 px-2 py-1 rounded-full">{user.userRole}</span>

                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = "/userProfile/account")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" /></svg>
                  <i className="fas fa-user-cog mr-3"></i> Account settings
                </button>



                <button
                  onClick={() => (window.location.href = "/userProfile/favorites")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" /></svg>
                  <i className="fas fa-user-cog mr-3"></i> Favorites
                </button>

                <button
                  onClick={() => (window.location.href = "/userProfile/myCars")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
                  <i className="fas fa-user-cog mr-3"></i> My Cars
                </button>

                <button
                  onClick={() => {

                    Cookies.remove("accessToken");
                    Cookies.remove("refreshToken");


                    navigate("/");

                    setUser(null);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="#e7000b" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                  </svg>
                  <i className="fas fa-sign-out-alt mr-3"></i> Log out
                </button>

              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/signIn')}
              className="flex items-center text-white border-2 hover:text-black border-gray-300 rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
            >
              <span className="mr-2 text-lg font-semibold">Sign in</span>
              <svg
                className="w-6 h-6 transition-transform duration-300 transform group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0h-4m4 0h4"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;