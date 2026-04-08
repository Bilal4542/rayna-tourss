import React, { useState } from "react";
import { MapPin, Moon, Calendar, Map, Ship, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const CruiseCard = ({ activity }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use provided images array or fallback to a generated array based on the single image
  const images = activity.images || [
    activity.image,
    "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1569996162383-7c2a4ddba29f?q=80&w=600&auto=format&fit=crop"
  ];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="shrink-0 w-80 md:w-96 group cursor-pointer bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col">
      {/* Top Image Carousel Placeholder */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200">
        <img
          src={images[currentImageIndex]}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Floating Ship Name */}
        {activity.shipName && (
          <div className="absolute top-3 left-3 bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-gray-700 shadow-sm z-10">
            {activity.shipName}
          </div>
        )}

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 z-10 transition-transform hover:scale-110">
          <Heart size={24} className="text-gray-400 stroke-[1.5px] drop-shadow-md  transition-colors" />
        </button>

        {/* Left/Right Carousel Navigation (Shows on Hover) */}
        <button 
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 hover:bg-white/70 backdrop-blur-sm rounded-full text-white hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 hover:bg-white/70 backdrop-blur-sm rounded-full text-white hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
        {/* Placeholder Carousel Dots */}
        <div className="absolute flex justify-center items-center gap-1.5 bottom-4 w-full">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 bg-white ${idx === currentImageIndex ? "w-6 opacity-100" : "w-2 opacity-60"}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-base text-gray-800 leading-tight mb-2 line-clamp-2">
          {activity.title}
        </h3>

        {/* Info Row: Ship | Departure | Duration */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600 font-medium mb-4">
          {activity.shipName && (
            <div className="flex items-center gap-1">
              <Ship size={14} strokeWidth={1.5} className="text-gray-500" />
              <span>{activity.shipName}</span>
            </div>
          )}
          {activity.departure && (
            <div className="flex items-center gap-1">
              <MapPin size={14} strokeWidth={1.5} className="text-gray-500" />
              <span>{activity.departure}</span>
            </div>
          )}
          {activity.duration && (
            <div className="flex items-center gap-1">
              <Moon size={14} strokeWidth={1.5} className="text-gray-500" />
              <span>{activity.duration}</span>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-gray-100 mb-4"></div>

        {/* Upcoming Departures */}
        {activity.departures && activity.departures.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Calendar size={14} className="text-gray-600" />
              <span className="font-semibold text-xs text-gray-800">Upcoming Departures :</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2.5">
              {activity.departures.map((dep, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    {dep.month}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dep.dates.map((date, dateIdx) => (
                      <span
                        key={dateIdx}
                        className="flex items-center justify-center w-6 h-6 rounded border border-gray-200 text-[10px] md:text-xs text-gray-700 bg-gray-50/50"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-px w-full bg-gray-100 mb-4 text-gray-200"></div>

        {/* Day Wise Itinerary */}
        {activity.itinerary && activity.itinerary.length > 0 && (
          <div className="mb-5 flex-grow">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Map size={14} className="text-gray-600" />
              <span className="font-semibold text-xs text-gray-800">Day Wise Itinerary</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activity.itinerary.map((stop, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full"
                >
                  {stop}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          {/* Pricing */}
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs text-gray-500 font-medium">from</span>
            <span className="text-lg md:text-xl font-bold text-gray-800 leading-none mt-0.5">
              AED {Math.floor(parseFloat(activity.price))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CruiseCard;
