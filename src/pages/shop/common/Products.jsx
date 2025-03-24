import React, { useState, useEffect } from 'react';

const Products = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('latest'); // Default sorting option
  const [sortedProducts, setSortedProducts] = useState([]); // State for sorted products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = 'https://localhost:7282/api/Product/GetAll';
        if (selectedCategory) {
          url = `https://localhost:7282/api/Product/GetProductsByCategoryId?categoryId=${selectedCategory.id}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    // Sort products whenever the `products` or `sortBy` state changes
    sortProducts(products, sortBy);
  }, [products, sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortProducts = (productsToSort, sortOption) => {
    let sorted = [...productsToSort]; // Create a copy to avoid mutating the original array

    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      default:
        // For 'latest' or any unknown option, revert to default (no sorting) or sort by ID or date if applicable
        break;
    }

    setSortedProducts(sorted);
  };

  const productsPerPage = 9; // Number of products displayed per page
  const startProduct = 1; // Index of the first product being displayed
  const endProduct = Math.min(productsPerPage, sortedProducts.length); // Index of the last product being displayed

  return (
    <div className="pt-40 pl-8 pr-9">
      {/* Top Section: Showing Results and Sorting */}
      <div className="flex justify-between">
        <div className="" style={{ marginTop: '5px' }}> {/* Mesafeyi kısaltmak için marginTop'u 5px yaptım */}
          Showing {startProduct}–{endProduct} of {sortedProducts.length} results
        </div>
        <div className="flex items-center pr-8" style={{ marginTop: '5px' }}> {/* Mesafeyi kısaltmak için marginTop'u 5px yaptım */}
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

      <div className="grid grid-cols-3 md:grid-cols-3 ">
        {sortedProducts.map((product) => (
          <div
            key={product.name}
            className="bg-white rounded-xl border border-gray-200 relative"
            style={{
              width: 327.48,
              height: 509.52,
              marginTop: '20px', // Ürün kartları arasındaki boşluğu artırmak için marginTop ekledim
            }}
          >
            {/* Image */}
            <img
              src={product.imagePath}
              alt={product.name}
              className="rounded-xl object-cover absolute"
              style={{
                width: 265.48,
                height: 265.48,
                top: '31px',
                left: '31px',
              }}
            />

            {/* Price */}
            <div
              className="text-2xl font-semibold font-bold absolute"
              style={{
                width: 45.26,
                height: 37,
                top: '369.27px',
                left: '31px',
              }}
            >
              ${product.unitPrice}
            </div>

            {/* Description */}
            <div
              className="text-sm font-bold truncate absolute"
              style={{
                width: 180.5,
                height: 21,
                top: '335px',
                left: '31px',
              }}
            >
              {product.description}
            </div>

            {/* Add to Cart Button */}
            <button
              className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-2 px-4 rounded border border-blue-500 absolute flex items-center justify-center"
              style={{
                width: 265.48,
                height: 56.75,
                top: '421.77px',
                left: '31px',
                borderRadius: '8px',
                borderWidth: '1px',
              }}
            >
              <span style={{ color: '#3B82F6' }}>&#128722;</span>{/* Shopping Cart Icon */}
              <span className="ml-2">Add to Cart</span>
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-gray-500 text-center col-span-3">
            No products found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
