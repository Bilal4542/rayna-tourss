import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  // Preload images to avoid any flicker when transitioning
  useEffect(() => {
    if (slides && slides.length > 0) {
      slides.forEach((slide) => {
        if (slide.url) {
          const img = new Image();
          img.src = slide.url;
        }
      });
    }
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-[95%] mx-auto my-5 rounded-2xl h-125 overflow-hidden bg-black">
      {/* Omitting mode="wait" so the new slide overlaps the old slide perfectly smoothly */}
      <AnimatePresence initial={false}>
        <motion.div
           // Key change triggers AnimatePresence for the old and new slide simultaneously
          key={current}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[current].url}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />

          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 max-w-4xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-3xl md:text-5xl font-bold mb-4"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-bold tracking-widest uppercase text-lg mb-2"
            >
              {slides[current].subtext}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-xl mb-8 max-w-lg"
            >
              {slides[current].description}
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-fit px-8 py-3 bg-white text-black font-bold rounded-lg"
            >
              Book Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MainCarousel;