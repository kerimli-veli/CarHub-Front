
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/GetAll`);
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve users:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Remove?id=${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
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
      await axios.put(`${BASE_URL}/Update`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModal(false);
      setFormData({
        name: '', surname: '', email: '', phone: '', password: '', userImage: null
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleColorMap = {
    Admin: 'green',
    'Data Export': 'blue',
    'Data Import': 'purple',
  };

  const [editingField, setEditingField] = useState(null);
const [editForm, setEditForm] = useState({
  name: '', surname: '', email: '', phone: ''
});

const updateField = async (field) => {
    const payload = {
      ...selectedUser,
      [field]: editForm[field],
    };
  
    try {
      await axios.put(`${BASE_URL}/Update`, payload);
      setShowDetailModal(false);
      setEditingField(null);
      fetchUsers();
    } catch (err) {
      console.error('Update error:', err);
    }
  };


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
                  src={`https://localhost:7282/${user.userImagePath}`}
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
                <Tag label="Data Export" color="blue" />
                <Tag label="Data Import" color="purple" />
              </td>
              <td className="px-4 py-3 text-gray-600">Mar 4, 2024</td>
              <td className="px-4 py-3 text-gray-600">July 4, 2022</td>
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(user.id)}>⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD USER MODAL */}
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
            style={{ right: '1.5rem' }}
            onClick={() => {
              setShowDetailModal(false);
              setEditingField(null);
            }}
          >✕</button>
      
          {/* LEFT: Avatar */}
          <div className="w-1/3 flex flex-col items-center text-center bg-gray-50 rounded-xl p-5 shadow-inner">
            <img
              src={`https://localhost:7282/${selectedUser.userImagePath}`}
              alt="User Avatar"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">{selectedUser.name} {selectedUser.surname}</h3>
            <p className="text-gray-500 text-sm">{selectedUser.email}</p>
          </div>
      
          {/* RIGHT: Fields */}
          <div className="w-2/3 space-y-5 pt-6">
            {['name', 'surname', 'email', 'phone'].map((field) => (
              <div key={field} className="flex items-center gap-4">
                <label className="w-24 font-medium text-gray-600 capitalize">{field}:</label>
                {editingField === field ? (
                  <input
                    type="text"
                    value={editForm[field]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [field]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateField(field);
                    }}
                    className="border-b w-full border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 text-gray-800"
                  />
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <span className="text-gray-800 text-base">{selectedUser[field]}</span>
                    <button
                      className="text-gray-400 hover:text-blue-600 transition-transform transform hover:scale-110 ml-2"
                      onClick={() => {
                        setEditingField(field);
                        setEditForm({ ...editForm, [field]: selectedUser[field] });
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-4">
              <label className="w-24 font-medium text-gray-600 capitalize">Role:</label>
              {editingField === 'userRole' ? (
                <select
                  value={editForm.userRole}
                  onChange={(e) =>
                    setEditForm({ ...editForm, userRole: e.target.value })
                  }
                  onBlur={() => updateField('userRole')}
                  className="border rounded px-3 py-1 text-gray-800"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded">{selectedUser.userRole}</span>
                  <button
                    className="text-gray-400 hover:text-blue-600 transition-transform transform hover:scale-110 ml-2"
                    onClick={() => {
                      setEditingField('userRole');
                      setEditForm({ ...editForm, userRole: selectedUser.userRole });
                    }}
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
             
          </div>
        </motion.div>
      </motion.div>
      
      
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserController;
