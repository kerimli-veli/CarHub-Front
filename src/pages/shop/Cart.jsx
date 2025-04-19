import React, { useEffect, useState } from 'react';
import getUserFromToken from '../common/GetUserFromToken';
import Cookies from "js-cookie";
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import { FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !accessToken) {
        console.error("Kullanıcı ID veya token bulunamadı!");
        return;
      }

      try {
        const response = await fetch(`https://carhubapp-hrbgdfgda5dadmaj.italynorth-01.azurewebsites.net/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error("API Hatası");
        }

        const data = await response.json();
        setCartItems(data.cartLines || []);
      } catch (error) {
        console.error("Sepet verisi alınamadı:", error);
      }
    };

    fetchCart();
  }, [userId, accessToken]);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
          🛍️ Basket
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between border-b py-6 last:border-b-0 hover:shadow-md transition-shadow duration-200 rounded-md px-4 group"
              >
                <div className="flex items-center space-x-6 w-full md:w-2/3">
                  <img
                    src={item.product.imagePath || "/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-24 h-28 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transform transition-transform"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Renk: {item.product.color || 'N/A'}</p>
                    <p className="text-gray-500 text-sm">Beden: {item.size}</p>
                    <div className="mt-2">
                      {item.product.discountPrice ? (
                        <>
                          <span className="text-red-600 font-bold text-lg mr-2">
                            ${item.product.discountPrice.toFixed(2)}
                          </span>
                          <span className="line-through text-gray-400">
                            ${item.product.unitPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-bold text-lg">
                          ${item.product.unitPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 mt-4 md:mt-0">
                  <label htmlFor={`qty-${item.id}`} className="text-sm text-gray-600">
                    Adet:
                  </label>
                  <select
                    id={`qty-${item.id}`}
                    value={item.quantity}
                    className="border border-gray-300 rounded px-3 py-1 text-sm bg-gray-50 shadow-sm"
                    disabled
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button className="mt-2 text-red-500 hover:text-red-700">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500 py-10">
              🛒 Sepetiniz şu anda boş. Alışverişe başlayın!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
