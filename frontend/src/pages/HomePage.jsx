import React, { useEffect, useMemo, useState } from "react";
import ActivitySection from "../components/ActivitySection";
import ExploreMore from "../components/ExploreMore";
import MainCarousel from "../components/MainCarousel";
import { homeSlides } from "../data/carouselData";
import { homeTabs } from "../data/exploreMoreData/exploreMoreData";
import { homeApi } from "../services/homeApi";
import BestCities from "../components/BestCities";

import { mapProductToCard } from "../utils/mapping";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic banner slides — falls back to static data if DB has none
  const [bannerSlides, setBannerSlides] = useState(homeSlides);

  // Fetch banner slides from category banners
  useEffect(() => {
    homeApi
      .getBannerSlides(["activities", "activity", "tours"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
        // else keep the static fallback already set in initial state
      })
      .catch(() => {
        // On error keep static fallback — silently
      });
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        // Specifically find the activity category for the home page feature section
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
      {/* Dynamic carousel — uses category banners from DB, falls back to static slides */}
      <MainCarousel slides={bannerSlides} />
      <BestCities
        mainHeading="Best Cities to Visit"
        cardHeadingPrefix="Things to do in"
        category="activity"
      />
      {error && (
        <div className="px-4 max-w-[97%] mx-auto">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="px-4 max-w-[97%] mx-auto py-6">
          <p className="text-sm text-gray-500">Loading {activeCategory?.name || "products"}...</p>
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

      <ExploreMore tabsData={homeTabs} />
    </div>
  );
};

export default HomePage;

