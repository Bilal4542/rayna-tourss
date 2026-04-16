import React, { useState, useEffect, useMemo } from 'react';
import MainCarousel from '../components/MainCarousel';
import { cruiseSlides } from '../data/carouselData';
import BestCities from '../components/BestCities';
import CruiseSection from '../components/CruiseSection';
import ExploreMore from '../components/ExploreMore';
import { cruiseTabs } from '../data/exploreMoreData/exploreMoreData';
import { homeApi } from '../services/homeApi';
import { mapProductToCard } from '../utils/mapping';

const Cruise = () => {
  const [bannerSlides, setBannerSlides] = useState(cruiseSlides);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    homeApi
      .getBannerSlides(["cruises", "cruise"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
      })
      .catch(() => {});
  }, []);

  // Fetch categories and find Cruise Category
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        const cruiseCat = fetched.find(c => 
          c.slug.toLowerCase().includes("cruise") || 
          c.name.toLowerCase().includes("cruise")
        );
        if (cruiseCat) {
          setActiveCategoryId(cruiseCat._id);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadCategories();
  }, []);

  // Fetch products for active category
  useEffect(() => {
    if (!activeCategoryId) return;

    const loadGroupedProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await homeApi.getProductsGroupedByCity(activeCategoryId);
        setGroupedByCity(result.groupedByCity || []);
      } catch (err) {
        setError(err.message);
        setGroupedByCity([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroupedProducts();
  }, [activeCategoryId]);

  const activeCategory = useMemo(
    () => categories.find((item) => item._id === activeCategoryId),
    [categories, activeCategoryId]
  );

  return (
    <div>
      <MainCarousel slides={bannerSlides} />
      <BestCities
        mainHeading="Explore Cruises by Departure City"
        cardHeadingPrefix="Cruises from"
        category="cruise"
      />

      {error && (
        <div className="px-4 max-w-[97%] mx-auto mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && activeCategoryId ? (
        <div className="px-4 max-w-[97%] mx-auto py-12">
          <p className="text-sm text-gray-500 animate-pulse">Searching for the best {activeCategory?.name || "Cruise"} deals...</p>
        </div>
      ) : (
        groupedByCity
          .filter((group) => Array.isArray(group.products) && group.products.length > 0)
          .map((group) => (
            <CruiseSection 
              key={group.cityId || group.cityName}
              title={`${group.cityName} ${activeCategory?.name || "Cruise"} Packages`} 
              activities={group.products.map(mapProductToCard)} 
            />
          ))
      )}

      {!loading && groupedByCity.length === 0 && !error && activeCategoryId && (
        <div className="px-4 max-w-[97%] mx-auto py-12 text-center text-gray-400">
           <p>No cruise packages found at the moment.</p>
        </div>
      )}

      <ExploreMore tabsData={cruiseTabs} />
    </div>
  );
};

export default Cruise;
