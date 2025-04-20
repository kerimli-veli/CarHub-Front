import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import ProductDescription from './productDetails/productdescription';
import ProductFoto from './productDetails/productfoto';
import RelatedProducts from './productDetails/RelatedProducts';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(location.state || null);
  const [allProducts, setAllProducts] = useState([]);

  // Eğer state yoksa, API'den tek ürün getir
  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`https://localhost:7282/api/Product/GetById?id=${id}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Ürün alınırken hata:", error);
          navigate('/');
        }
      };
      fetchProduct();
    }
  }, [product, id, navigate]);

  // Tüm ürünleri getir (Related için)
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
      <ProductFoto images={Array.isArray(product.imagePath) ? product.imagePath : [product.imagePath]} />
    </div>
    <div className="flex-1">
      <ProductDescription product={product} />
    </div>
  </div>

  {/* Bu satır kritik! */}
  {product && allProducts.length > 0 && (
    <RelatedProducts products={allProducts} currentProduct={product} />
  )}
</div>

      <Footer />
    </>
  );
};

export default ProductDetails;
