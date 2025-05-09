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

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setProduct(null); 

    const fetchProductById = async () => {
      try {
        const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Product/Get/${id}`);
        if (!response.ok) {
          throw new Error(`Product not found. HTTP ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("An error occurred while retrieving the products.", error.message);
      }
    };

    if (location.state) {
      setProduct(location.state);
    } else {
      fetchProductById();
    }
  }, [id, location.state]);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Product/GetAll");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("An error occurred while retrieving the products.", error);
      }
    };

    fetchProducts();
  }, []);

  if (!product) return <div className="text-center py-20">Loding...</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <ProductFoto
              images={Array.isArray(product.imagePath) ? product.imagePath : [product.imagePath]}
            />
          </div>
          <div className="flex-1">
            <ProductDescription product={product} />
          </div>
        </div>

        {product && allProducts.length > 0 && (
          <RelatedProducts products={allProducts} currentProduct={product} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
