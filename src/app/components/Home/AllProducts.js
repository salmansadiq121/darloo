"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { Style } from "@/app/utils/CommonStyle";
import { FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import ProductCard from "../ProductCard";
import { useAuth } from "@/app/content/authContent";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const router = useRouter();

  const productsPerPage = 20;
  const maxRetries = 3;

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Optimized fetch function with retry logic
  const fetchProducts = useCallback(
    async (page, isLoadMore) => {
      if (!isOnline) {
        setError("No internet connection. Please check your network.");
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await axios.get(
          `${productsURI}/pagination?page=${page}&limit=${productsPerPage}&isPC=true`,
          {
            signal: abortControllerRef.current.signal,
            timeout: 10000,
          }
        );

        const {
          products: newProducts,
          hasNextPage: hasMore,
          totalProducts: total,
        } = response.data;

        if (isLoadMore) {
          setProducts((prev) => {
            // Remove duplicates based on _id
            const existingIds = new Set(prev.map((p) => p._id));
            const uniqueNewProducts = newProducts.filter(
              (p) => !existingIds.has(p._id)
            );
            return [...prev, ...uniqueNewProducts];
          });
        } else {
          setProducts(newProducts);
        }

        setHasNextPage(hasMore);
        setTotalProducts(total);
        setRetryCount(0);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Error fetching products:", error);

        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            fetchProducts(page, isLoadMore);
          }, Math.pow(2, retryCount) * 1000);
        } else {
          setError(
            error.response?.status === 404
              ? "Products not found. Please try again later."
              : error.code === "NETWORK_ERROR"
              ? "Network error. Please check your connection."
              : "Failed to load products. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [isOnline, retryCount, maxRetries, productsPerPage]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const { countryCode } = useAuth();

  // Determine language based on country code
  const isGerman = countryCode === "DE";

  // Translations
  const t = {
    justForYou: isGerman ? "Nur für Sie" : "Just for You",
    viewAllProducts: isGerman ? "Alle Produkte anzeigen" : "View All Products",
    viewAll: isGerman ? "Alle ansehen" : "View All",
    noProducts: isGerman ? "Keine Produkte gefunden" : "No Products Found",
    tryAgain: isGerman ? "Erneut versuchen" : "Try Again",
    adjustFilters: isGerman
      ? "Passen Sie Ihre Filter an oder versuchen Sie es später erneut."
      : "Try adjusting your filters or check back later.",
    loadingMore: isGerman
      ? "Weitere Produkte werden geladen..."
      : "Loading more products...",
  };

  // Load more products when scrolling to bottom
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasNextPage || error) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true);
  }, [currentPage, hasNextPage, isLoadingMore, error, fetchProducts]);

  // Intersection Observer for infinite scroll
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const target = entries[0];
  //       if (target.isIntersecting && hasNextPage && !isLoadingMore) {
  //         loadMoreProducts();
  //       }
  //     },
  //     {
  //       threshold: 0.1,
  //       rootMargin: "100px", // Start loading 100px before reaching the bottom
  //     }
  //   );

  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [loadMoreProducts, hasNextPage, isLoadingMore]);

  // Retry function
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setCurrentPage(1);
    setProducts([]);
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Memoized skeleton loader
  const SkeletonLoader = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4 px-4 sm:px-0">
        {Array.from({ length: productsPerPage }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ),
    [productsPerPage]
  );

  // Memoized products grid - Desktop
  const ProductsGridDesktop = useMemo(
    () => (
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-3 auto-rows-fr">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="h-full"
            >
              <ProductCard
                product={product}
                sale={true}
                tranding={true}
                isDesc={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ),
    [products]
  );

  // Memoized products carousel - Mobile
  const ProductsCarouselMobile = useMemo(
    () => (
      <div className="sm:hidden relative">
        <div
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-shrink-0 w-[85vw] snap-start"
            >
              <ProductCard
                product={product}
                sale={true}
                tranding={true}
                isDesc={true}
              />
            </motion.div>
          ))}
        </div>
        {/* Scroll Indicator */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {products
              .slice(0, Math.min(5, products.length))
              .map((_, index) => (
                <div
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-gray-300"
                />
              ))}
          </div>
        )}
      </div>
    ),
    [products]
  );

  return (
    <div className="py-5 bg-transparent text-black z-10 w-full min-h-[80vh] flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="container mx-auto px-4 mb-8">
            <h1
              className={`${Style.h1} flex items-center gap-1 text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent`}
            >
              {t.justForYou}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {!isOnline && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <WifiOff className="w-4 h-4" />
              <span>Offline</span>
            </div>
          )}
          {totalProducts > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {products.length} of {totalProducts}
            </span>
          )}
        </div>

        <button
          onClick={() => router.push("/products")}
          className="text-black font-medium text-[17px] cursor-pointer flex items-center gap-1 hover:gap-2 transition-all duration-300"
        >
          {t.viewAll}
          <span className="p-1 rounded-full bg-gray-500 hover:bg-gray-900 transition-all duration-300 cursor-pointer">
            <FaArrowRight size={17} className="text-white" />
          </span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-red-600">
            <FaExclamationTriangle className="w-5 h-5" />
            <span className="font-medium">Something went wrong</span>
          </div>
          <p className="text-red-700 text-center">{error}</p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Retrying..." : t.tryAgain}
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mt-10"
        >
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="No products found"
            width={200}
            height={200}
            className="w-64 h-64 opacity-50"
          />
          <h3 className="text-lg font-semibold mt-4 text-gray-600">
            {t.noProducts}
          </h3>
          <p className="text-gray-500">{t.adjustFilters}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && products.length === 0 && SkeletonLoader}

      {/* Products Grid - Desktop */}
      {!isLoading && !error && products.length > 0 && ProductsGridDesktop}

      {/* Products Carousel - Mobile */}
      {!isLoading && !error && products.length > 0 && ProductsCarouselMobile}

      {/* Load More Indicator */}
      {isLoadingMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span className="text-gray-600 font-medium">{t.loadingMore}</span>
          </div>
        </motion.div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerRef} className="h-1" />
    </div>
  );
}
