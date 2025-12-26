"use client";
import React from "react";
import { Store, Truck, Star, Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SellerProductGroup({
  sellerName,
  storeLogo,
  products,
  estimatedDelivery,
  subtotal,
  onQuantityChange,
  onRemoveProduct,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4"
    >
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={sellerName}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Store className="w-5 h-5 text-red-500" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                {sellerName || "Marketplace"}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span>4.8</span>
                <span className="mx-1">|</span>
                <span>Top Seller</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          {estimatedDelivery && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <Truck className="w-4 h-4 text-green-500" />
              <span>
                {estimatedDelivery.min}-{estimatedDelivery.max} days
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="divide-y divide-gray-50">
        {products?.map((item, index) => (
          <motion.div
            key={item._id || item.combinationId || index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <Image
                  src={item.image || item.thumbnails || "/placeholder.png"}
                  alt={item.title || item.name || "Product"}
                  fill
                  className="object-cover rounded-lg border border-gray-100"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                  {item.title || item.name}
                </h4>

                {/* Variants */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.colors?.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {item.colors.join(", ")}
                    </span>
                  )}
                  {item.sizes?.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      Size: {item.sizes.join(", ")}
                    </span>
                  )}
                </div>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-red-600 font-bold text-sm sm:text-base">
                    &euro;{parseFloat(item.price || 0).toFixed(2)}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          onQuantityChange?.(
                            item._id || item.combinationId,
                            Math.max(1, (item.quantity || 1) - 1)
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          onQuantityChange?.(
                            item._id || item.combinationId,
                            (item.quantity || 1) + 1
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        onRemoveProduct?.(item._id || item.combinationId)
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    Subtotal:{" "}
                    <span className="font-medium text-gray-700">
                      &euro;
                      {(
                        parseFloat(item.price || 0) * (item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seller Subtotal */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Seller Subtotal ({products?.length || 0} items)
          </span>
          <span className="font-bold text-gray-800">
            &euro;{parseFloat(subtotal || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
