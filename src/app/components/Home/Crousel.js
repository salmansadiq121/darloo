"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { bannersUri } from "@/app/utils/ServerURI";
import axios from "axios";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  TrendingUp,
  Eye,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/content/authContent";

// Country List
const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function Crousel({ products, loading }) {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { countryCode } = useAuth();

  // Fetch Banner Data
  const fetchBannerData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${bannersUri}/list`);
      setBannerData(data.banners);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    // Wait for DOM to be ready and Swiper to initialize
    let handlePrevClick = null;
    let handleNextClick = null;
    let prevBtn = null;
    let nextBtn = null;

    const setupNavigation = () => {
      prevBtn = document.querySelector(".custom-prev");
      nextBtn = document.querySelector(".custom-next");
      const swiperPrev = document.querySelector(".swiper-button-prev");
      const swiperNext = document.querySelector(".swiper-button-next");

      if (!prevBtn || !nextBtn || !swiperPrev || !swiperNext) {
        return false;
      }

      handlePrevClick = () => {
        if (swiperPrev) {
          swiperPrev.click();
        }
      };

      handleNextClick = () => {
        if (swiperNext) {
          swiperNext.click();
        }
      };

      prevBtn.addEventListener("click", handlePrevClick);
      nextBtn.addEventListener("click", handleNextClick);

      return true;
    };

    // Use setTimeout to ensure Swiper is initialized
    const timeoutId = setTimeout(() => {
      setupNavigation();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (prevBtn && handlePrevClick) {
        prevBtn.removeEventListener("click", handlePrevClick);
      }
      if (nextBtn && handleNextClick) {
        nextBtn.removeEventListener("click", handleNextClick);
      }
    };
  }, []);

  return (
    <div className="w-full  pb-4 mt-0 sm:mt-2 px-0 z-[10] relative">
      {isLoading ? (
        <div className="animate-pulse flex justify-center items-center bg-gray-300/70 h-[220px] sm:h-[400px] rounded-lg p-6">
          <div className=" bg-gray-500/70 rounded-lg animate-pulse w-full h-full"></div>
        </div>
      ) : (
        <div className="w-full relative grid grid-cols-4 gap-4">
          <div className=" col-span-4 sm:col-span-3 w-full relative h-[200px] sm:h-[400px]">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="w-full h-full"
            >
              {bannerData.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative flex flex-col md:flex-row bg-green-900 text-white overflow-hidden items-center justify-between rounded-lg h-full">
                    <Image
                      src={banner.image}
                      alt="Banner Image"
                      width={1000}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Buttons */}
            <button
              className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 text-red-600 w-[2rem] h-[2.2rem] flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
              style={{
                clipPath:
                  " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
              aria-label="Previous slide"
              suppressHydrationWarning
            >
              <span aria-hidden="true">❮</span>
            </button>
            <button
              className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 w-[2rem] h-[2.2rem] text-red-600  flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
              style={{
                clipPath:
                  " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
              aria-label="Next slide"
              suppressHydrationWarning
            >
              <span aria-hidden="true">❯</span>
            </button>
          </div>
          <div className="col-span-4 sm:col-span-1 h-[200px] sm:h-[400px]">
            <TrendingProducts
              products={products}
              loading={loading}
              countryCode={countryCode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="bg-white p-2 animate-pulse">
    <div className="bg-gray-300 aspect-square rounded-sm mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-gray-200"></div>
      ))}
    </div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const GridProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 aspect-square"></div>
    <div className="p-2">
      <div className="h-3 bg-gray-200 rounded-full w-2/3 mx-auto"></div>
    </div>
  </div>
);

const TrendingProducts = ({ products, loading, countryCode }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Determine language (English by default)
  const isGerman = countryCode === "DE";

  // Translations
  const t = {
    topTrends: isGerman ? "Top-Trends" : "Top Trends",
    viewAll: isGerman ? "Alle ansehen" : "View All",
    noTrendingProducts: isGerman
      ? "Keine angesagten Produkte gefunden"
      : "No trending products found",
    browseAll: isGerman ? "Alle Produkte anzeigen" : "Browse all products",
    hot: isGerman ? "Heiß 🔥" : "Hot 🔥",
    popular: isGerman ? "Beliebt" : "Popular",
    trending: isGerman ? "Trend" : "Trending",
    new: isGerman ? "Neu" : "New",
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discountPercentage) =>
    price - (price * discountPercentage) / 100;

  // Format price (symbol based on country)
  const formatPrice = (price) =>
    `${countryCode === "DE" ? "€" : "€"}${price.toFixed(2)}`;

  const getTrendingStatus = (product) => {
    if (!product)
      return { text: t.new, color: "text-blue-500", bg: "bg-blue-500/20" };
    const purchaseRate = (product.purchased / product.quantity) * 100;

    if (purchaseRate > 50)
      return { text: t.hot, color: "text-red-600", bg: "bg-red-500/20" };
    if (purchaseRate > 30)
      return {
        text: t.popular,
        color: "text-orange-500",
        bg: "bg-orange-500/20",
      };
    if (product.trending)
      return {
        text: t.trending,
        color: "text-purple-600",
        bg: "bg-purple-500/20",
      };
    return { text: t.new, color: "text-blue-500", bg: "bg-blue-500/20" };
  };

  const renderRatings = (rating) => {
    if (!rating && rating !== 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center justify-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={10}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={10} className="text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={10} className="text-gray-300" />
        ))}
        <span className="ml-1 text-[9px] text-gray-500 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full backdrop-blur-sm bg-white/95 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <TrendingUp size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {t.topTrends}
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center text-white/90 text-sm font-medium hover:text-white hover:underline transition-all duration-200 group/link"
        >
          {t.viewAll}
          <ChevronRight
            size={16}
            className="ml-0.5 group-hover/link:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      <div className="bg-gradient-to-br from-gray-50/50 to-white p-3 flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, index) => (
              <GridProductSkeleton key={index} />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-red-600 mb-3 p-3 bg-red-50 rounded-full">
              <ShoppingCart size={32} />
            </div>
            <p className="text-sm text-gray-700 mb-3 font-medium">
              {t.noTrendingProducts}
            </p>
            <Link
              href="/products"
              className="text-xs text-red-700 flex items-center hover:text-red-800 hover:underline font-semibold transition-colors"
            >
              {t.browseAll} <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-4"
            style={{ gridAutoRows: "1fr" }}
          >
            {products.slice(0, 6).map((product, index) => {
              if (!product) return null;
              const discountedPrice = product.sale?.isActive
                ? getDiscountedPrice(
                    product.price,
                    product.sale.discountPercentage
                  )
                : product.price;
              const trendingStatus = getTrendingStatus(product);
              const isHovered = hoveredProduct === product._id;
              const isOutOfStock = !product?.quantity || product?.quantity <= 0;

              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="block h-full"
                >
                  <motion.div
                    className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer h-full w-full flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500"
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    {/* Image Container - Always Visible */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                      <figure className="relative w-full h-full">
                        <Image
                          src={product?.thumbnails || "/placeholder.svg"}
                          alt={product?.name || "Product image"}
                          fill
                          className={`object-cover transition-all duration-700 ease-out ${
                            isHovered ? "scale-125 brightness-110" : "scale-100"
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Gradient Overlay - Appears on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        />

                        {/* Trending Badge */}
                        <motion.div
                          className={`absolute top-2 left-2 ${trendingStatus.bg} backdrop-blur-md ${trendingStatus.color} text-[8px] font-bold px-2 py-1 rounded-full border border-white/30 shadow-lg`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          ↗ {trendingStatus.text}
                        </motion.div>

                        {/* Discount Badge or Out of Stock Badge */}
                        {isOutOfStock ? (
                          <motion.div
                            className="absolute top-2 right-2 bg-gradient-to-br from-gray-700 to-gray-800 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15 }}
                          >
                            {isGerman ? "Ausverkauft" : "Sold Out"}
                          </motion.div>
                        ) : product.sale?.isActive ? (
                          <motion.div
                            className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/30"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            -{product.sale.discountPercentage}%
                          </motion.div>
                        ) : null}

                        {/* Quick View Button - Shows on Hover */}
                        <motion.div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                          initial={{ y: 20 }}
                          animate={{ y: isHovered ? 0 : 20 }}
                        >
                          <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-2xl border border-white/50">
                            <Eye size={18} className="text-red-600" />
                          </div>
                        </motion.div>
                      </figure>
                    </div>

                    {/* Details Overlay - Slides up on hover */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/90 to-transparent backdrop-blur-md transition-all duration-500 ${
                        isHovered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-full opacity-0"
                      }`}
                      style={{ paddingTop: "60%" }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                        {/* Product Name */}
                        <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                          {product?.name || "Product Name"}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center justify-center">
                            {renderRatings(product.rating)}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span className="font-bold text-white text-sm">
                            {formatPrice(discountedPrice)}
                          </span>
                          {product.sale?.isActive && (
                            <span className="text-[10px] text-gray-300 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Quick Add Button */}
                        <motion.button
                          className={`w-full text-xs font-bold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-lg ${
                            isOutOfStock
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-white text-red-600 hover:bg-red-50"
                          }`}
                          whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                          whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <ShoppingCart size={14} />
                          {isOutOfStock
                            ? (isGerman ? "Nicht verfügbar" : "Out of Stock")
                            : (isGerman ? "Hinzufügen" : "Quick Add")}
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
