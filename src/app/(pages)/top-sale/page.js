"use client";
import MainLayout from "@/app/components/Layout/Layout";
import ProductCard from "@/app/components/ProductCard";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import { Flame } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function TopSale() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { countryCode } = useAuth();

  const isGerman = countryCode === "DE";

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${productsURI}/sales/products?isPC=true`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <MainLayout title="Darloo - Top Sale">
      <div className="py-5 bg-transparent max-w-7xl mx-auto text-black z-10 w-full min-h-[50vh] flex flex-col gap-5 relative px-4 sm:px-[3rem] ">
        <h1
          className={`${Style.h1} text-start text-black flex items-center gap-2 min-w-fit`}
        >
          <Flame className="h-6 sm:h-7 w-6 sm:w-7 text-orange-600" />
          {isGerman ? "Top-Verkaufsprodukte" : "Top Sale Products"}
        </h1>
        {/* Desktop Grid View */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-3 auto-rows-fr">
          {isLoading
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
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[85vw]">
                  <div className="w-full h-[320px] bg-gray-600 animate-pulse rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {products?.map((product, index) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 w-[85vw] snap-start"
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
          )}
        </div>
      </div>
    </MainLayout>
  );
}
