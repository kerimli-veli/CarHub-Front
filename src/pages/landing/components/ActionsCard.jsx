import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cardVariantsLeft = {
  hidden: { opacity: 0, x: -60, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const cardVariantsRight = {
  hidden: { opacity: 0, x: 60, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const ActionCards = () => {
  const navigate = useNavigate();

  const handleBuyRedirect = () => {
    navigate("/carList"); 
  };

  const handleSellRedirect = () => {
    navigate("/userProfile/addCar"); 
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12">
      {/* Card 1 – Sol tərəfdən sağa */}
      <motion.div
        variants={cardVariantsLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="flex items-center justify-between bg-blue-50 rounded-3xl p-10 w-full max-w-3xl h-72 shadow-md"
      >
        <div className="flex flex-col justify-between h-full max-w-[60%]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
              Are You Looking <br /> For a Car ?
            </h2>
            <p className="text-gray-600 text-base">
              We are committed to providing our customers with exceptional service.
            </p>
          </div>
          <button
            onClick={handleBuyRedirect}
            className="mt-6 w-40 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg text-sm transition"
          >
            Get Started <span className="ml-2">↗</span>
          </button>
        </div>
        <div className="ml-6">
          <img
            src="https://i.postimg.cc/FsHJ6SQG/electric-car-svg.png"
            alt="Looking for Car"
            className="h-20 w-20 object-contain"
          />
        </div>
      </motion.div>

      {/* Card 2 – Sağ tərəfdən sola */}
      <motion.div
        variants={cardVariantsRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex items-center justify-between bg-pink-100 rounded-3xl p-10 w-full max-w-3xl h-72 shadow-md"
      >
        <div className="flex flex-col justify-between h-full max-w-[60%]">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
              Do You Want to <br /> Sell a Car ?
            </h2>
            <p className="text-gray-600 text-base">
              We are committed to providing our customers with exceptional service.
            </p>
          </div>
          <button
            onClick={handleSellRedirect}
            className="mt-6 w-40 flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-5 rounded-lg text-sm transition"
          >
            Get Started <span className="ml-2">↗</span>
          </button>
        </div>
        <div className="ml-6">
          <img
            src="https://i.postimg.cc/3wNh5Kxs/electric-car2-svg.png"
            alt="Sell Car"
            className="h-20 w-20 object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ActionCards;
