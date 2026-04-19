import React, { useState, useEffect, useMemo } from 'react'
import { visaSlides } from '../data/carouselData'
import MainCarousel from '../components/MainCarousel'
import ActivitySection from '../components/ActivitySection'
import ExploreMore from '../components/ExploreMore'
import { visaTabs } from '../data/exploreMoreData/exploreMoreData'
import { homeApi } from '../services/homeApi'
import { mapProductToCard } from '../utils/mapping'

const Visas = () => {
  const [bannerSlides, setBannerSlides] = useState(visaSlides);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    homeApi
      .getBannerSlides(["visas", "visa"])
      .then((slides) => {
        if (slides.length > 0) setBannerSlides(slides);
      })
      .catch(() => {});
  }, []);

  // Fetch categories and find Visa Category
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        const visaCat = fetched.find(c => 
          c.slug.toLowerCase().includes("visa") || 
          c.name.toLowerCase().includes("visa")
        );
        if (visaCat) {
          setActiveCategoryId(visaCat._id);
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
      
      {error && (
        <div className="px-4 max-w-[97%] mx-auto mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && activeCategoryId ? (
        <div className="px-4 max-w-[97%] mx-auto py-12">
          <p className="text-sm text-gray-500 animate-pulse">Loading {activeCategory?.name || "Visa"} options...</p>
        </div>
      ) : (
        groupedByCity.map((group) => (
          <ActivitySection 
            key={group.cityId || group.cityName}
            title={group.cityName.toLowerCase() === "global" ? 'Apply for Your Visa Hassle-Free' : `Best ${activeCategory?.name || "Visas"} in ${group.cityName}`}
            desc={group.cityName.toLowerCase() === "global" ? 'Skip long queues—apply for your visa online effortlessly from anywhere.' : `Fast, easy, and secure international visa application.`}
            activities={group.products.map(mapProductToCard)} 
            isGrid={true} 
            hidePricing={true} 
          />
        ))
      )}

      {!loading && groupedByCity.length === 0 && !error && activeCategoryId && (
        <div className="px-4 max-w-[97%] mx-auto py-12 text-center text-gray-400">
           <p>No visa services found at the moment.</p>
        </div>
      )}

      <ExploreMore tabsData={visaTabs}/>
    </div>
  )
}

export default Visas
