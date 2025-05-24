import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import getUserFromToken from '../../common/GetUserFromToken';

const BASE_URL = 'https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/User';


const Tag = ({ label, color }) => {
  const colorMap = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-full ${colorMap[color]}`}>
      {label}
    </span>
  );
};

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    userImage: null,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    userRole: '',
  });
  const [editingField, setEditingField] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/GetAll`);
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve users:', err);
    }
  };

  const handleAddUser = async () => {
    const form = new FormData();
    form.append('name', formData.name);
    form.append('surname', formData.surname);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('password', formData.password);
    if (formData.userImage) form.append('userImage', formData.userImage);

    try {
      await axios.post(`${BASE_URL}/Register`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowAddModal(false);
      setFormData({
        name: '', surname: '', email: '', phone: '', password: '', userImage: null,
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  const handleDelete = async (id) => {
  const token = getUserFromToken(); 

  try {
    await axios.delete(`${BASE_URL}/Remove?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchUsers();
  } catch (err) {
    console.error('Failed to delete user:', err);
  }
};


  const handleUserClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      userRole: user.userRole,
    });
    setShowDetailModal(true);
    setEditingField(null);
  };

  const updateAllFields = async () => {
  const formData = new FormData();
  formData.append("Id", selectedUser.id);
  formData.append("Name", editForm.name);
  formData.append("Surname", editForm.surname);
  formData.append("Email", editForm.email);
  formData.append("Phone", editForm.phone);
  formData.append("UserRole", editForm.userRole);

  // Şəkil dəyişib?
  if (editForm.userImage) {
    formData.append("UserImage", editForm.userImage);
  }

  const token = getUserFromToken();

  try {
    const response = await fetch(`${BASE_URL}/Update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // **Diqqət**: FormData üçün Content-Type **TƏYİN ETMƏ**
        // fetch özü multipart/form-data header əlavə edir
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update error:", errorText);
      throw new Error("Failed to update user");
    }

    alert("User updated successfully!");
    setShowDetailModal(false);
    setEditingField(null);
    fetchUsers();
  } catch (err) {
    console.error("Update error:", err);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 font-sans relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All users <span className="text-gray-500">{users.length}</span></h2>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1">Filters</button>
          <button
            className="bg-black text-white rounded px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            + Add user
          </button>
        </div>
      </div>

      <table className="w-full border-t text-left">
        <thead>
          <tr className="text-sm text-gray-500">
            <th className="px-4 py-2"><input type="checkbox" /></th>
            <th className="px-4 py-2">User name</th>
            <th className="px-4 py-2">Access</th>
            <th className="px-4 py-2">Last active</th>
            <th className="px-4 py-2">Date added</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3"><input type="checkbox" /></td>
              <td
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={`https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/${user.userImagePath}`}
                  alt={`${user.name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800">{user.name} {user.surname}</div>
                  <div className="text-gray-500 text-sm">{user.email}</div>
                </div>
              </td>
              <td className="px-4 py-3 space-x-1">
                {user.userRole === 'Admin' && <Tag label="Admin" color="green" />}
                <Tag label="User" color="blue" />
              </td>
              <td className="px-4 py-3 text-gray-600">{user.createdDate}</td>
              <td className="px-4 py-3 relative">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() =>
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === user.id ? { ...u, showMenu: !u.showMenu } : { ...u, showMenu: false }
                        )
                      )
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {user.showMenu && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-10">
                      <button
                        onClick={() => {
                          handleUserClick(user);
                          setUsers((prev) => prev.map((u) => ({ ...u, showMenu: false })));
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD USER MODAL (qorunur) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setShowAddModal(false)}
              >✕</button>
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>

              <div className="space-y-3">
                <input type="text" placeholder="Name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
                <input type="text" placeholder="Surname" value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
                <input type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
                <input type="text" placeholder="Phone" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
                <input type="password" placeholder="Password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
                <input type="file" accept="image/*"
                  onChange={(e) => setFormData({ ...formData, userImage: e.target.files[0] })}
                  className="w-full border rounded px-3 py-2" />
              </div>

              <button
                onClick={handleAddUser}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save User
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USER DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl relative flex gap-10 items-start"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
                onClick={() => {
                  setShowDetailModal(false);
                  setEditingField(null);
                }}
              >✕</button>

              <div className="w-1/3 flex flex-col items-center text-center bg-gray-50 rounded-xl p-5 shadow-inner">
                <img
                  src={`https://localhost:7282/${selectedUser.userImagePath}`}
                  alt="User Avatar"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{editForm.name} {editForm.surname}</h3>
                <p className="text-gray-500 text-sm">{editForm.email}</p>
              </div>

              <div className="w-2/3 space-y-5 pt-6">
                {['name', 'surname', 'email', 'phone'].map((field) => (
                  <div key={field} className="flex items-center gap-4">
                    <label className="w-24 font-medium text-gray-600 capitalize">{field}:</label>
                    <input
                      type="text"
                      value={editForm[field]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [field]: e.target.value })
                      }
                      className="border-b w-full border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 text-gray-800"
                    />
                  </div>
                ))}

                <div className="flex items-center gap-4">
                  <label className="w-24 font-medium text-gray-600 capitalize">Role:</label>
                  <select
                    value={editForm.userRole}
                    onChange={(e) =>
                      setEditForm({ ...editForm, userRole: e.target.value })
                    }
                    className="border rounded px-3 py-1 text-gray-800"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <button
                  onClick={() => updateAllFields()}
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserController;
