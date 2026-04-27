import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowLeft, Sparkles, MapPin, 
  Binoculars, Palmtree, CreditCard, Ship, 
  ChevronRight, X, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeApi } from '../services/homeApi';
import { toCategoryRoute } from '../utils/mapping';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Activities');
  const [cities, setCities] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const categoryIcons = {
    'Activities': Binoculars,
    'Holidays': Palmtree,
    'Visas': CreditCard,
    'Cruises': Ship,
  };

  const quickSuggestions = [
    "Things to do in Dubai",
    "Top attractions in Abu Dhabi",
    "Best experiences in UAE for tourists",
    "Dubai activities for couples",
    "Places to visit in Dubai in 3 days",
    "What to do in Ras Al Khaimah"
  ];

  // Fetch all categories once to map IDs
  useEffect(() => {
    if (isOpen) {
      homeApi.getCategories().then(setAllCategories).catch(console.error);
    }
  }, [isOpen]);

  // Fetch category-specific data when tab changes
  useEffect(() => {
    if (isOpen && allCategories.length > 0) {
      fetchCategoryData();
    }
  }, [isOpen, activeCategory, allCategories]);

  // Handle Search Suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        handleLiveSearch();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const category = allCategories.find(c => 
        c.name.toLowerCase().includes(activeCategory.toLowerCase().replace('s', ''))
      );
      
      const params = { limit: 10 };
      if (category) params.category = category._id;

      const [citiesData, productsData] = await Promise.all([
        homeApi.getCities(), // Ideally this would be filtered by category too if API supported it
        homeApi.getProducts(params)
      ]);

      // Filter cities that have products in this category if possible, 
      // or just show top cities for now as per screenshot
      setCities(citiesData.slice(0, 10));
      setTrendingProducts(productsData.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch category data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveSearch = async () => {
    setSearching(true);
    try {
      const results = await homeApi.getProducts({ search: searchQuery, limit: 5 });
      setSuggestions(results);
    } catch (error) {
      console.error("Live search failed", error);
    } finally {
      setSearching(false);
    }
  };

  const getHeadings = () => {
    switch (activeCategory) {
      case 'Cruises':
        return { 
          loc: 'Cruises from', 
          prod: 'Special Saver Cruise Packages',
          moreLoc: 18,
          moreProd: 4
        };
      case 'Visas':
        return { 
          loc: 'Visa Services in', 
          prod: 'Popular Visa Packages',
          moreLoc: 5,
          moreProd: 8
        };
      case 'Holidays':
        return { 
          loc: 'Holidays in', 
          prod: 'Best Selling Holiday Deals',
          moreLoc: 12,
          moreProd: 6
        };
      default:
        return { 
          loc: 'Things to do in', 
          prod: 'Trending Activities',
          moreLoc: 12,
          moreProd: 4
        };
    }
  };

  const headings = getHeadings();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[81px] inset-x-0 bottom-0 z-[999] bg-white overflow-y-auto"
        >
          {/* Header Section */}
          <div className="sticky top-0 bg-white z-20 pb-4">
            <div className="max-w-[1200px] mx-auto px-6 pt-6">
              
              {/* Search Input Bar */}
              <div className="relative group">
                <div className="flex items-center gap-4 bg-white border-2 border-gray-900 rounded-[14px] px-4 py-3 shadow-sm transition-all focus-within:shadow-md">
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={22} />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Search for</span>
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={activeCategory}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-300 text-base"
                    />
                  </div>
                  {searching ? (
                    <Loader2 size={20} className="text-orange-500 animate-spin" />
                  ) : (
                    <button className="text-gray-400 hover:text-gray-600">
                      <Sparkles size={20} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {searchQuery.trim().length > 1 && suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {suggestions.map((item) => (
                          <Link
                            key={item._id}
                            to={`/${toCategoryRoute(item.category?.slug)}/${item.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <img src={item.images?.[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> {item.city?.name || item.manualCity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-gray-900">AED {item.pricing?.fromPrice}</p>
                              <ChevronRight size={14} className="text-gray-300 ml-auto" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-4">
                {quickSuggestions.map((text, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSearchQuery(text)}
                    className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {text} <Sparkles size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 mt-2 border-b border-gray-100">
                {Object.keys(categoryIcons).map((name) => {
                  const Icon = categoryIcons[name];
                  return (
                    <button
                      key={name}
                      onClick={() => setActiveCategory(name)}
                      className={`flex items-center gap-2 pb-3 transition-all relative
                        ${activeCategory === name 
                          ? 'text-gray-900 font-bold' 
                          : 'text-gray-400 font-medium hover:text-gray-600'
                        }`}
                    >
                      <Icon size={18} className={activeCategory === name ? 'text-gray-900' : 'text-gray-400'} />
                      <span className="text-[15px]">{name}</span>
                      {activeCategory === name && (
                        <motion.div 
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full" 
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="max-w-[1200px] mx-auto px-6 py-4 space-y-8">
            
            {/* Cities/Locations Section */}
            <section className={loading ? 'opacity-50 pointer-events-none' : ''}>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4">{headings.loc}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-4">
                {cities.map((city) => (
                  <Link 
                    key={city._id} 
                    to={`/activity?city=${city._id}`}
                    onClick={onClose}
                    className="group flex items-start gap-3 p-1 rounded-xl transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <MapPin size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-black transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {city.country_name || 'UAE'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="mt-6 text-[12px] font-extrabold text-gray-500 hover:text-gray-900 flex items-center gap-1 group transition-colors">
                See {headings.moreLoc} more <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </section>

            {/* Products Section */}
            <section className={loading ? 'opacity-50 pointer-events-none' : ''}>
              <h2 className="text-[18px] font-black text-[#1A1A1A] mb-4">{headings.prod}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
                {trendingProducts.map((product) => {
                  const savePct = product.pricing?.actualPrice && product.pricing?.fromPrice 
                    ? Math.round(((product.pricing.actualPrice - product.pricing.fromPrice) / product.pricing.actualPrice) * 100)
                    : 0;

                  return (
                    <Link 
                      key={product._id} 
                      to={`/${toCategoryRoute(product.category?.slug)}/${product.slug}`}
                      onClick={onClose}
                      className="group flex gap-4"
                    >
                      <div className="w-[100px] h-[100px] rounded-[14px] overflow-hidden bg-gray-50 shrink-0 relative border border-gray-100">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/120'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-1 pt-1 flex flex-col justify-center">
                        <h3 className="text-[14px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-black transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                          <span className="text-[11px] text-gray-400 font-medium">from</span>
                          {product.pricing?.actualPrice && (
                            <span className="text-[11px] text-gray-400 line-through font-medium">
                              AED {product.pricing.actualPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-black text-gray-900">
                            AED {product.pricing?.fromPrice?.toLocaleString()}
                          </span>
                          {savePct > 0 && (
                            <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md">
                              Save {savePct}%
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <button className="mt-10 text-[14px] font-extrabold text-gray-500 hover:text-gray-900 flex items-center gap-1 group transition-colors">
                See {headings.moreProd} more <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </section>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
