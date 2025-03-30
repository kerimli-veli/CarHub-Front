import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";
import { FaSignInAlt } from "react-icons/fa";
import { setCookie } from "cookies-next"; // cookies-next kullanarak cookie işlemleri
import React from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname === "/signUp" ? "signUp" : "signIn";

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
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.isSuccess) {
        // Cookie'lere accessToken, refreshToken ve email kaydediyoruz
        setCookie("accessToken", response.data.data.accessToken, { maxAge: 60 * 60 * 24 }); // 1 gün geçerlilik
        setCookie("refreshToken", response.data.data.refreshToken, { maxAge: 60 * 60 * 24 }); // 1 gün geçerlilik
        setCookie("email", formData.email, { maxAge: 60 * 60 * 24 }); // 1 gün geçerlilik
  
        toast.success("Login successful!");
        setSuccess(true);
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      toast.error("Invalid email or password!", {
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 w-[470px] rounded-xl shadow-lg">
          <div className="relative flex gap-10 pb-2 border-b border-gray-300">
            <Link to="/signIn">
              <button className={`text-gray-500 font-medium pb-2 relative transition-all duration-300 ease-in-out ${activeTab === "signIn" ? "text-gray-800" : "text-gray-400"}`}>
                Sign In
                {activeTab === "signIn" && <motion.div className="absolute bottom-0 left-0 w-full border-b-2 border-blue-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.3 }} />}
              </button>
            </Link>

            <Link to="/signUp">
              <button className={`text-gray-500 font-medium pb-2 relative transition-all duration-300 ease-in-out ${activeTab === "signUp" ? "text-gray-800" : "text-gray-400"}`}>
                Sign Up
                {activeTab === "signUp" && <motion.div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.3 }} />}
              </button>
            </Link>
          </div>

          {success ? (
            <div className="text-center">Loading...</div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="mt-10 grid gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mt-4 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300" />

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Keep me signed in</span>
                </label>
                <a href="#" className="text-sm text-indigo-600">Lost Your Password?</a>
              </div>

              <motion.button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <FaSignInAlt />
                {loading ? "Loading..." : "Login"}
              </motion.button>

              <div className="mt-6 text-center text-gray-500">OR</div>

              <div className="flex gap-4 mt-4">
                <motion.button className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg text-blue-600 hover:text-blue-800 transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <img src="https://i.postimg.cc/wxJjyrrZ/Icon-Facebook.png" alt="Facebook Icon" />
                  Login with Facebook
                </motion.button>
                <motion.button className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg text-red-600 hover:text-red-800 transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <img src="https://i.postimg.cc/fb4HLJS6/Icon-Google.png" alt="Google Icon" />
                  Login with Google
                </motion.button>
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
