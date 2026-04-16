import React, { useState, useEffect, useMemo } from 'react'
import MainCarousel from '../components/MainCarousel'
import { homeSlides } from '../data/carouselData'
import BestCities from '../components/BestCities'
import ActivitySection from '../components/ActivitySection'
import ExploreMore from '../components/ExploreMore'
import { homeTabs } from '../data/exploreMoreData/exploreMoreData'
import { homeApi } from '../services/homeApi'
import { mapProductToCard } from '../utils/mapping'

const Activities = () => {
  const [bannerSlides, setBannerSlides] = useState(homeSlides);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch banners
  useEffect(() => {
    homeApi
      .getBannerSlides(["activities", "activity", "tours"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
      })
      .catch(() => {});
  }, []);

  // Fetch categories and find Activity Category
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        // Specifically find the activity category
        const activityCat = fetched.find(c => 
          c.slug.toLowerCase().includes("activity") || 
          c.name.toLowerCase().includes("activity") ||
          c.slug.toLowerCase().includes("tour")
        );
        if (activityCat) {
          setActiveCategoryId(activityCat._id);
        } else if (fetched.length > 0) {
          setActiveCategoryId(fetched[0]._id);
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
        cardHeadingPrefix="Things to do in"
        category="activity"
      />
      
      {error && (
        <div className="px-4 max-w-[97%] mx-auto mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && activeCategoryId ? (
        <div className="px-4 max-w-[97%] mx-auto py-12">
          <p className="text-sm text-gray-500 animate-pulse">Finding activities in your favorite cities...</p>
        </div>
      ) : (
        groupedByCity
          .filter((group) => Array.isArray(group.products) && group.products.length > 0)
          .map((group) => (
            <ActivitySection
              key={group.cityId || group.cityName}
              title={`Best ${activeCategory?.name || "Activities"} in ${group.cityName}`}
              activities={group.products.map(mapProductToCard)}
            />
          ))
      )}

      {!loading && groupedByCity.length === 0 && !error && activeCategoryId && (
        <div className="px-4 max-w-[97%] mx-auto py-12 text-center text-gray-400">
           <p>No activities found at the moment. Try checking another category!</p>
        </div>
      )}

      <ExploreMore tabsData={homeTabs} />
    </div>
  )
}

export default Activities
