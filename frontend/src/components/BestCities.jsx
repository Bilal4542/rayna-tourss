import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function BestCities({ 
  mainHeading = "Best Cities to Visit", 
  cardHeadingPrefix = "Things to do in", 
  data = [] 
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to enable/disable navigation buttons
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scrolls by half the container width for a smooth reveal effect
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data]);


  return (
    <section className="py-6 px-4 max-w-[97%] mx-auto font-sans">
      {/* CSS to hide scrollbar across all browsers while keeping scroll active */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Header Row */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          {mainHeading}
        </h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border border-gray-200 transition-all shadow-sm ${
              !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 text-gray-800"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border border-gray-200 transition-all shadow-sm ${
              !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 text-gray-800"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto pb-6 snap-x no-scrollbar scroll-smooth"
      >
        {data.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-52 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer snap-start overflow-hidden"
          >
            {/* Image Container */}
            <div className="h-48 m-2 overflow-hidden rounded-2xl relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content Area */}
            <div className="p-4 pt-1 relative overflow-hidden">
              <h3 className="text-gray-800 font-semibold line-clamp-2 text-sm mb-1 leading-4 md:leading-5">
                {cardHeadingPrefix} {item.name}
              </h3>
              <p className="text-gray-400 text-xs font-medium">
                {item.subtext || item.country}
              </p>

              {/* Hover Arrow Effect */}
              <div className="absolute bottom-1 right-4 transition-all duration-300 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                <ArrowRight size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}