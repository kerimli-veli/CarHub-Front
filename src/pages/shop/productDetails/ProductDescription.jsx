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
      const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (response.status === 404) {
        const createRes = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Cart/Create`, {
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
          console.error("Cart could not be created.:", createData?.errors);
          return null;
        }
      }

      const data = await response.json();
      return data.cartId;
    } catch (error) {
      console.error("An error occurred while retrieving the cart:", error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!userId || !accessToken) {
      toast.error("You need to log in!");
      return;
    }

    const cartId = await fetchCartId();
    if (!cartId) {
      toast.error("Cart could not be created!");
      return;
    }

    try {
      const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Cart/AddProductToCart", {
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
        toast.success("Product added to the cart!");
      } else {
        toast.error("Could not be added to the cart.❌");
        console.warn("API ERROR:", data);
      }
    } catch (error) {
      toast.error("An error occurred!");
      console.error("Add to cart error:", error);
    }
  };

  

return (
  <div className="flex flex-col gap-4 w-[500px]">
    <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
    <p className="text-green-600 font-medium text-sm">{product.unitsInStock}</p>
    <div className="text-3xl font-bold text-gray-800">
  ${ (product.unitPrice * quantity).toFixed(2) }
</div>
    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
    <hr className="my-4 border-gray-300" />

    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
        <button onClick={decrement} className="px-3 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100">−</button>
        <span className="px-4 text-lg">{quantity}</span>
        <button onClick={increment} className="px-3 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100">+</button>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 px-6 rounded-md shadow-md"
      >
        Add to Basket
      </button>
    </div>

    <div className="border border-gray-200 rounded-md mt-6 divide-y bg-white shadow-sm">
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
          <p className="text-sm text-gray-600">
            Free 30 Days Delivery Returns.{' '}
            <a className="text-blue-500 underline" href="#">Details</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

};

export default ProductDescription;
