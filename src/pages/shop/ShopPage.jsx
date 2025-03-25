// import React, { useState } from "react";
// import CategorySidebar from "./common/CategorySidebar";
// import Products from "./common/Products";
// import ProductDetails from "./common/ProductDetails";

// const ShopPage = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [priceRange, setPriceRange] = useState({ minPrice: 20, maxPrice: 360 });
//   const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürün durumu

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     setSelectedProduct(null); // Kategori değiştiğinde ürün detaylarını kapat
//   };

//   const handlePriceRangeChange = (newPriceRange) => {
//     setPriceRange(newPriceRange);
//   };

//   // Ürün detaylarını açma fonksiyonu
//   const handleProductClick = (product) => {
//     setSelectedProduct(product); // Ürün tıklandığında ürün bilgilerini ayarla
//   };

//   // Ürün detaylarını kapatma fonksiyonu
//   const handleCloseDetails = () => {
//     setSelectedProduct(null); // Ürün detaylarını kapat
//   };

//   return (
//     <div className="flex">
//       {/* Kategori Sidebar */}
//       <CategorySidebar
//         onCategoryClick={handleCategoryClick}
//         onPriceRangeChange={handlePriceRangeChange}
//       />

//       {/* Ana İçerik */}
//       <div className="flex-grow">
//         {/* Eğer kategori ve fiyat aralığı seçilmemişse bilgi mesajı göster */}
//         {!selectedCategory && !priceRange ? (
//           <div>Select a category and price range to see products.</div>
//         ) : (
//           <Products
//             selectedCategory={selectedCategory}
//             priceRange={priceRange}
//             onProductClick={handleProductClick} // Ürün tıklama işlevselliği
//           />
//         )}

//         {/* Seçilen ürün varsa ProductDetails bileşenini göster */}
//         {selectedProduct && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
//             <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full relative">
//               {/* Kapatma Butonu */}
//               <button
//                 onClick={handleCloseDetails}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//               >
//                 &times;
//               </button>

//               {/* Ürün Detayları */}
//               <ProductDetails product={selectedProduct} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;

import React, { useState } from 'react';
import CategorySidebar from './common/CategorySidebar';
import Products from './common/Products'


const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ minPrice: 20, maxPrice: 360 });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  return (
    <div className="flex">
      <CategorySidebar
        onCategoryClick={handleCategoryClick}
        onPriceRangeChange={handlePriceRangeChange}
      />
      <div className="flex-grow">
        {/* Eğer kategori ve fiyat aralığı seçilmemişse bilgi mesajı göster */}
        {!selectedCategory && !priceRange ? (
          <div>Select a category and price range to see products.</div>
        ) : (
          <Products selectedCategory={selectedCategory} priceRange={priceRange} />
        )}


      </div>
    </div>
  );
};

export default ShopPage;
