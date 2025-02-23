'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const components = [
  () => <div className="text-3xl font-bold text-white">Component 1</div>,
  () => <div className="text-3xl font-bold text-white">Component 2</div>,
  () => <div className="text-3xl font-bold text-white">Component 3</div>,
  () => <div className="text-3xl font-bold text-white">Component 4</div>,
  () => <div className="text-3xl font-bold text-white">Component 5</div>,
];

export default function Tv() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % components.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute"
        >
          {components[index]()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
