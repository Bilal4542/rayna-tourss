import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { homeApi } from "../services/homeApi";
import { toCategoryRoute } from "../utils/mapping";
import {
  Star, MapPin, Clock, ChevronLeft, ChevronRight, Check, X,
  FileText, Phone, Calendar, Shield, ChevronDown, ChevronUp,
  Loader2, AlertTriangle, Ship, Users, Info, BookOpen,
} from "lucide-react";

// ─── Utility ────────────────────────────────────────────────────────────────
const categoryLabel = (slug = "") => {
  const s = (slug || "").toLowerCase();
  if (s.includes("activit") || s.includes("tour")) return "Activities";
  if (s.includes("holiday")) return "Holidays";
  if (s.includes("cruise")) return "Cruises";
  if (s.includes("visa")) return "Visas";
  return slug;
};

const TABS = {
  OVERVIEW: "Overview",
  ITINERARY: "Itinerary",
  INCLUSIONS: "Inclusions",
  VISA: "Requirements",
  FAQ: "FAQ",
  POLICY: "Policy",
};

// ─── Simple date picker calendar for direct-booking ─────────────────────────
function BookingCalendar({ price, currency = "AED" }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);
  const [guests, setGuests] = useState(1);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isPast = (d) => new Date(year, month, d) < new Date(today.setHours(0, 0, 0, 0));
  const isSelected = (d) =>
    selected?.d === d && selected?.m === month && selected?.y === year;

  const total = price && guests ? (price * guests).toLocaleString() : null;

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthName}</span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[10px] font-semibold text-gray-400 uppercase">
            {d}
          </span>
        ))}
        {/* Blank offset cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const sel = isSelected(day);
          return (
            <button
              key={day}
              disabled={past}
              onClick={() => setSelected({ d: day, m: month, y: year })}
              className={`text-xs py-1.5 rounded-lg font-medium transition-all
                ${past ? "text-gray-300 cursor-not-allowed" : "hover:bg-orange-50 cursor-pointer"}
                ${sel ? "bg-orange-500 text-white hover:bg-orange-500 shadow-md" : "text-gray-700"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Guests */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={15} className="text-gray-400" />
          <span>Guests</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="text-sm font-semibold w-4 text-center">{guests}</span>
          <button
            onClick={() => setGuests((g) => g + 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      {selected && total && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-xs text-gray-600">Total ({guests} guest{guests > 1 ? "s" : ""})</span>
          <span className="text-base font-bold text-orange-600">
            {currency} {total}
          </span>
        </div>
      )}

      <button
        disabled={!selected}
        className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all
          ${selected
            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 active:scale-[.98]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        {selected ? "Confirm Booking" : "Select a Date"}
      </button>
    </div>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors gap-4"
      >
        <span className="text-sm font-semibold text-gray-800">{question}</span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
          <div className="pt-3">{answer}</div>
        </div>
      )}
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const safeImages =
    images?.length > 0
      ? images
      : ["https://via.placeholder.com/900x500?text=No+Image"];

  // Left = index 0; Right grid = indices 1-4 (up to 4 cells shown)
  const heroImg = safeImages[0];
  const gridImgs = safeImages.slice(1, 5); // max 4 in right grid
  const extraCount = safeImages.length - 5; // images beyond what's shown

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const prevLightbox = () =>
    setLightboxIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const nextLightbox = () =>
    setLightboxIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  // Close on backdrop click / Escape
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) setLightboxOpen(false);
  };

  return (
    <>
      {/* ── Mosaic grid ──────────────────────────────────────────────────── */}
      <div className="flex gap-2 rounded-2xl overflow-hidden h-[340px] md:h-[420px] lg:h-[460px]">
        {/* Hero image — left half */}
        <div
          className="relative flex-1 cursor-pointer group overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img
            src={heroImg}
            alt="Main"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/900x500?text=No+Image";
            }}
          />
          {/* subtle dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right 2×2 grid — only shown if there are additional images */}
        {gridImgs.length > 0 && (
          <div className="flex flex-col gap-2 w-[48%]">
            {/* Top row */}
            <div className="flex gap-2 flex-1">
              {gridImgs.slice(0, 2).map((img, i) => (
                <div
                  key={i}
                  className="relative flex-1 cursor-pointer group overflow-hidden rounded-sm"
                  onClick={() => openLightbox(i + 1)}
                >
                  <img
                    src={img}
                    alt={`Photo ${i + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x250?text=Photo";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex gap-2 flex-1">
              {gridImgs.slice(2, 4).map((img, i) => {
                const globalIdx = i + 3; // 3rd and 4th grid cell = index 3 & 4
                const isLast = i === gridImgs.slice(2, 4).length - 1;
                const showOverlay = isLast && extraCount > 0;

                return (
                  <div
                    key={i}
                    className="relative flex-1 cursor-pointer group overflow-hidden rounded-sm"
                    onClick={() => openLightbox(globalIdx)}
                  >
                    <img
                      src={img}
                      alt={`Photo ${globalIdx + 1}`}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${showOverlay ? "brightness-50" : ""
                        }`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x250?text=Photo";
                      }}
                    />
                    {/* Extra count overlay on last cell */}
                    {showOverlay && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        onClick={() => openLightbox(globalIdx)}
                      >
                        <span className="text-white font-bold text-xl md:text-2xl drop-shadow">
                          + {extraCount} Images
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* View Gallery button — sits below the grid */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => openLightbox(0)}
          className="flex items-center gap-2 text-xs font-semibold text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          View Gallery ({safeImages.length} photos)
        </button>
      </div>

      {/* ── Lightbox Modal ────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleBackdrop}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-10"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIndex + 1} / {safeImages.length}
          </div>

          {/* Prev */}
          <button
            onClick={prevLightbox}
            className="absolute left-3 md:left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={safeImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/900x500?text=No+Image";
              }}
            />
          </div>

          {/* Next */}
          <button
            onClick={nextLightbox}
            className="absolute right-3 md:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto scrollbar-hide">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all
                    ${i === lightboxIndex
                      ? "border-orange-500 scale-110 shadow-lg"
                      : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── Itinerary Day Card ───────────────────────────────────────────────────────
function ItineraryDay({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-orange-50/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0">
          {item.day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Day {item.day}</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{item.title || "—"}</p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        )}
      </button>
      {expanded && item.description && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
          <p className="pt-4">{item.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  const sidebarRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    setError("");
    setProduct(null);
    homeApi
      .getProductBySlug(slug)
      .then((data) => {
        if (!data) throw new Error("Product not found.");
        setProduct(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 size={36} className="animate-spin text-orange-400" />
        <p className="text-sm font-medium">Loading product details…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle size={40} className="text-orange-400" />
        <h2 className="text-lg font-bold text-gray-800">Product Not Found</h2>
        <p className="text-sm text-gray-500 text-center max-w-xs">{error || "We couldn't find this product."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const pricing = product.pricing || {};
  const actualPrice = pricing.actualPrice ?? 0;
  const discountPrice = pricing.discountPrice;
  const currency = pricing.currency || "AED";
  const displayPrice = discountPrice ?? actualPrice;
  const hasDiscount = typeof discountPrice === "number" && discountPrice < actualPrice;
  const savePct = hasDiscount
    ? Math.round(((actualPrice - discountPrice) / actualPrice) * 100)
    : null;

  const catSlug = product.category?.slug || "";
  const catRoute = toCategoryRoute(catSlug);
  const catName = categoryLabel(catSlug);
  const hasRating = product.rating > 0 && product.reviews > 0;
  const isCruise = catRoute === "cruises";
  const isVisa = catRoute === "visas";
  const isHoliday = catRoute === "holidays";
  const isDirectBooking = product.bookingType === "direct";

  // ── Determine available tabs ───────────────────────────────────────────────
  const availableTabs = [TABS.OVERVIEW];
  if ((isCruise || isHoliday) && product.itinerary?.length > 0) availableTabs.push(TABS.ITINERARY);
  if (product.inclusions?.length > 0 || product.exclusions?.length > 0) availableTabs.push(TABS.INCLUSIONS);
  if (isVisa && (product.documentsRequired?.length > 0 || product.applicationSteps?.length > 0))
    availableTabs.push(TABS.VISA);
  if (product.faq?.length > 0) availableTabs.push(TABS.FAQ);
  if (product.guestPolicy || product.importantInformation) availableTabs.push(TABS.POLICY);

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-[97%] mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link to={`/${catRoute}`} className="hover:text-orange-500 transition-colors font-medium capitalize">
            {catName}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[97%] mx-auto px-4 py-8 space-y-6">

        {/* ── FULL-WIDTH GALLERY ──────────────────────────────────────────── */}
        <Gallery images={product.images} />

        {/* ── TWO-COLUMN CONTENT GRID ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: Title + Tabs */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title block */}
            <div className="bg-white rounded-2xl p-4">
              {/* Category + New badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                  {catName}
                </span>
                {product.isProductNew && (
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                {product.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-400" />
                    {product.location}
                  </span>
                )}
                {product.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-orange-400" />
                    {product.duration}
                  </span>
                )}
                {isCruise && product.cruiseLine && (
                  <span className="flex items-center gap-1.5">
                    <Ship size={14} className="text-orange-400" />
                    {product.cruiseLine}
                  </span>
                )}
                {isCruise && product.departureCity && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-400" />
                    Departure: {product.departureCity}
                  </span>
                )}
              </div>

              {/* Rating */}
              {hasRating && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.reviews?.toLocaleString()} Reviews
                  </span>
                </div>
              )}
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Tab nav */}
              <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 px-5 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap
                      ${activeTab === tab
                        ? "border-orange-500 text-orange-500"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6 space-y-6">

                {/* OVERVIEW TAB */}
                {activeTab === TABS.OVERVIEW && (
                  <div className="space-y-6">
                    {/* Highlights */}
                    {product.highlights?.length > 0 && (
                      <div>
                        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-orange-500 rounded-full" />
                          Tour Highlights
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {product.highlights.map((h, i) => (
                            <div key={i} className="flex gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={14} className="text-orange-500" strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                                {h.description && (
                                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{h.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content sections */}
                    {product.contentSections?.length > 0 && (
                      <div className="space-y-5">
                        {product.contentSections.map((sec, i) => (
                          <div key={i}>
                            <h3 className="text-sm font-bold text-gray-800 mb-2">{sec.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              {sec.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No content fallback */}
                    {!product.highlights?.length && !product.contentSections?.length && (
                      <p className="text-sm text-gray-400">No overview content available.</p>
                    )}
                  </div>
                )}

                {/* ITINERARY TAB */}
                {activeTab === TABS.ITINERARY && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
                      <span className="w-1 h-5 bg-orange-500 rounded-full" />
                      Day-wise Itinerary
                    </h2>
                    {product.itinerary?.length > 0 ? (
                      product.itinerary
                        .slice()
                        .sort((a, b) => a.day - b.day)
                        .map((item, i) => <ItineraryDay key={i} item={item} />)
                    ) : (
                      <p className="text-sm text-gray-400">Itinerary not available.</p>
                    )}
                  </div>
                )}

                {/* INCLUSIONS TAB */}
                {activeTab === TABS.INCLUSIONS && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    {product.inclusions?.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Check size={16} className="text-emerald-500" strokeWidth={2.5} /> Inclusions
                        </h2>
                        <ul className="space-y-2">
                          {product.inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={11} className="text-emerald-600" strokeWidth={3} />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Exclusions */}
                    {product.exclusions?.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <X size={16} className="text-red-400" strokeWidth={2.5} /> Exclusions
                        </h2>
                        <ul className="space-y-2">
                          {product.exclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                <X size={11} className="text-red-500" strokeWidth={3} />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* VISA REQUIREMENTS TAB */}
                {activeTab === TABS.VISA && (
                  <div className="space-y-8">
                    {product.documentsRequired?.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText size={16} className="text-orange-500" /> Documents Required
                        </h2>
                        <ul className="space-y-2">
                          {product.documentsRequired.map((doc, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <span className="text-orange-600 text-[10px] font-bold">{i + 1}</span>
                              </div>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.applicationSteps?.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <BookOpen size={16} className="text-orange-500" /> Application Steps
                        </h2>
                        <div className="space-y-4">
                          {product.applicationSteps
                            .slice()
                            .sort((a, b) => a.step - b.step)
                            .map((s, i) => (
                              <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    {s.step}
                                  </div>
                                  {i < product.applicationSteps.length - 1 && (
                                    <div className="w-px flex-1 bg-orange-200 mt-2" />
                                  )}
                                </div>
                                <div className="pb-5">
                                  <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                                  {s.description && (
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQ TAB */}
                {activeTab === TABS.FAQ && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <span className="w-1 h-5 bg-orange-500 rounded-full" />
                      Frequently Asked Questions
                    </h2>
                    {product.faq?.map((item, i) => (
                      <FaqItem key={i} question={item.question} answer={item.answer} />
                    ))}
                  </div>
                )}

                {/* POLICY TAB */}
                {activeTab === TABS.POLICY && (
                  <div className="space-y-6">
                    {product.guestPolicy && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Users size={15} className="text-orange-500" /> Guest Policy
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-line">
                          {product.guestPolicy}
                        </p>
                      </div>
                    )}
                    {product.importantInformation && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Info size={15} className="text-orange-500" /> Important Information
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100 whitespace-pre-line">
                          {product.importantInformation}
                        </p>
                      </div>
                    )}
                    {!product.guestPolicy && !product.importantInformation && (
                      <p className="text-sm text-gray-400">No policy information available.</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sticky Sidebar ─────────────────────────── */}
          <div className="lg:col-span-1">
            <div
              ref={sidebarRef}
              className="bg-white rounded-2xl border border-gray-200 lg:sticky lg:top-24 overflow-hidden"
            >

              {/* ── Price + CTA ───────────────────────────────────────────── */}
              <div className="p-5">
                <p className="text-xs text-gray-500 font-medium mb-1">From:</p>

                <div className="flex items-end gap-3 flex-wrap mb-1">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {currency}{" "}
                    {displayPrice?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 line-through">
                      {currency}{" "}
                      {actualPrice?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-md">
                      Save {savePct}%
                    </span>
                  </div>
                )}

                <div className="mt-4 space-y-2.5">
                  {isDirectBooking ? (
                    <BookingCalendar price={displayPrice} currency={currency} />
                  ) : (
                    <>
                      <button className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gray-900 hover:bg-gray-800 text-white active:scale-[.98] transition-all">
                        Check Availability
                      </button>
                      <a
                        href="tel:+971000000000"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 transition-all"
                      >
                        <Phone size={14} />
                        Call to Book
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-0" />

              {/* ── Why choose Rayna Tours? ───────────────────────────────── */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-5">
                  Why choose Rayna Tours?
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      emoji: "🪙",
                      title: "Best Price Guarantee",
                      desc: "Always the best deal—book with total confidence.",
                    },
                    {
                      emoji: "🛡️",
                      title: "Secure Online Transaction",
                      desc: "Your transactions are protected with advanced encryption.",
                    },
                    {
                      emoji: "💬",
                      title: "24X7 Live Chat Support",
                      desc: "Real humans, ready to help anytime.",
                    },
                    {
                      emoji: "👍",
                      title: "Happy Travelers Worldwide",
                      desc: "Trusted by millions of happy travelers.",
                    },
                  ].map(({ emoji, title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <span className="text-2xl leading-none mt-0.5 shrink-0">{emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
