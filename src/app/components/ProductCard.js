"use client";
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import Ratings from "../utils/Ratings";
import { Diamond, Eye, Flame } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../content/authContent";
import toast from "react-hot-toast";

export default function ProductCard({ product, sale, tranding, isDesc }) {
  const router = useRouter();
  const { setSelectedProduct } = useAuth();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (!product || !product._id) return;

    setSelectedProduct((prevProducts) => {
      let updatedProducts = [...prevProducts];

      const existingProductIndex = updatedProducts.findIndex(
        (p) => p.product === product._id
      );

      if (existingProductIndex !== -1) {
        let existingProduct = { ...updatedProducts[existingProductIndex] };

        if (!existingProduct.colors.includes(selectedColor)) {
          existingProduct.colors = [...existingProduct.colors, selectedColor];
        }

        if (!existingProduct.sizes.includes(selectedSize)) {
          existingProduct.sizes = [...existingProduct.sizes, selectedSize];
        }

        existingProduct.quantity += quantity;

        updatedProducts[existingProductIndex] = existingProduct;
      } else {
        updatedProducts.push({
          product: product._id,
          quantity,
          price: product.price,
          colors: [selectedColor],
          sizes: [selectedSize],
          image: product.thumbnails,
          title: product.name,
          _id: product._id,
        });
      }

      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedProducts));

      return updatedProducts;
    });
    toast.success("Product added to cart");
  };
  return (
    <div className="group bg-white min-w-[10.5rem] max-w-[17rem] border overflow-hidden transition-all duration-300  hover:shadow-[#9333EA]/20 hover:shadow-2xl hover:border-red-500/50 hover:-translate-y-1">
      <div className="relative ">
        <Image
          src={product?.thumbnails || "/placeholder.svg"}
          alt={product?.name}
          width={200}
          height={230}
          className="w-full h-[180px] sm:h-[230px] object-fill"
          loading="lazy"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]   to-transparent"></div>

        {/* Tags */}
        <div className="absolute top-2 right-0 px-2 flex items-center justify-between w-full">
          {product?.estimatedPrice > product?.price && (
            <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
              <Diamond size={12} className="mr-1" />
              {product?.estimatedPrice > product?.price
                ? `${(
                    (1 - product?.price / product?.estimatedPrice) *
                    100
                  ).toFixed(0)}% OFF`
                : ""}
            </div>
          )}

          {product?.sale?.isActive && sale && (
            <div className="bg-[#06B6D4]/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
              <Flame size={12} className="mr-1 text-white" />
              Sale
            </div>
          )}
        </div>

        {product?.trending && (
          <div className="bg-green-600/80 absolute bottom-1 right-1 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
            <Flame size={12} className="mr-1 text-white" />
            Trending
          </div>
        )}

        {/* Quick view button (appears on hover) */}
        <div
          onClick={() => router.push(`/products/${product._id}`)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-[0] group-hover:opacity-[1] transition-opacity duration-300 flex items-center justify-center"
        >
          <button className="px-4 py-2 cursor-pointer bg-white/20 backdrop-blur-md rounded-lg text-white font-medium border border-white/30 hover:bg-white/30 transition-colors duration-200 flex items-center">
            <Eye size={16} className="mr-2" />
            Quick View
          </button>
        </div>
      </div>

      <div className="p-3">
        <div
          onClick={() => router.push(`/products/${product._id}`)}
          className="flex  items-start flex-col gap-1 mb-3"
        >
          <h3 className="text-[14px]  sm:text-lg font-medium dm:font-semibold capitalize line-clamp-1">
            {product?.name}
          </h3>
          {/* {isDesc && (
            <p className="capitalize text-sm text-gray-600 font-light line-clamp-2">
              {product?.description}
            </p>
          )} */}
        </div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold  text-black">
              €{product?.price?.toFixed(2)}
            </div>
            <div className="text-sm  text-gray-600 line-through">
              €{product?.estimatedPrice}
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(product)}
            className="w-[1.8rem] h-[1.8rem] cursor-pointer flex items-center justify-center rounded-full  bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white hover:opacity-90 transition-opacity duration-200 "
          >
            <FaCartPlus size={16} className=" text-white" />
          </button>
        </div>
        <Ratings rating={product?.ratings} />
      </div>
    </div>
  );
}
