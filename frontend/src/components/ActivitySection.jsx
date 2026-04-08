import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";

// This is a sub-component used only inside this file
const ActivityCard = ({ activity, isGrid, hidePricing }) => {
  // Check if a discount exists
  const hasDiscount = activity.originalPrice && activity.discountPercentage;
  // Check if a review exists
  const reviews = activity.rating && activity.reviews;
  return (
    <div className={`group cursor-pointer ${isGrid ? 'w-full' : 'shrink-0 w-72'}`}>
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!hidePricing && (
          <button className="absolute top-3 right-3 p-1.5 rounded-full  backdrop-blur-sm z-10">
            <Heart size={18} className={"text-white"} />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-sm md:text-base text-gray-800 leading-tight truncate">
          {activity.title}
        </h3>

        {reviews && (
          <div className="flex items-center gap-1 text-sm">
            <Star size={14} className="fill-orange-300 text-orange-300" />
            <span className="font-bold text-gray-800">{activity.rating}</span>
            <span className="text-gray-400">({activity.reviews} Reviews)</span>
          </div>
        )}

        <div className="pt-1">
          {activity.isNew && (
            <span className="text-sm font-semibold text-gray-600">
              New
            </span>
          )}
          {!hidePricing && (
            <>
              {/* Original Price (Strike-through) */}
              <div className="flex items-baseline gap-2">
                <p className="text-xs text-gray-400 font-medium">from</p>
                {hasDiscount && (
                  <span className="text-gray-400 line-through text-sm">
                    AED {activity.originalPrice}
                  </span>
                )}
              </div>

              {/* Current Price and Save Badge */}
              <div className="flex items-center gap-2">
                <p className="font-bold text-left text-sm md:text-base line-clamp-1 text-gray-800">
                  AED {activity.price}
                </p>

                {hasDiscount && (
                  <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                    Save {activity.discountPercentage}%
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// This is the main component you will export
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
        <h2 className="flex flex-col gap-1 "><span className="text-xl lg:text-2xl font-bold text-gray-800">{title}</span> <span className="text-gray-500 text-sm">{desc}</span></h2>
     
        {!isGrid && (
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftBtn}
            className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full  ${!showLeftBtn ? "opacity-20" : "hover:bg-gray-50"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!showRightBtn}
            className={`p-2 border border-gray-200 transition-all shadow-sm rounded-full  ${!showRightBtn ? "opacity-20" : "hover:bg-gray-50"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={isGrid ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4" : "flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"}
      >
        {activities?.map((item, index) => (
          <ActivityCard key={index} activity={item} isGrid={isGrid} hidePricing={hidePricing} />
        ))}
      </div>
    </section>
  );
};

export default ActivitySection; // Export the SECTION, not the card!
