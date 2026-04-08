import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import TabIcon from './TabIcon';

const ExploreMore = ({ tabsData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);
  
  // State to manage arrow visibility
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Show left arrow if we have scrolled at least 1 pixel to the right
      setShowLeftBtn(scrollLeft > 0);
      // Show right arrow if there is still content left to scroll to the right
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Run checkScroll once on mount to handle initial state
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <section className="py-12 px-4 max-w-[97%] mx-auto border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Explore more with us</h2>

      <div className="relative border-b border-gray-200 mb-8 group">
        
        {/* LEFT ARROW - Only shown if showLeftBtn is true */}
        {showLeftBtn && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-3/4 z-10 bg-white shadow-lg border border-gray-100 p-2 rounded-full hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
        )}

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-2 transition-all"
        >
          {tabsData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center pb-2 text-sm font-medium cursor-pointer whitespace-nowrap border-b-2 transition-all ${
                activeTab === index 
                ? 'border-gray-800 text-gray-900' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span><TabIcon name={tab.icon} /></span>
              <span className='font-heading text-secondary border-primary bg-primary'>{tab.tabHeading}</span>
            </button>
          ))}
        </div>

        {/* RIGHT ARROW - Only shown if showRightBtn is true */}
        {showRightBtn && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-3/4 z-10 bg-white shadow-lg border border-gray-100 p-2 rounded-full hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Sublinks Grid remains the same */}
      <div className="flex flex-wrap gap-3">
        {tabsData[activeTab].links.map((link, idx) => (
          <a
            key={idx}
            href={link.url || "#"}
            className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-normal"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ExploreMore;