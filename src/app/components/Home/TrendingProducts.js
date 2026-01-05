import { productsURI } from "@/app/utils/ServerURI";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import axios from "axios";
import { Style } from "@/app/utils/CommonStyle";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/app/content/authContent";

export default function TrendingProducts({ products, loading }) {
  const { countryCode } = useAuth();

  // Determine language based on country code
  const isGerman = countryCode === "DE";

  // Translations
  const t = {
    topTrendingProducts: isGerman
      ? "Top-Trending-Produkte"
      : "Top Trending Products",
  };

  return (
    <div className="py-5 bg-transparent text-black z-10 w-full min-h-[50vh] flex flex-col gap-5 px-0">
      <div className="container mx-auto px-4 mb-8">
        <h1
          className={`${Style.h1} flex items-center gap-1 text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent`}
        >
          {t.topTrendingProducts}
          <TrendingUp className="h-6 sm:h-7 w-6 sm:w-7 text-green-500" />
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
      </div>
      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-3 auto-rows-fr">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-full min-h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl"
              ></div>
            ))
          : products?.map((product) => (
              <div key={product._id} className="h-full">
                <ProductCard
                  product={product}
                  sale={false}
                  tranding={true}
                  isDesc={false}
                />
              </div>
            ))}
      </div>

      {/* Mobile Swipeable Carousel */}
      <div className="sm:hidden relative">
        {loading ? (
          <div className="flex gap-[3px] overflow-x-auto pb-4 scrollbar-hide px-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc((100%-3px)/2)] h-[320px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              className="flex gap-[3px] overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory px-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products?.map((product, index) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[calc((100%-3px)/2)] snap-start"
                >
                  <ProductCard
                    product={product}
                    sale={false}
                    tranding={true}
                    isDesc={false}
                  />
                </div>
              ))}
            </div>
            {/* Scroll Indicator */}
            {products && products.length > 1 && (
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
        )}
      </div>
    </div>
  );
}
