import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import getUserFromToken from "../../common/GetUserFromToken";
import Cookies from "js-cookie";


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


const Products = ({ selectedCategory, priceRange }) => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [startProduct, setStartProduct] = useState(0);
  const navigate = useNavigate();
  const productsPerPage = 9;

  const accessToken = getCookie("accessToken");
 
  
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "https://localhost:7282/api/Product/GetAll";

        if (selectedCategory) {
          url = `https://localhost:7282/api/Product/GetProductsByCategoryId?categoryId=${selectedCategory.id}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  },[selectedCategory]);

  useEffect(() => {
    let filteredProducts = [...products];

    if (priceRange) {filteredProducts = filteredProducts.filter((product) =>product.unitPrice >= priceRange.minPrice && product.unitPrice <= priceRange.maxPrice);}

    sortProducts(filteredProducts, sortBy);}, [products, priceRange, sortBy]);

  const sortProducts = (productsToSort, sortOption) => {let sorted = [...productsToSort];

    switch (sortOption) {case "price-asc":sorted.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case "price-desc":sorted.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      default:
        break;}
    setSortedProducts(sorted);};

  const endProduct = Math.min(startProduct + productsPerPage, sortedProducts.length);
  const currentProducts = sortedProducts.slice(startProduct, endProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {const newStartProduct = (pageNumber - 1) * productsPerPage; 
    setStartProduct(newStartProduct);};

  const handlePreviousPage = () => {
    if (startProduct > 0) {setStartProduct(startProduct - productsPerPage);}};

  const handleNextPage = () => {if (startProduct + productsPerPage < sortedProducts.length) {setStartProduct(startProduct + productsPerPage);}};

 // Sepet ID'sini al
 

  // ...

  const fetchCartId = async () => {
    const user = getUserFromToken();
    const userId = parseInt(user?.id);
    const accessToken = Cookies.get("accessToken");
  
    if (!userId || !accessToken) {
      console.error("Kullanıcı ID veya token eksik.");
      return null;
    }
  
    try {
      const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Response not OK:", errorData);
        return null;
      }
  
      const data = await response.json();
      console.log("Cart API Raw Response:", data); // ✔️
  
     
      return data.cartId;
    } catch (error) {
      console.error("Cart ID alinamadi (try-catch):", error);
      return null;
    }
  };
  
  
  const handleAddToCart = async (productId) => {
    const accessToken = Cookies.get("accessToken");
  
    if (!accessToken) {
      alert("Sepete eklemek için önce giriş yapmalisiniz!");
      return;
    }
  
    const user = getUserFromToken();
    const userId = user?.id;
  
    if (!userId) {
      alert("Kullanici ID çözümlenemedi. Lütfen tekrar giriş yapiniz.");
      return;
    }
  
    const cartId = await fetchCartId(); 
    if (!cartId) {
      alert("Sepet bilgisi alınamadı.");
      return;
    }
  
    try {
      const response = await fetch("https://localhost:7282/api/Cart/AddProductToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          cartId,
          productId,
          quantity: 1,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ürün sepete eklenemedi:", errorData);
      } else {
        alert("Ürün sepete eklendi!");
      }
    } catch (error) {
      console.error("Sepete eklerken hata oluştu:", error);
    }
  };

  const handleBasketClick = () => {
    navigate("/cart");
  };

  return (
    <div className="pt-11 pl-9 pr-40">
    {/* Sorting and Basket */}
    <div className="flex justify-between mb-4 items-center">
      <div style={{ marginTop: "5px" }}>
        Showing {startProduct + 1}–{Math.min(startProduct + productsPerPage, sortedProducts.length)} of {sortedProducts.length} results
      </div>
      <div className="flex items-center" style={{ marginTop: "5px" }}>
        {/* Basket Icon */}
        <button onClick={handleBasketClick} className="mr-4 hover:scale-110 transition-transform">
      <span role="img" aria-label="cart" style={{ fontSize: "24px", color: "#3B82F6" }}>
        🛒
      </span>
    </button>
        {/* Sort Dropdown */}
        <span className="text-gray-600 mr-1">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-none border-none shadow-none py-2 px-4 focus:outline-none focus:ring-0"
        >
          <option value="latest">Sort by latest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
      {/* Products Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-xl border border-[#E9E9E9] shadow-sm relative"
              style={{
                width: 327.48,
                height: 509.52,
                marginTop: "20px",
              }}
            >
              <img
                src={product.imagePath}
                alt={product.name}
                className="rounded-xl object-cover absolute"
                style={{
                  width: 265.48,
                  height: 265.48,
                  top: "31px",
                  left: "31px",
                }}
              />
              <div
                className="text-sm font-bold truncate absolute"
                style={{
                  width: 180.5,
                  height: 21,
                  top: "335px",
                  left: "31px",
                }}
              >
                {product.description}
              </div>

              <div
                className="text-2xl font-semibold absolute"
                style={{
                  top: "369.27px",
                  left: "31px",
                  color: "#111827",
                }}
              >
                ${product.unitPrice}
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 border border-blue-500 rounded absolute flex items-center justify-center transition duration-200 ease-in-out"
                style={{
                  width: 265.48,
                  height: 56.75,
                  top: "421.77px",
                  left: "31px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                }}
              >
                <span style={{ fontSize: "20px", color: "#3B82F6" }}>&#128722;</span>
                <span className="ml-2">Add to Cart</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center col-span-3">
            No products found for this category or price range.
          </div>
        )}
      </div>


      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 items-center">
        
        {startProduct > 0 && (
          <button onClick={handlePreviousPage} className="px-4 py-2 mx-2 font-bold rounded-full border border-[#E9E9E9] text-black"
            style={{ backgroundColor: "#F9FBFC", width: "60px" }}> &lt;
          </button> )}

        
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}
           className={`px-4 py-2 mx-1 font-bold rounded-full ${startProduct / productsPerPage === index? "bg-black text-white": "text-black bg-transparent"}`}>
            {index + 1}
          </button>
        ))}

        
        {startProduct + productsPerPage < sortedProducts.length && (
          <button onClick={handleNextPage}
            className="px-4 py-2 mx-2 font-bold rounded-full border border-[#E9E9E9] text-black"
            style={{ backgroundColor: "#F9FBFC", width: "60px" }}
          > &gt;
          </button> )}
      </div>
    </div>
  );
};

export default Products;