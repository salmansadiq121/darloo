"use client";
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import Ratings from "../utils/Ratings";
import { Diamond, Eye, Flame, Heart, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../content/authContent";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductCard({ product, sale, tranding, isDesc }) {
  const router = useRouter();
  const { setSelectedProduct } = useAuth();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is out of stock
  const isOutOfStock = !product?.quantity || product?.quantity <= 0;

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (!product || !product._id) return;

    // Prevent adding out of stock products
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

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

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(product._id)) {
      favorites = favorites.filter((id) => id !== product._id);
      toast.success("Removed from wishlist");
    } else {
      favorites.push(product._id);
      toast.success("Added to wishlist");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const discountPercentage =
    product?.estimatedPrice > product?.price
      ? Math.round(
          ((product.estimatedPrice - product.price) / product.estimatedPrice) *
            100
        )
      : product?.sale?.isActive
      ? product.sale.discountPercentage
      : 0;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-300 relative h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        <Image
          src={product?.thumbnails || "/placeholder.svg"}
          alt={product?.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          <div className="flex flex-col gap-2">
            {discountPercentage > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-600 to-red-500 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 text-white shadow-lg"
              >
                <Sparkles className="w-3 h-3" />
                {discountPercentage}% OFF
              </motion.div>
            )}

            {product?.sale?.isActive && sale && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 text-white shadow-lg"
              >
                <Flame className="w-3 h-3" />
                Sale
              </motion.div>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500"
            } shadow-lg`}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isWishlisted ? "fill-current" : ""
              }`}
            />
          </motion.button>
        </div>

        {/* Bottom Badge */}
        {isOutOfStock ? (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute bottom-3 left-3 bg-gradient-to-r from-gray-700 to-gray-800 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 text-white shadow-lg"
          >
            Out of Stock
          </motion.div>
        ) : product?.trending && tranding ? (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute bottom-3 left-3 bg-gradient-to-r from-emerald-500 to-green-600 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 text-white shadow-lg"
          >
            <Flame className="w-3 h-3" />
            Trending
          </motion.div>
        ) : null}

        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-xl text-gray-900 font-semibold text-sm shadow-xl border border-white/50 hover:bg-white transition-all duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <div
          onClick={() => router.push(`/products/${product._id}`)}
          className="mb-3 cursor-pointer flex-grow min-h-[3rem]"
        >
          <h3 className="text-[13px] sm:text-[15px] font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors duration-300 min-h-[2.5rem]">
            {product?.name}
          </h3>
          {isDesc && product?.description && (
            <p className="text-[11px] sm:text-[12px] text-gray-500 line-clamp-2 mt-1">
              {product?.description}
            </p>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-shrink-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                €{product?.price?.toFixed(2)}
              </span>
              {product?.estimatedPrice > product?.price && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  €{product?.estimatedPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product?.sale?.isActive && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                Save €
                {(
                  product.estimatedPrice -
                  product.price
                ).toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.9 } : {}}
            disabled={isOutOfStock}
            className={`p-2.5 sm:p-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group/btn flex-shrink-0 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white hover:shadow-xl"
            }`}
          >
            <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${!isOutOfStock ? "group-hover/btn:scale-110" : ""} transition-transform`} />
          </motion.button>
        </div>

        {/* Ratings */}
        <div className="flex items-center justify-between flex-shrink-0">
          <Ratings rating={product?.ratings} />
          {product?.purchased > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-500">
              {product.purchased} sold
            </span>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
