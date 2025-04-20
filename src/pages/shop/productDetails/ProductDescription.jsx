import React, { useState } from 'react';
import Cookies from "js-cookie";
import getUserFromToken from '../../common/GetUserFromToken';
import toast from 'react-hot-toast';

const ProductDescription = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const accessToken = Cookies.get("accessToken");
  const user = getUserFromToken();
  const userId = user?.id;

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const fetchCartId = async () => {
    if (!userId || !accessToken) return null;

    try {
      const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (response.status === 404) {
        const createRes = await fetch(`https://localhost:7282/api/Cart/Create`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        });

        const createData = await createRes.json();
        if (createData?.isSuccess && createData?.data?.id) {
          return createData.data.id;
        } else {
          console.error("Sepet oluşturulamadı:", createData?.errors);
          return null;
        }
      }

      const data = await response.json();
      return data.cartId;
    } catch (error) {
      console.error("Sepet alınırken hata oluştu:", error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!userId || !accessToken) {
      toast.error("Giriş yapmanız gerekiyor!");
      return;
    }

    const cartId = await fetchCartId();
    if (!cartId) {
      toast.error("Sepet oluşturulamadı!");
      return;
    }

    try {
      const response = await fetch("https://localhost:7282/api/Cart/AddProductToCart", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartId,
          productId: product.id,
          quantity: quantity
        })
      });

      const data = await response.json();
      if (response.ok && data.isSuccess) {
        toast.success("Ürün sepete eklendi!");
      } else {
        toast.error("Sepete eklenemedi ❌");
        console.warn("API ERROR:", data);
      }
    } catch (error) {
      toast.error("Bir hata oluştu!");
      console.error("Add to cart error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-[500px]">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-green-600 font-medium text-sm">In Stock</p>
      <div className="text-3xl font-semibold text-gray-800">${product.unitPrice}</div>
      <p className="text-gray-600">{product.description}</p>
      <hr className="my-4" />

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={decrement} className="px-3 py-2 text-xl font-bold text-gray-700">−</button>
          <span className="px-4 text-lg">{quantity}</span>
          <button onClick={increment} className="px-3 py-2 text-xl font-bold text-gray-700">+</button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 px-6 rounded-md"
        >
          Add to Basket
        </button>
      </div>

      <div className="border border-gray-300 rounded-md mt-6 divide-y">
        <div className="flex items-start gap-4 p-4">
          <span className="text-2xl">🚚</span>
          <div>
            <h3 className="font-semibold">Free Delivery</h3>
            <p className="text-sm text-gray-600">Enter your postal code for Delivery Availability</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4">
          <span className="text-2xl">🔁</span>
          <div>
            <h3 className="font-semibold">Return Delivery</h3>
            <p className="text-sm text-gray-600">Free 30 Days Delivery Returns. <a className="text-blue-500 underline" href="#">Details</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
