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
      <div className="grid  max-[350px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 sm:gap-3 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[320px] h-[280px] bg-gray-600 animate-pulse rounded-lg"
              ></div>
            ))
          : products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                sale={false}
                tranding={true}
                isDesc={false}
              />
            ))}
      </div>
    </div>
  );
}
