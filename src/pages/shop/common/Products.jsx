import React, { useState, useEffect } from "react";
import Cart from "../cart";
import { useNavigate } from 'react-router-dom';



const Products = ({ selectedCategory, priceRange }) => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const productsPerPage = 9;
  const [startProduct, setStartProduct] = useState(0);
  const navigate = useNavigate();
  const userId = 4;
 
  

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
 const fetchCartId = async (userId) => {
  try {
    const response = await fetch(`https://localhost:7282/api/Cart/GetCartWithLinesByUserId?userId=${userId}`);
    const data = await response.json();
    return data.cartId; // Sepet ID'sini döndür
  } catch (error) {
    console.error("Sepet ID'si alınamadı:", error);
    return null;
  }
};

const handleAddToCart = async (productId) => {
  const cartId = await fetchCartId(userId);
  if (cartId) {
    try {
      const response = await fetch("https://localhost:7282/api/Cart/AddProductToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cartId,
          productId: productId,
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
      console.error("Ürün sepete eklenirken hata oluştu:", error);
    }
  }
};


const handleBasketClick = () => {
  navigate('/userProfile/cart'); // Doğru yola yönlendirme
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
        <button onClick={handleBasketClick} className="mr-4">
          <span style={{ fontSize: "24px", color: "#3B82F6" }}>&#128722;</span>
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
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4  ">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.name}
              className="bg-white rounded-xl border border-[#E9E9E9] shadow-sm relative"
              style={{width: 327.48,height: 509.52,marginTop: "20px",}}>
              <img src={product.imagePath} alt={product.name} className="rounded-xl object-cover absolute"
                style={{width: 265.48,height: 265.48,top: "31px",left: "31px",}}/>
              <div className="text-2xl font-semibold font-bold absolute"
                style={{width: 45.26,height: 37,top: "369.27px",left: "31px",}}>${product.unitPrice}
              </div>

              <div className="text-sm font-bold truncate absolute"style={{width: 180.5,height: 21,top: "335px",left: "31px",}}>
                 {product.description}
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-2 px-4 rounded border border-blue-500 absolute flex items-center justify-center"
                style={{
                  width: 265.48,
                  height: 56.75,
                  top: "421.77px",
                  left: "31px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                }}
              >
                <span style={{ color: "#3B82F6" }}>&#128722;</span>
                <span className="ml-2">Add to Cart</span>
              </button>
            </div>))) : ( <div className="text-gray-500 text-center col-span-3"> No products found for this category or price range.</div>)}
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
