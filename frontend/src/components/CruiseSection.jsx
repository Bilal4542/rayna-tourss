import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "./TourCard";

const CruiseSection = ({ title, activities }) => {
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
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 px-4 max-w-[97%] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex flex-col gap-1">
          <span className="text-xl lg:text-2xl font-bold text-gray-800">{title}</span>
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftBtn}
            className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full ${!showLeftBtn ? "opacity-20 cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!showRightBtn}
            className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full ${!showRightBtn ? "opacity-20 cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-6 pt-2"
      >
        {activities?.map((item, index) => (
          <TourCard
            key={index}
            image={item.images || item.image}
            title={item.title}
            shipName={item.shipName}
            departure={item.departure}
            duration={item.duration}
            departures={item.departures}
            itinerary={item.itinerary}
            price={item.price}
            variant="cruise"
          />
        ))}
      </div>
    </section>
  );
};

export default CruiseSection;
