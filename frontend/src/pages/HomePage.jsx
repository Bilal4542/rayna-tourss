import React, { useEffect, useMemo, useState } from "react";
import ActivitySection from "../components/ActivitySection";
import ExploreMore from "../components/ExploreMore";
import MainCarousel from "../components/MainCarousel";
import { homeSlides } from "../data/carouselData";
import { homeTabs } from "../data/exploreMoreData/exploreMoreData";
import { homeApi } from "../services/homeApi";

const mapProductToCard = (product) => {
  const discountPrice = product?.pricing?.discountPrice;
  const actualPrice = product?.pricing?.actualPrice;
  const price = discountPrice ?? actualPrice ?? product?.pricing?.fromPrice ?? 0;

  let discountPercentage = undefined;
  if (
    typeof discountPrice === "number" &&
    typeof actualPrice === "number" &&
    actualPrice > 0 &&
    discountPrice < actualPrice
  ) {
    discountPercentage = Math.round(((actualPrice - discountPrice) / actualPrice) * 100);
  }

  return {
    title: product.name,
    image: product.images?.[0] || "https://via.placeholder.com/600x400?text=Rayna+Tours",
    price,
    originalPrice: actualPrice,
    discountPercentage,
  };
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError("");
        const fetched = await homeApi.getCategories();
        setCategories(fetched);
        if (fetched.length > 0) {
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
      <MainCarousel slides={homeSlides} />

      <section className="py-6 px-4 max-w-[97%] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
            Explore by Category
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setActiveCategoryId(category._id)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                activeCategoryId === category._id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

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
