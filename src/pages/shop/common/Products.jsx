import React, { useState, useEffect } from "react";
 
const Products = ({ selectedCategory, selectedPriceRange }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [startProduct, setStartProduct] = useState(0);
  const productsPerPage = 9;
 
  // API'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "https://localhost:7282/api/Product/GetAll";
 
        if (selectedCategory && selectedPriceRange) {
          url = `https://localhost:7282/api/Product/GetProductsByCategoryAndPrice?categoryId=${selectedCategory.id}&minPrice=${selectedPriceRange.minPrice}&maxPrice=${selectedPriceRange.maxPrice}`;
        } else if (selectedCategory) {
          url = `https://localhost:7282/api/Product/GetProductsByCategoryId?categoryId=${selectedCategory.id}`;
        } else if (selectedPriceRange) {
          url = `https://localhost:7282/api/Product/GetProductsByPriceRange?minPrice=${selectedPriceRange.minPrice}&maxPrice=${selectedPriceRange.maxPrice}`;
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
  }, [selectedCategory, selectedPriceRange]);
 
  // Ürünleri sıralama
  useEffect(() => {
    sortProducts(products, sortBy);
  }, [products, sortBy]);
 
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
 
  const sortProducts = (productsToSort, sortOption) => {
    let sorted = [...productsToSort];
 
    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      default:
        break;
    }
 
    setSortedProducts(sorted);
  };
 
  const endProduct = Math.min(startProduct + productsPerPage, sortedProducts.length);
  const currentProducts = sortedProducts.slice(startProduct, endProduct);
 
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
 
  const handlePageChange = (pageNumber) => {
    const newStartProduct = (pageNumber - 1) * productsPerPage;
    setStartProduct(newStartProduct);
  };
 
  const handlePreviousPage = () => {
    if (startProduct > 0) {
      setStartProduct(startProduct - productsPerPage);
    }
  };
 
  const handleNextPage = () => {
    if (startProduct + productsPerPage < sortedProducts.length) {
      setStartProduct(startProduct + productsPerPage);
    }
  };
 
  return (
    <div className="pt-40 pl-8 pr-9">
      {/* Sorting and Pagination */}
      <div className="flex justify-between mb-4 items-center">
        <div style={{ marginTop: "5px" }}>
          Showing {startProduct + 1}–{endProduct} of {sortedProducts.length} results
        </div>
        <div className="flex items-center pr-8" style={{ marginTop: "5px" }}>
          <span className="text-gray-600 mr-1">Sort by:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
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
              className="bg-white rounded-xl border border-[#E9E9E9] shadow-sm relative" // Border rengi #E9E9E9 olarak ayarlandı
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
                className="text-2xl font-semibold font-bold absolute"
                style={{
                  width: 45.26,
                  height: 37,
                  top: "369.27px",
                  left: "31px",
                }}
              >
                ${product.unitPrice}
              </div>
 
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
 
              <button
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
        {/* Previous Button */}
        {startProduct > 0 && (
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 mx-2 font-bold rounded-full border border-[#E9E9E9] text-black"
            style={{ backgroundColor: "#F9FBFC", width: "60px" }}
          >
            &lt;
          </button>
        )}
 
        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 font-bold rounded-full ${startProduct / productsPerPage === index
                ? "bg-black text-white" // Aktif sayfa: arka plan siyah, yazı beyaz
                : "text-black bg-transparent" // Diğer sayfalar: sadece siyah yazı
              }`}
          >
            {index + 1}
          </button>
        ))}
 
        {/* Next Button */}
        {startProduct + productsPerPage < sortedProducts.length && (
          <button
            onClick={handleNextPage}
            className="px-4 py-2 mx-2 font-bold rounded-full border border-[#E9E9E9] text-black"
            style={{ backgroundColor: "#F9FBFC", width: "60px" }}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};
 
export default Products;