import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loading state when the slide changes
  useEffect(() => {
    setIsLoaded(false);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-[95%] mx-auto my-5 rounded-2xl h-125 overflow-hidden bg-white">
      {/* 1. SKELETON LOADER: Shown while isLoaded is false */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 animate-pulse bg-gray-200 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* 2. IMAGE PRELOADER */}
          <img
            src={slides[current].url}
            alt={slides[current].title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)} // This triggers the switch
          />
          
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent z-10" />

          {/* Text Content - only show if image is ready to prevent flying text over black */}
          {isLoaded && (
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 max-w-4xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl md:text-5xl font-bold mb-4"
              >
                {slides[current].title}
              </motion.h2>
              <p className="text-white font-bold tracking-widest uppercase text-lg mb-2">
    {slides[current].subtext}
  </p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-xl mb-8 max-w-lg"
              >
                {slides[current].description}
              </motion.p>
              <button className="w-fit px-8 py-3 bg-white text-black font-bold rounded-lg">
                Book Now
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default MainCarousel