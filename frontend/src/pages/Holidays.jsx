import React, { useState, useEffect, useMemo } from 'react'
import MainCarousel from '../components/MainCarousel'
import { holidaySlides } from '../data/carouselData'
import BestCities from '../components/BestCities'
import ActivitySection from '../components/ActivitySection'
import ExploreMore from '../components/ExploreMore'
import { holidayTabs } from '../data/exploreMoreData/exploreMoreData'
import { homeApi } from '../services/homeApi'
import { mapProductToCard } from '../utils/mapping'

const Holidays = () => {
  const [bannerSlides, setBannerSlides] = useState(holidaySlides);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch banners
  useEffect(() => {
    homeApi
      .getBannerSlides(["holidays", "holiday"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
      })
      .catch(() => {});
  }, []);

  // Fetch categories and find Holidays Category
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        // Find holiday category index
        const holidayCat = fetched.find(c => 
          c.slug.toLowerCase().includes("holiday") || 
          c.name.toLowerCase().includes("holiday")
        );
        if (holidayCat) {
          setActiveCategoryId(holidayCat._id);
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
      <MainCarousel slides={bannerSlides}/>
      <BestCities
        mainHeading="Best Cities to Visit"
        cardHeadingPrefix="Holidays Packages in"
        category="holiday"
      />
      
      {error && (
        <div className="px-4 max-w-[97%] mx-auto mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && activeCategoryId ? (
        <div className="px-4 max-w-[97%] mx-auto py-12">
          <p className="text-sm text-gray-500 animate-pulse">Loading {activeCategory?.name || "Holidays"} packages...</p>
        </div>
      ) : (
        groupedByCity
          .filter((group) => Array.isArray(group.products) && group.products.length > 0)
          .map((group) => (
            <ActivitySection
              key={group.cityId || group.cityName}
              title={`Best ${activeCategory?.name || "Holidays"} in ${group.cityName}`}
              activities={group.products.map(mapProductToCard)}
            />
          ))
      )}

      {!loading && groupedByCity.length === 0 && !error && activeCategoryId && (
        <div className="px-4 max-w-[97%] mx-auto py-12 text-center text-gray-400">
           <p>No holiday packages found at the moment.</p>
        </div>
      )}

      <ExploreMore tabsData={holidayTabs} />
    </div>
  )
}

export default Holidays
