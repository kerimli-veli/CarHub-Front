import { useEffect, useState } from "react";
import getUserFromToken from "../../common/GetUserFromToken";
import React from "react";
import Cookies from "js-cookie";

export default function Account() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = getUserFromToken();
        const token = Cookies.get("accessToken");
        setToken(token);

        const response = await fetch(
          `https://localhost:7282/api/User/GetById?Id=${userInfo.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
          setUpdatedUser(data.data);
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("https://localhost:7282/api/User/Update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          name: updatedUser.name,
          surname: updatedUser.surname,
          email: updatedUser.email,
          phone: updatedUser.phone,
        }),
      });

      if (response.ok) {
        alert("User updated successfully!");
        setUser(updatedUser);
        setEditMode(false);
      } else {
        alert("Update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdatedUser(user);
  };

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
          <h2 className="text-2xl text-green-700 font-semibold">
            {user.name} {user.surname}
          </h2>
          <p className="text-gray-500">{user.userRole === 0 ? "Admin" : "User"}</p>
          <p className="text-gray-500">Leeds, United Kingdom</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl text-green-700 font-semibold">Personal Information</h3>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transform hover:scale-105 transition-all"
            >
              Edit ✏️
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 text-gray-700">
          <InfoRow label="First Name" name="name" value={updatedUser.name} editable={editMode} onChange={handleChange} />
          <InfoRow label="Last Name" name="surname" value={updatedUser.surname} editable={editMode} onChange={handleChange} />
          <InfoRow label="Email Address" name="email" value={updatedUser.email} editable={editMode} onChange={handleChange} />
          <InfoRow label="Phone Number" name="phone" value={updatedUser.phone} editable={editMode} onChange={handleChange} />
          <InfoRow label="User Role" value={user.userRole === 0 ? "Admin" : "User"} />
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 shadow-md transition-all"
            >
              Update ✅
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 shadow-md transition-all"
            >
              Cancel ❌
            </button>
          </div>
        )}
      </div>

      {/* User Cards Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-xl text-green-700 font-semibold">User Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {user.userCards &&
            user.userCards.map((card, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-md"
              >
                <p className="text-lg font-semibold">{card.cardNumber}</p>
                <p className="text-sm">{card.cardHolder}</p>
                <p className="text-sm">Valid Thru: {card.expiryDate}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, name, value, editable, onChange }) => (
  <div>
    <label className="block text-gray-500 text-sm mb-1">{label}</label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
    ) : (
      <p className="font-medium">{value}</p>
    )}
  </div>
);
