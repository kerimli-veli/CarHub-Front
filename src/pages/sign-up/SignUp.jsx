import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import { FaUserPlus } from "react-icons/fa";
import React from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: ""
  });
  const [userImage, setUserImage] = useState(null);
  
  

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUserImage(e.target.files[0]);
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("surname", formData.surname);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (userImage) {
      data.append("userImage", userImage); 
    }
  
    try {
      const response = await axios.post(
        "https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/User/Register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
  
      if (response.status === 200 && response.data) {
        toast.success(response.data.message || "Registration successful!");
        setSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
  
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.Errors?.[0] || "An unknown error occurred!"
      );
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 w-[470px] rounded-xl shadow-lg">
          <div className="relative flex gap-10 pb-2 border-b border-gray-300 ">
            <button onClick={() => navigate("/signIn")} className="text-gray-500 font-medium pb-2 relative transition-all duration-300 ease-in-out">
              Sign In
            </button>
            <button className="text-gray-800 font-medium pb-2 relative transition-all duration-300 ease-in-out border-b-2 border-blue-600">
              Sign Up
            </button>
          </div>

          {success ? (
            <div className="text-center">...</div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="mt-6 grid gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              
              <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
                className="w-full p-3 mt-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              
              <input
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
/>


              
              <motion.button type="submit" disabled={loading}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <FaUserPlus />
                {loading ? "Registering..." : "Sign Up"}
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;