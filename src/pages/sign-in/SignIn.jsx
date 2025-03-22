import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import { FaSignInAlt } from "react-icons/fa";
import React from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("signIn");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://localhost:7282/api/User/Login", 
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log(response.data); 
      if (response.data.isSuccess) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        toast.success("Login successful!");
        setSuccess(true);
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      console.error("Error response:", error.response); 
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 w-[470px] rounded-xl shadow-lg">
          <div className="relative flex gap-10 pb-2 border-b border-gray-300">
            {['signIn', 'register'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-gray-500 font-medium pb-2 relative transition-all duration-300 ease-in-out ${activeTab === tab ? 'text-gray-800' : 'text-gray-400'}`}
              >
                {tab === 'signIn' ? 'Sign in' : 'Register'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {success ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center rounded-lg">
              Welcome to Premium Access!
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="mt-10 grid gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mt-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Keep me signed in</span>
                </label>
                <a href="#" className="text-sm text-indigo-600">Lost Your Password?</a>
              </div>

              <motion.button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignInAlt />
                {loading ? "Loading..." : "Login"}
              </motion.button>

              <div className="mt-6 text-center text-gray-500">OR</div>

              <div className="flex gap-4 mt-4">
                <motion.button 
                  className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg text-blue-600 hover:text-blue-800 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src="https://i.postimg.cc/wxJjyrrZ/Icon-Facebook.png" alt="Facebook Icon" />
                  Login with Facebook
                </motion.button>
                <motion.button 
                  className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg text-red-600 hover:text-red-800 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src="https://i.postimg.cc/fb4HLJS6/Icon-Google.png" alt="Google Icon" />
                  Login with Google
                </motion.button>
              </div>

              <div className="mt-6 p-4 bg-gray-100 text-center rounded-lg">
                <p>Username: <b>demo</b></p>
                <p>Password: <b>demo</b></p>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
