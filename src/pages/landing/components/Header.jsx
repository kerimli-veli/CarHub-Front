import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ onAuctionClick, bgColor = "bg-[#050B20]" }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  

  // ESC veya backdrop tıklanınca drawer'ı kapat
  useEffect(() => {
    if (!isProfileDrawerOpen) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") setIsProfileDrawerOpen(false); };
    const handleClick = (e) => {
      if (e.target.id === "profile-drawer-backdrop") setIsProfileDrawerOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isProfileDrawerOpen]);

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
        const response = await fetch(
          `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/GetUserByEmail?Email=${email}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          }
        );
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
      const response = await fetch(
        `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Product/GetByNameProduct?name=${query}`
      );
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

  // NAVBAR LINK COMPONENT
  const NavbarLink = ({ href, children, onClick }) => (
    <a
      href={href}
      onClick={onClick}
      className="
        relative px-4 py-2 font-semibold text-lg
        text-zinc-400
        transition-all duration-300
        group
        [text-shadow:_0_1px_0_#222]
      "
      style={{
        letterSpacing: "0.08em",
      }}
    >
      <span
        className="
          transition-all duration-300
          group-hover:text-white
          group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]
        "
        style={{
          textShadow: "0 0 0 #fff",
        }}
      >
        {children}
      </span>
      <span
        className="
          absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5
          bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 rounded-full
          group-hover:w-full transition-all duration-500
          group-hover:shadow-[0_0_8px_#0ff]
        "
      ></span>
    </a>
  );

  return (
    <>
      <nav className={`${bgColor} backdrop-blur-md shadow-lg sticky top-0 z-50`}>
        <div className="container mx-auto flex items-center justify-between py-3">
          {/* SOLDA: CarHub */}
          <a
            href="#"
            className="text-3xl font-extrabold tracking-wider text-gray-300 hover:text-white transition-colors duration-300 drop-shadow-lg"
          >
            CarHub
          </a>
          {/* ORTADA: Navbar */}
          <div className="flex justify-center items-center space-x-8">
            <NavbarLink href="/">Home</NavbarLink>
            <div className="relative group" id="search-box">
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="
                  relative px-4 py-2 font-semibold text-lg text-zinc-400 transition-all duration-300 group
                  hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]
                "
                style={{ letterSpacing: "0.08em" }}
              >
                Product Search
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500 group-hover:shadow-[0_0_8px_#0ff]"></span>
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
              <button className="
                relative px-4 py-2 font-semibold text-lg text-zinc-400 transition-all duration-300 group
                hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]
              ">
                Pages
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500 group-hover:shadow-[0_0_8px_#0ff]"></span>
              </button>
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
              className="
                relative px-4 py-2 font-semibold text-lg text-zinc-400 transition-all duration-300 group
                hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]
              "
            >
              About
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 rounded-full group-hover:w-full transition-all duration-500 group-hover:shadow-[0_0_8px_#0ff]"></span>
            </button>
            <NavbarLink href="#">Contact</NavbarLink>
          </div>
          {/* SAĞDA: Profil */}
          {user ? (
  <div className="ml-4">
    {user.userImagePath ? (
      <img
        src={
          user.userImagePath
            ? `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${user.userImagePath}`
            : "https://via.placeholder.com/150"
        }
        alt="User"
        className="w-12 h-12 rounded-full shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-110 hover:shadow-2xl"
        onClick={() => setIsProfileDrawerOpen(true)}
      />
    ) : (
      <div
        className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
        onClick={() => setIsProfileDrawerOpen(true)}
      >
        {user.name ? user.name.charAt(0) : "U"}
      </div>
    )}
  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="ml-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
  >
    Login
  </button>
)}
        </div>
      </nav>

      {/* PROFİL DRAWER */}
      {isProfileDrawerOpen && (
  <>
    <div
      className="fixed top-8 right-8 z-[100] w-[290px] max-w-[90vw] bg-gradient-to-br from-zinc-900 via-zinc-800 to-white/90 shadow-2xl border border-zinc-300/30 flex flex-col items-center px-6 py-6"
      style={{
        borderRadius: "1.5rem",
        animation: "slideInDrawerSmall 0.33s cubic-bezier(.4,2,.6,1) both",
        boxShadow: "0 8px 36px 0 rgba(0,0,0,0.28)",
        minHeight: "290px"
      }}
    >
      <button
        onClick={() => setIsProfileDrawerOpen(false)}
        className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 text-2xl"
        aria-label="close"
        style={{ background: "rgba(255,255,255,0.06)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}
      >
        &times;
      </button>
      <div className="flex flex-col items-center mt-2">
        <img
          src={
            user.userImagePath
              ? `https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/${user.userImagePath}`
              : "https://via.placeholder.com/150"
          }
          alt="User"
          className="w-16 h-16 rounded-full shadow-lg border-2 border-zinc-300 object-cover"
        />
        <h2 className="text-lg font-bold text-white mt-3 mb-1">
          {user.name} {user.surname}
        </h2>
        <p className="text-zinc-300 text-sm mb-2">{user.email}</p>
        <span className="text-xs text-white bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-600 px-3 py-1 rounded-full mb-4 shadow">
          {user.userRole}
        </span>
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={() => { setIsProfileDrawerOpen(false); window.location.href = "/userProfile/account"; }}
            className="flex items-center px-4 py-2 w-full text-zinc-900 font-semibold bg-zinc-100 hover:bg-zinc-200 rounded-lg transition shadow"
          >
            <svg className="w-5 h-5 mr-2 text-zinc-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v2a6 6 0 006 6 6 6 0 006-6V8a6 6 0 00-6-6zm-4 6a4 4 0 118 0v2a4 4 0 11-8 0V8zm10 6a8 8 0 11-16 0v-2a8 8 0 0116 0v2z" /></svg>
            Hesap Ayarları
          </button>
          <button
            onClick={() => { setIsProfileDrawerOpen(false); window.location.href = "/userProfile/favorites"; }}
            className="flex items-center px-4 py-2 w-full text-zinc-100 font-semibold bg-zinc-800 hover:bg-zinc-700 rounded-lg transition shadow"
          >
            <svg className="w-5 h-5 mr-2 text-zinc-200" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            Favorilerim
          </button>
        </div>
      </div>
    </div>
    {/* Modal dışında tıklayınca kapansın */}
    <div
      id="profile-drawer-backdrop"
      className="fixed inset-0 z-[99]"
      style={{ background: "transparent" }}
    />
    {/* Drawer animasyonu için style */}
    <style>{`
      @keyframes slideInDrawerSmall {
        from { transform: translateX(60px) scale(0.95); opacity: 0;}
        to { transform: translateX(0) scale(1); opacity: 1;}
      }
    `}</style>
  </>
)}
    </>
  );
};

export default Header;
