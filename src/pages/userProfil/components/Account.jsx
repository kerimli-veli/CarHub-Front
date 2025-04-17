import { useEffect, useState } from "react";
import getUserFromToken from "../../common/GetUserFromToken";
import React from "react";
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";

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
              Authorization: `Bearer ${userInfo.token}`,
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
          Authorization: `Bearer ${token}`,
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

  if (loading)
    return <p className="text-center text-xl font-semibold">Loading...</p>;
  if (!user)
    return (
      <p className="text-center text-xl text-red-500">
        Error loading user data
      </p>
    );

    return (
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>
    
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <img
              src={user.userImagePath || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{user.name} {user.surname}</h2>
              <p className="text-sm text-gray-500">{user.userRole}</p>
              <p className="text-sm text-gray-400">Azerbaijan, Barda</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 sm:mt-0 flex items-center gap-1 text-blue-600 hover:underline"
          >
            <FaEdit className="w-4 h-4" />
            Edit
          </button>
        </div>
    
        
        <div className="bg-white shadow-md rounded-2xl p-6 relative">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h2>
    
          <button
            onClick={() => setEditMode(!editMode)}
            className="absolute top-6 right-6 flex items-center gap-1 text-blue-600 "
          >
            <FaEdit className="w-4 h-4" />
            Edit
          </button>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoRow label="First Name" name="name" value={updatedUser.name} editable={editMode} onChange={handleChange} />
            <InfoRow label="Last Name" name="surname" value={updatedUser.surname} editable={editMode} onChange={handleChange} />
            <InfoRow label="Email address" name="email" value={updatedUser.email} editable={editMode} onChange={handleChange} />
            <InfoRow label="Phone" name="phone" value={updatedUser.phone} editable={editMode} onChange={handleChange} />
          </div>
    
          {editMode && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
    
}

const InfoRow = ({ label, name, value, editable, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <p className="text-base font-medium text-gray-800">{value}</p>
    )}
  </div>
);
