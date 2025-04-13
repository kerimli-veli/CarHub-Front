import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = 4; // Kullanıcı ID'si

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`);
        const data = await response.json();
        setCartItems(data.cartLines || []); // Sepet ürünlerini set et
      } catch (error) {
        console.error("Sepet verisi alınamadı:", error);
      }
    };

    fetchCart();
  }, []);

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
