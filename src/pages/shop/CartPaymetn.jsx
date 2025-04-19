import React, { useState } from 'react';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import Cart from './cart/Cart';
import CardDetails from './cart/CardDetails';

const CartPayment = () => {
    const [total, setTotal] = useState(0);
  
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <h2 className="text-3xl font-bold text-gray-800 mt-10 ml-8">Your Basket</h2>
  
        <div className=" mx-auto px-15 py-10">
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 w-full">
              <Cart onTotalChange={setTotal} />
            </div>
            <div className="lg:w-1/3 w-full ">
              <CardDetails total={total} />
            </div>
          </div>
        </div>
  
        <Footer />
      </div>
    );
  };
  
  export default CartPayment;
