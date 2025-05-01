import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Header = ({ bgColor = "bg-[#050B20]" }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);

      try {
        const email = localStorage.getItem("email");
        if (email) {
          const response = await fetch(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetUserByEmail?Email=${email}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);  
            console.log("User Data:", userData);
          } else {
            console.error("User data didn't get it:", response.status);
          }
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className={`${bgColor} text-white p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-xl font-bold sm:text-2xl md:text-3xl">
          CarHub
        </a>

        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="hover:text-gray-400">Home</a>
          <div className="relative group">
            <button className="hover:text-gray-400">Listings ▼</button>
            <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg hidden group-hover:block">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 1</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 2</a>
            </div>
          </div>

          <a href="#" className="hover:text-gray-400">Pages</a>
          <a href="#" className="hover:text-gray-400">About</a>
          <a href="#" className="hover:text-gray-400">Contact</a>

          {user ? (
            <div className="relative group z-20">
              {user.userImagePath ? (
                <img
                  src={user.userImagePath}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-110 hover:shadow-2xl"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
              )}

              <div className="absolute top-14 right-0 w-64 bg-white shadow-lg rounded-xl p-4 opacity-0 transform scale-95 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center space-x-3 border-b pb-3 mb-3">
                  <img
                    src={user.userImagePath}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">{user.name} {user.surname}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                  <span className="text-xs text-white bg-green-400 px-2 py-1 rounded-full">{userRoles[user.userRole]}</span>
                </div>

                <button className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <i className="fas fa-user-cog mr-3"></i> Account settings
                </button>

                <button className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <i className="fas fa-user-cog mr-3"></i> Favorites
                </button>

                <button className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300">
                  <i className="fas fa-user-cog mr-3"></i> My Cars
                </button>

                <button className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300">
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

        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-400 hover:border-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="fill-current h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18m-9 6h9"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Header;
