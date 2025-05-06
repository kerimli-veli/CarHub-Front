import { motion, AnimatePresence } from "framer-motion";
import ChooseTemplate from "./../ChooseTemplate";
import React from "react";

export default function ChooseTemplateModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-[20px]"
            >
              x
            </button>
            <ChooseTemplate onClose={onClose}/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
