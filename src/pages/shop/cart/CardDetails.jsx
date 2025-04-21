import React, { useEffect, useState } from 'react';
import { FaCcMastercard, FaCcVisa, FaCcAmex, FaCcPaypal } from 'react-icons/fa';
import getUserFromToken from '../../common/GetUserFromToken';
import Cookies from "js-cookie";

const CardDetails = ({ total = 0 }) => {
  const shipping = 20;
  const finalTotal = total + shipping;

  const [userData, setUserData] = useState(null);
  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");
  const fullImagePath = userData?.userImagePath?.startsWith("http")
    ? userData.userImagePath
    : `https://localhost:7282${userData?.userImagePath || ""}`;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !accessToken) {
        console.warn("Eksik userId veya token:", { userId, accessToken });
        return;
      }

      try {
        const response = await fetch(`https://localhost:7282/api/User/GetById?Id=${userId}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const data = await response.json();
        console.log("User data:", data);
        setUserData(data.data);
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  return (
    <div className="bg-blue-600 text-white rounded-xl shadow-xl p-[34.5px] w-full md:w-105">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {userData ? `${userData.name} ${userData.surname}` : "Card Details"}
        </h2>
        <img
          src={
            userData?.userImagePath
              ? userData.userImagePath.startsWith("http")
                ? userData.userImagePath
                : `https://localhost:7282${userData.userImagePath}`
              : "https://via.placeholder.com/40"
          }
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
        />
      </div>

      <p className="text-sm mb-2">Card type</p>
      <div className="flex space-x-4 mb-6">
        <FaCcMastercard size={28} />
        <FaCcVisa size={28} />
        <FaCcAmex size={28} />
        <FaCcPaypal size={28} />
      </div>

      <input
        type="text"
        placeholder="Cardholder's Name"
        className="w-full mb-4 px-4 py-2 rounded border border-blue-400 bg-blue-500 placeholder-white focus:outline-none"
      />
      <input
        type="text"
        placeholder="Card Number"
        className="w-full mb-4 px-4 py-2 rounded border border-blue-400 bg-blue-500 placeholder-white focus:outline-none"
      />

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Expiration"
          className="w-1/2 px-4 py-2 rounded border border-blue-400 bg-blue-500 placeholder-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="Cvv"
          className="w-1/2 px-4 py-2 rounded border border-blue-400 bg-blue-500 placeholder-white focus:outline-none"
        />
      </div>

      <hr className="border-blue-300 mb-4" />

      <div className="text-sm space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total (Incl. taxes)</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg flex justify-between items-center px-4 transition-all duration-200">
        <span>${finalTotal.toFixed(2)}</span>
        <span>CHECKOUT ➞</span>
      </button>
    </div>
  );
};

export default CardDetails;
