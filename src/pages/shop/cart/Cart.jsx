import React, { useEffect, useState } from 'react';
import getUserFromToken from '../../common/GetUserFromToken';
import Cookies from "js-cookie";
import { FiTrash2 } from 'react-icons/fi';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Cart = ({ onTotalChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null); // ✅ cartId state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");
  const [showConfirm, setShowConfirm] = useState(false);

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

      if (response.ok) {
        console.log("✅ Silme başarılı! Sayfa şimdi yenileniyor...");
        setTimeout(() => {
          window.location.reload();
        }, 500);
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

  
  const handleRemoveItem = async (item) => {
    if (!cartId || !item?.product?.id) return;
  
    try {
      const response = await fetch("https://localhost:7282/api/Cart/RemoveProductFromCart", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartId: cartId,
          productId: item.product.id
        })
      });
  
      const result = await response.json();
      console.log("Tekil silme sonucu:", result);
  
      if (response.ok && result.message) {
        // ✅ UI'dan da anında kaldır
        const updatedItems = cartItems.filter((ci) => ci.id !== item.id);
        setCartItems(updatedItems);
  
        // ✅ Toplamı güncelle
        const newTotal = updatedItems.reduce((acc, i) => {
          const price = i.product.discountPrice || i.product.unitPrice;
          return acc + price * i.quantity;
        }, 0);
        onTotalChange?.(newTotal);
  
        toast.success("Ürün kaldırıldı ✔️");
  
        // ✅ Yine de sayfayı yenileyebiliriz
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Silme başarısız ❌");
        console.warn("❌ Ürün silinemedi:", result.message || result.errors);
      }
    } catch (error) {
      toast.error("Hata oluştu!");
      console.error("❌ Silme isteği başarısız:", error);
    }
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
                <button
  className="text-red-500 hover:text-red-700 transition-colors"
  onClick={() => handleRemoveItem(item)}
>
  <FiTrash2 size={18} />
</button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 mt-10">Your cart is currently empty. Start shopping!</p>
      )}

      {cartItems.length > 0 && (
        <div className="flex justify-between items-center mt-8 w-full flex-wrap">

          {/* 🧭 Ortada: Sayfa kontrol alanı */}
          {cartItems.length > itemsPerPage ? (
            <div className="w-full lg:w-auto mx-auto flex items-center gap-3 justify-center mb-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 text-lg font-bold bg-gray-200 text-gray-800 rounded-[13px] hover:bg-gray-300 disabled:opacity-50"
              >
                {"<"}
              </button>

              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-lg font-bold bg-gray-200 text-gray-800 rounded-[13px] hover:bg-gray-300 disabled:opacity-50"
              >
                {">"}
              </button>
            </div>
          ) : (
            <div className="w-full lg:w-auto"></div>
          )}

          {/* 🗑 Sağda: Delete All */}
          <div className="w-full lg:w-auto flex justify-end">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
            >
              Delete All
            </button>
          </div>
        </div>
      )}



      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Sepeti silmek istediğinize emin misiniz?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleClearCart();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Evet
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;