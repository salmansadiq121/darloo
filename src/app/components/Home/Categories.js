"use client";

import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AdvancedDualMarqueeCategories({
  categoriesData,
  isLoading,
}) {
  const [products, setProducts] = useState(categoriesData || []);
  const observer = useRef();
  const router = useRouter();
  const { countryCode } = useAuth();

  useEffect(() => {
    setProducts(categoriesData);
  }, [categoriesData]);

  // Split products into two arrays for dual marquee
  const splitProducts = () => {
    if (!products || products.length === 0)
      return { firstRow: [], secondRow: [] };

    const mid = Math.ceil(products.length / 2);
    return {
      firstRow: products.slice(0, mid),
      secondRow: products.slice(mid),
    };
  };

  const { firstRow, secondRow } = splitProducts();

  // Hide Product & Move to End
  const hideProduct = (index) => {
    setProducts((prev) => {
      const updated = [...prev];
      const hiddenItem = updated.splice(index, 1)[0];
      return [...updated, hiddenItem];
    });
  };

  // Infinite Scroll
  const lastItemRef = (node) => {
    if (isLoading || !node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreProducts();
      }
    });
    observer.current.observe(node);
  };

  // Simulated API Fetch (Load More)
  const loadMoreProducts = () => {
    setTimeout(() => {
      setProducts((prev) => [...prev, ...categoriesData]);
    }, 1000);
  };

  // Filter By Category
  const handleCategoryClick = (id) => {
    router.push(`/products?category=${id}`);
  };

  // Determine language based on country code
  const isGerman = countryCode === "DE";

  // Translations
  const t = {
    explorePopularCategories: isGerman
      ? "Beliebte Kategorien erkunden"
      : "Explore Popular Categories",
    firstMarquee: isGerman ? "Erstes Marquee" : "First Marquee",
    secondMarquee: isGerman ? "Zweites Marquee" : "Second Marquee",
    loading: isGerman ? "Wird geladen..." : "Loading...",
  };

  // Loading skeleton component
  const LoadingSkeleton = ({ count = 8 }) => (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-3 min-w-fit mx-4"
        >
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
          </div>
          <div className="w-16 h-3 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      ))}
    </>
  );

  // Category item component
  const CategoryItem = ({ category, index, isLastItem = false }) => (
    <div
      ref={isLastItem ? lastItemRef : null}
      onClick={() => handleCategoryClick(category._id)}
      className="flex flex-col items-center gap-3 min-w-fit mx-4 cursor-pointer group transform transition-all duration-500 hover:scale-110"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        {/* Main image container */}
        <div className="relative w-16 h-16 md:w-19 md:h-19 rounded-full overflow-hidden shadow-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-red-400 group-hover:to-pink-400 transition-all duration-500">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            width={96}
            height={96}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Inner ring */}
          <div className="absolute inset-1 border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700"></div>
      </div>

      {/* Category name */}
      <p className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-red-600 transition-all duration-300 text-center max-w-20 truncate">
        {category.name}
      </p>
    </div>
  );

  return (
    <div className="w-full py-8 z-10 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-transparent to-pink-50/30 pointer-events-none"></div>

      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1
          className={`${Style.h1} text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent`}
        >
          {t.explorePopularCategories}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="space-y-8">
        {/* First Marquee Row - Moving Left to Right */}
        <div className="relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 w-32 h-full   hidden sm:block bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full hidden sm:block bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-left hover:pause-animation">
              {isLoading ? (
                <LoadingSkeleton count={8} />
              ) : (
                <>
                  {firstRow.map((category, index) => (
                    <CategoryItem
                      key={`first-${category._id}-${index}`}
                      category={category}
                      index={index}
                      isLastItem={index === firstRow.length - 1}
                    />
                  ))}
                  {/* Duplicate for seamless loop */}
                  {firstRow.map((category, index) => (
                    <CategoryItem
                      key={`first-dup-${category._id}-${index}`}
                      category={category}
                      index={index}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Second Marquee Row - Moving Right to Left */}
        <div className="relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 w-32 h-full hidden sm:block bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full hidden sm:block bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-right hover:pause-animation">
              {isLoading ? (
                <LoadingSkeleton count={8} />
              ) : (
                <>
                  {secondRow.map((category, index) => (
                    <CategoryItem
                      key={`second-${category._id}-${index}`}
                      category={category}
                      index={index}
                      isLastItem={index === secondRow.length - 1}
                    />
                  ))}
                  {/* Duplicate for seamless loop */}
                  {secondRow.map((category, index) => (
                    <CategoryItem
                      key={`second-dup-${category._id}-${index}`}
                      category={category}
                      index={index}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-red-200 rounded-full animate-float opacity-60"></div>
      <div className="absolute bottom-10 right-20 w-2 h-2 bg-pink-200 rounded-full animate-float-delayed opacity-60"></div>
      <div className="absolute top-1/2 right-10 w-4 h-4 bg-red-100 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
}
