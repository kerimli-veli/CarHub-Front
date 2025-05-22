import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: "list",
    title: "Sell a car",
    description: "Display and organize items efficiently",
    img: "https://i.postimg.cc/Fs1R7PqV/SellCar.png",
  },
  {
    id: "compare",
    title: "Buy a car",
    description: "Contrast options side by side",
    img: "https://i.postimg.cc/XJVN3xdF/BuyIcon.png",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};


export default function ChooseTemplate({ onClose }) {
  const [selected, setSelected] = useState("compare");
  const navigate = useNavigate();

  const handleClick = () => {
    if (selected === "list") {
      navigate("/createNewAuction"); 
    } else if (selected === "compare") {
      navigate("/auctionList"); 
    }

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <h2 className="text-lg font-semibold">Choose template</h2>
        <p className="text-sm text-gray-500">
          Select a template to start organizing your content.
        </p>
      </motion.div>

      <div className="space-y-3">
  {templates.map((template) => (
    <motion.div
      key={template.id}
      layout
      onClick={() => setSelected(template.id)}
      className={`relative flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm ${
        selected === template.id
          ? "border-blue-500 ring-1 ring-blue-300 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated blue background overlay using layoutId */}
      <AnimatePresence>
        {selected === template.id && (
          <motion.div
            layoutId="highlight"
            className="absolute inset-0 rounded-lg bg-blue-100/40 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center gap-4">
        <img
          src={template.img}
          alt={template.title}
          className="w-12 h-12 rounded"
        />
        <div>
          <div className="font-semibold">{template.title}</div>
          <div className="text-sm text-gray-500">{template.description}</div>
        </div>
      </div>
    </motion.div>
  ))}
</div>


      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={templates.length + 1}
        className="flex justify-between pt-2"
      >
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="px-4 py-2 bg-black text-white rounded-md"
          onClick={handleClick}
        >
          Next
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
