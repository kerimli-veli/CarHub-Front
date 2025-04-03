import { useEffect, useState } from "react";
import getUserFromToken from "../../common/GetUserFromToken";
import React from "react";

export default function Account() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = getUserFromToken();
        const response = await fetch(
          `https://localhost:7282/api/User/GetById?Id=${userInfo.id}`
        );
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!user) return <p className="text-center text-lg text-red-500">Error loading user data</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.userImagePath}
          alt="User Avatar"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl text-green-700 font-semibold">{user.name} {user.surname}</h2>
          <p className="text-gray-500">{user.userRole === 0 ? "Admin" : "User"}</p>
          <p className="text-gray-500">Leeds, United Kingdom</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl text-green-700 font-semibold">Personal Information</h3>
          <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:shadow-lg transform hover:scale-105">
                Edit ✏️
        </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 text-gray-700">
          <InfoRow label="First Name" value={user.name} />
          <InfoRow label="Last Name" value={user.surname} />
          <InfoRow label="Date of Birth" value="12-10-1990" />
          <InfoRow label="Email Address" value={user.email} />
          <InfoRow label="Phone Number" value={user.phone} />
          <InfoRow label="User Role" value={user.userRole === 0 ? "Admin" : "User"} />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Address</h3>
            <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:shadow-lg transform hover:scale-105">
                Edit ✏️
            </button>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 text-gray-700">
          <InfoRow label="Country" value="United Kingdom" />
          <InfoRow label="City" value="Leeds, East London" />
          <InfoRow label="Postal Code" value="ERT 1254" />
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div>
    <label className="block text-gray-500 text-sm">{label}</label>
    <p className="font-medium">{value}</p>
  </div>
);
