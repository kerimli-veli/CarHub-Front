import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

const ITEMS_PER_PAGE = 4;

const UserBaskets = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchSurname, setSearchSurname] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!token) return;
    fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/User/GetAll", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const fetchCart = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Cart/GetCartWithLinesByUserId?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCartItems(data.cartLines || []);
      setCartId(data.cartId);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    fetchCart(userId);
  };

  const handleSearch = () => {
    const user = users.find(
      (u) =>
        u.name.toLowerCase() === searchName.toLowerCase().trim() &&
        u.surname.toLowerCase() === searchSurname.toLowerCase().trim()
    );
    if (user) {
      setSelectedUserId(user.id);
      fetchCart(user.id);
    } else {
      toast.warn("User not found");
    }
  };

  const handleQuantityChange = async (item, change) => {
    try {
      const res = await fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Cart/UpdateProductQuantityInCart", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId, productId: item.product.id, quantityChange: change }),
      });
      if (res.ok) {
        const updated = cartItems.map((ci) => ci.id === item.id ? { ...ci, quantity: ci.quantity + change } : ci).filter((ci) => ci.quantity > 0);
        setCartItems(updated);
        toast.success("Quantity updated");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const res = await fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Cart/RemoveProductFromCart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId, productId: item.product.id }),
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((ci) => ci.id !== item.id));
        toast.success("Item removed");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("https://carhubwebappp-c3f2fwgtfaf4bygr.italynorth-01.azurewebsites.net/api/Cart/ClearCartLines", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId }),
      });
      if (res.ok) {
        setCartItems([]);
        toast.success("Cart cleared");
      } else {
        toast.error("Failed to clear cart");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);
  const currentItems = cartItems.slice( (currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🛒 User Baskets</h2>
      <select
        onChange={handleUserSelect} value={selectedUserId} className="p-3 border border-gray-300 rounded-lg w-full mb-4">
        <option value="">Select a user</option>
        {users.map((user) => ( <option key={user.id} value={user.id}> {user.name} {user.surname} - {user.email}
          </option> ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="First name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="p-3 border border-gray-300 rounded-lg"/>
        <input type="text" placeholder="Last name" value={searchSurname} onChange={(e) => setSearchSurname(e.target.value)} className="p-3 border border-gray-300 rounded-lg"/>
      </div>
      <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-6">
        Search User
      </button>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      ) : currentItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence>
              {currentItems.map((item) => {
                const price = item.product.discountPrice || item.product.unitPrice;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}className="flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          Array.isArray(item.product.imagePath) ? item.product.imagePath[0] : (() => { try { const parsed = JSON.parse(item.product.imagePath);
                                return Array.isArray(parsed) ? parsed[0] : "/placeholder.jpg"; } catch {return "/placeholder.jpg";}})() } alt={item.product.name} className="w-16 h-16 object-cover rounded-lg"/>
                      <div>
                        <h4 className="font-semibold text-lg">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQuantityChange(item, -1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
                      <span>{item.quantity}x</span>
                      <button onClick={() => handleQuantityChange(item, 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                      <span className="font-bold text-blue-700">${(price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => handleRemoveItem(item)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200" }`}>
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={() => setShowConfirm(true)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Clear Cart
            </button>
          </div>

          <AnimatePresence>
            {showConfirm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <p>Are you sure you want to clear the cart completely?</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <button onClick={handleClearCart} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Yes
                    </button>
                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                      No
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default UserBaskets;
