import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import React from "react";

const TopBar = () => {
  const [userImagePath, setUserImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = Cookies.get("email"); 
        if (!email) return;
  
        const token = Cookies.get("accessToken");
  
        if (!token) {
          console.error("Token is missing");
          return; 
        }
  
        const response = await fetch(`https://carhubnewappapp-a2bxhke3hwe6gvg0.italynorth-01.azurewebsites.net/api/User/GetUserByEmail?Email=${email}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
  
        const data = await response.json();
  
        if (data && data.data.userImagePath) {
          setUserImage(data.data.userImagePath);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  return (
    <div className="flex items-center justify-between p-4">
      
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      
      <div className="flex items-center space-x-4">
        {userImagePath ? (
          <img src={userImagePath} alt="User Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default TopBar;