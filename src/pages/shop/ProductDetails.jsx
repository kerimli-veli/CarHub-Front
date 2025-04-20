import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import ProductDescription from './productDetails/productdescription';
import ProductFoto from './productDetails/productfoto';
import RelatedProducts from './productDetails/RelatedProducts';



const ProductDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state;
  
    const [allProducts, setAllProducts] = useState([]);
  
    // Ürün detay sayfasında ürün yoksa anasayfaya yönlendir
    useEffect(() => {
      if (!product) {
        navigate('/');
      }
    }, [product, navigate]);
  
    // API'den tüm ürünleri çek
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch("https://localhost:7282/api/Product/GetAll");
          const data = await response.json();
          setAllProducts(data);
        } catch (error) {
          console.error("Ürünler alınırken hata oluştu:", error);
        }
      };
  
      fetchProducts();
    }, []);
  
    if (!product) return null;
  
    return (
      <>
        <Header />
  
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <ProductFoto images={product.imagePath} />
            </div>
            <div className="flex-1">
              <ProductDescription product={product} />
            </div>
          </div>
  
          {/* Related Products */}
          <RelatedProducts products={allProducts} currentProduct={product} />
        </div>
  
        <Footer />
      </>
    );
  };
  

export default ProductDetails;
