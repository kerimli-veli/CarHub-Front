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

  if (loading) return <p className="text-center text-xl font-semibold">Loading...</p>;
  if (!user) return <p className="text-center text-xl text-red-500">Error loading user data</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Profile</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex flex-col items-center">
          <img
            src={user.userImagePath || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
          />
          <button className="mt-4 px-4 py-2 text-sm font-medium border rounded-lg border-gray-300 hover:bg-gray-100 transition">
            Upload new photo
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px]">
            At least 800×800 px recommended. JPG or PNG is allowed.
          </p>
        </div>

        <div className="w-full">
          <div className="bg-gray-50 rounded-xl p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Info</h2>

            <button
              onClick={() => setEditMode(!editMode)}
              className="absolute top-6 right-6 text-gray-600 hover:text-gray-800"
            >
              <FaEdit className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
              <InfoRow label="Full Name" name="name" value={`${updatedUser.name || ""} ${updatedUser.surname || ""}`} editable={editMode} onChange={handleChange} split />
              <InfoRow label="Email" name="email" value={updatedUser.email} editable={editMode} onChange={handleChange} />
              <InfoRow label="Phone" name="phone" value={updatedUser.phone} editable={editMode} onChange={handleChange} />
              <InfoRow label="User Role" value={user.userRole === 0 ? "Admin" : "User"} />
            </div>

            {editMode && (
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow"
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
      </div>
    </div>
  );
}

const InfoRow = ({ label, name, value, editable, onChange, split }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-500 mb-1">{label}</label>
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