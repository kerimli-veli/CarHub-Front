import React, { useEffect, useState } from 'react';
import getUserFromToken from '../common/GetUserFromToken';
import Cookies from "js-cookie";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");
 
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !accessToken) {
        console.error("Kullanici ID veya token bulunamadi!");
        return;
      }

      try {
        const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error("API Error");
        }

        const data = await response.json();
        setCartItems(data.cartLines || []);
      } catch (error) {
        console.error("Sepet verisi alinamadi:", error);
      }
    };

    fetchCart();
  }, [userId, accessToken]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="border-b pb-2">
              <p className="font-semibold">{item.product.name}</p>
              <p>Price: ${item.product.unitPrice}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
