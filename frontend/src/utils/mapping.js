/**
 * Universal mapper to convert backend product objects into the props expected by the TourCard component.
 * Supports activity, holiday, visa, and cruise variants.
 */
export const mapProductToCard = (product) => {
  if (!product) return {};

  const pricing = product.pricing || {};
  const discountPrice = pricing.discountPrice;
  const actualPrice = pricing.actualPrice;
  const fromPrice = pricing.fromPrice;

  // Primary price (discount > actual > fromPrice)
  const price = discountPrice ?? actualPrice ?? fromPrice ?? 0;

  let discountPercentage = undefined;
  if (
    typeof discountPrice === "number" &&
    typeof actualPrice === "number" &&
    actualPrice > 0 &&
    discountPrice < actualPrice
  ) {
    discountPercentage = Math.round(((actualPrice - discountPrice) / actualPrice) * 100);
  }

  // Handle images (array or single string)
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image]
    : [];

  return {
    title: product.name || "",
    image: images,
    price,
    originalPrice: actualPrice,
    discountPercentage,
    rating: product.rating,
    reviews: product.reviews,
    isNew: product.isProductNew,
    // Cruise-specific fields
    shipName: product.cruiseLine,
    departure: product.departureCity,
    duration: product.duration,
    departures: product.departures,
    itinerary: product.itinerary,
  };
};
