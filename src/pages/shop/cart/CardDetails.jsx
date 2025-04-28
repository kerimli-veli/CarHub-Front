import React, { useEffect, useState, useRef } from 'react';
import { FaCcMastercard, FaCcVisa, FaCcAmex, FaCcPaypal } from 'react-icons/fa';
import getUserFromToken from '../../common/GetUserFromToken';
import Cookies from "js-cookie";

const CardDetails = ({ total = 0 }) => {
  const finalTotal = total;

  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    address: '', city: '', state: '', zipCode: '', country: ''
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const user = getUserFromToken();
  const userId = user?.id;
  const accessToken = Cookies.get("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: !value.trim() }));
  };

  const handleCheckout = async () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'address', 'city', 'state', 'zipCode', 'country'
    ];
  
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!form[field]?.trim()) newErrors[field] = true;
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const payload = {
      userId,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
      status: "Pending",
      shippingAddress: `${form.address}, ${form.city}, ${form.state}`
    };
  
    try {
      const response = await fetch('https://localhost:7282/api/Order', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (data.checkoutUrl) {
       
        const url = new URL(data.checkoutUrl);
        const sessionId = url.searchParams.get("session_id");
  
        if (sessionId) {
          localStorage.setItem("pendingSessionId", sessionId); 
        }
  
        window.location.href = data.checkoutUrl; 
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("pendingSessionId");
  
    if (sessionId) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`https://localhost:7282/api/Payment/payment-success?sessionId=${sessionId}`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          });
  
          if (response.ok) {
            console.log("Ödeme başarılı! Sepet temizlendi ve sipariş oluşturuldu.");
            alert("Ödeme başarılı! Siparişiniz oluşturuldu.");
  
            localStorage.removeItem("pendingSessionId"); 
            
          } else {
            console.error("Ödeme doğrulaması başarısız!");
          }
        } catch (error) {
          console.error("Hata oluştu:", error);
        }
      }, 30000);
  
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !accessToken) return;
      try {
        const response = await fetch(`https://localhost:7282/api/User/GetById?Id=${userId}`, {
          headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  const inputClass = (field) =>
    `w-full mb-3 px-4 py-2 rounded border ${
      errors?.[field] ? "border-red-500" : "border-blue-400"
    } bg-blue-500 placeholder-white focus:outline-none`;

  return (
    <>
      <div className="bg-blue-600 text-white rounded-xl shadow-xl p-6 w-full md:w-96 text-center transition-transform duration-300 ease-in-out hover:scale-105">
        <h2 className="text-xl font-semibold mb-4">Payment Process</h2>
        <p className="mb-6">Click the continue button to complete your order..</p>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-400 hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 text-white font-semibold py-3 rounded-lg"
        >
          Devam Et ➞
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-blue-600 text-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl mx-4 relative transform transition-transform transition-opacity duration-500 ease-out scale-95 opacity-0 animate-fadeScale overflow-y-auto no-scrollbar"
            style={{ maxHeight: "90vh" }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-6 text-white text-3xl font-bold"
            >
              &times;
            </button>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {userData ? `${userData.name} ${userData.surname}` : "Billing Details"}
              </h2>
              <img
                src={
                  userData?.userImagePath?.startsWith("http")
                    ? userData.userImagePath
                    : `https://localhost:7282${userData?.userImagePath || ""}`
                }
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                "firstName", "lastName", "email", "phoneNumber",
                "address", "city", "state", "zipCode", "country"
              ].map(field => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className={inputClass(field)}
                />
              ))}
            </div>

            <hr className="border-blue-300 mb-4" />

            <div className="text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-semibold">
                <span>Total (Incl. taxes)</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
            >
              ${finalTotal.toFixed(2)} - Complete Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardDetails;
