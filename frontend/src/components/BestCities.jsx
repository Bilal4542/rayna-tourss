import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "./TourCard";

export default function BestCities({
  mainHeading = "Best Cities to Visit",
  cardHeadingPrefix = "Things to do in",
  data = [],
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Header Row */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          {mainHeading}
        </h2>

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
          <TourCard
            key={item.id}
            image={item.image}
            title={`${cardHeadingPrefix} ${item.name}`}
            subtext={item.subtext || item.country}
            variant="city"
          />
        ))}
      </div>
    </section>
  );
}