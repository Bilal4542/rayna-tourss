import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "./TourCard";

const ActivitySection = ({ title, activities, desc, isGrid, hidePricing }) => {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 px-4 max-w-[97%] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex flex-col gap-1">
          <span className="text-xl lg:text-2xl font-bold text-gray-800">{title}</span>
          {desc && <span className="text-gray-500 text-sm">{desc}</span>}
        </h2>

        {!isGrid && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!showLeftBtn}
              className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full ${!showLeftBtn ? "opacity-20" : "hover:bg-gray-50"}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!showRightBtn}
              className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full ${!showRightBtn ? "opacity-20" : "hover:bg-gray-50"}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={
          isGrid
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4"
            : "flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
        }
      >
        {activities?.map((item, index) => (
          <TourCard
            key={index}
            image={item.image}
            title={item.title}
            rating={item.rating}
            reviews={item.reviews}
            price={item.price}
            originalPrice={item.originalPrice}
            discountPercentage={item.discountPercentage}
            isNew={item.isNew}
            hidePricing={hidePricing}
            isGrid={isGrid}
            variant="activity"
          />
        ))}
      </div>
    </section>
  );
};

export default ActivitySection;
