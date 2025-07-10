"use client";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import { Style } from "@/app/utils/CommonStyle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCarousel from "../ProductCarousel";

export default function SalesProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(products);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${productsURI}/sales/products`);
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
    <div className="flex flex-col gap-4 z-10 py-4">
      <div
        className="w-full h-full py-4 px-1 sm:px-4 shadow1 bg-red-50 min-h-[15rem] flex flex-col gap-4 border-2 border-red-500 "
        style={{ borderRadius: "1rem" }}
      >
        <div className="inline-flex items-center w-fit px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
          <span className="text-red-400 text-sm  font-medium uppercase tracking-wider">
            Limited Time Offer
          </span>
        </div>
        <h1 className=" text-2xl sm:text-4xl  font-semibold text-white ">
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Flash Sale
          </span>
        </h1>
        <p className="text-xs text-gray-600 max-w-2xl  ">
          Don&apos;t miss out on our biggest sale of the year. Limited time
          only!
        </p>
        <div className="w-full min-h-[10vh] flex items-center justify-center ">
          <Timer />
        </div>
        {/* Products */}
        <div className="w-full py-4">
          {isLoading ? (
            // Skeleton Loader
            <div className="w-full flex gap-4 overflow-hidden">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[320px] h-[250px] bg-gray-600 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <ProductCarousel products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
