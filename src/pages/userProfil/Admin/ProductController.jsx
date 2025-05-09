import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const ProductController = () => {
  const [products, setProducts] = useState([]);
  const token = Cookies.get("accessToken");
  

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Product/GetAll", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Gelen veri:", result); // BURADA GÖR
          setProducts(result.data);
        } else {
          console.error("Ürünler getirilemedi.");
        }
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
    };

    fetchAllProducts();
  }, [token]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden p-4"
          >
            <img
              src={product.imagePath}
              alt={product.name}
              className="w-full h-40 object-cover rounded-xl"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">{product.description?.substring(0, 60)}...</p>
              <p className="mt-2 text-blue-600 font-bold">${product.price}</p>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">Hiç ürün bulunamadı.</p>
      )}
    </div>
  );
};

export default ProductController;