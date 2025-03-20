import { productsURI } from "@/app/utils/ServerURI";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import axios from "axios";
import { Style } from "@/app/utils/CommonStyle";
import { TrendingUp } from "lucide-react";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(products);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${productsURI}/trending/products`);
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
    <div className="py-5 bg-transparent text-black z-10 w-full min-h-[50vh] flex flex-col gap-5 px-4 sm:px-0">
      <h1
        className={`${Style.h1} text-start text-black flex items-center gap-2 min-w-fit`}
      >
        Top Trending Products
        <TrendingUp className="h-6 sm:h-7 w-6 sm:w-7 text-green-500" />
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-[230px] min-w-[280px] h-[280px] bg-gray-600 animate-pulse rounded-lg"
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
