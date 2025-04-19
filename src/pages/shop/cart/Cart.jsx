import React, { useEffect, useState } from 'react';
import getUserFromToken from '../../common/GetUserFromToken';
import Cookies from "js-cookie";
import { FiTrash2 } from 'react-icons/fi';

const Cart = ({ onTotalChange }) => {
  const [cartItems, setCartItems] = useState([]);
const [cartId, setCartId] = useState(null); // ✅ cartId state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");

  
  useEffect(() => {
    fetchCart();
  }, [userId, accessToken, onTotalChange]);

  const fetchCart = async () => {
    if (!userId || !accessToken) return;
  
    try {
      const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
  
      const data = await response.json();
  
      const items = data.cartLines || [];
      setCartItems(items);
      setCartId(data.cartId); // ✅ Doğru yerde artık
  
      const total = items.reduce((acc, item) => {
        const price = item.product.discountPrice || item.product.unitPrice;
        return acc + price * item.quantity;
      }, 0);
  
      onTotalChange?.(total);
    } catch (error) {
      console.error("Sepet verisi alınamadı:", error);
    }
  };



  const handleClearCart = async () => {
    if (!cartId) {
      console.warn("❗ cartId mevcut değil.");
      return;
    }
  
    try {
      const response = await fetch(`https://localhost:7282/api/Cart/ClearCartLines`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cartId })
      });
  
      const result = await response.json();
      console.log("API RESPONSE:", result);
  
      if (response.ok && result.isSuccess) {
        console.log("✅ Ürünler silindi. Güncelleme yapılıyor...");
        await fetchCart(); // 🔁 veriyi tekrar çek
      } else {
        console.warn("❌ API çalıştı ama başarılı dönmedi:", result.errors);
      }
    } catch (error) {
      console.error("❌ Silme isteği başarısız:", error);
    }
  };
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg ml-0 w-full max-w-full">
      {currentItems.length > 0 ? (
        currentItems.map((item) => {
          const price = item.product.discountPrice || item.product.unitPrice;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-4 px-4 mb-4 bg-gray-50 rounded-lg border border-gray-200 shadow transition-all duration-300 hover:shadow-md hover:border-gray-400"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imagePath || "/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-200 shadow-md"
                />
                <div>
                  <h3 className="text-md font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.description || '—'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-md font-medium text-gray-700">x{item.quantity}</span>
                <span className="text-md font-semibold text-gray-800">
                  ${price.toFixed(2)}
                </span>
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 mt-10">Sepetiniz şu anda boş.</p>
      )}

      {cartItems.length > itemsPerPage && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>

          {/* ✅ HEPSİNİ SİL BUTONU */}
          <button
            onClick={handleClearCart}
            className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
          >
            Delete All
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;