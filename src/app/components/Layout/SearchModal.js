"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Package,
  History,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const trendingSearches = ["Electronics", "Fashion", "Gaming", "Home Decor", "Beauty", "Watches"];
  const popularCategories = [
    { name: "Electronics", icon: "🔌" },
    { name: "Fashion", icon: "👗" },
    { name: "Home & Garden", icon: "🏠" },
    { name: "Sports", icon: "⚽" },
  ];

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/search/${searchTerm}?isPC=true`
          );
          setSearchResults(data.products || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
    onClose();
    setSearchTerm("");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${searchTerm}`);
      onClose();
      setSearchTerm("");
    }
  };

  const handleTrendingClick = (term) => {
    setSearchTerm(term);
    inputRef.current?.focus();
  };

  const handleCategoryClick = (category) => {
    router.push(`/products?search=${category}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[101] p-4 md:p-6"
          >
            <div className="max-w-3xl mx-auto">
              {/* Search Container */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products, brands, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all duration-200"
                    >
                      Search
                    </button>
                    <button
                      onClick={onClose}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Search Content */}
                <div className="max-h-[70vh] overflow-y-auto">
                  {loading ? (
                    <div className="p-8 flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                        <span className="text-gray-500">Searching...</span>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">
                          {searchResults.length} products found
                        </span>
                        <button
                          onClick={handleSearch}
                          className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                        >
                          View all <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {searchResults.slice(0, 8).map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleProductClick(product._id)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={product.thumbnails || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-rose-600">
                                  €{product.price?.toFixed(2)}
                                </span>
                                {product.comparePrice > product.price && (
                                  <span className="text-xs text-gray-400 line-through">
                                    €{product.comparePrice?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : searchTerm.trim().length > 2 ? (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-gray-600 font-medium">No products found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try different keywords or browse categories
                      </p>
                    </div>
                  ) : (
                    <div className="p-6">
                      {/* Trending Searches */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-rose-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            Trending Searches
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((term, index) => (
                            <motion.button
                              key={term}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleTrendingClick(term)}
                              className="px-4 py-2 text-sm bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-all duration-200 flex items-center gap-2"
                            >
                              <Sparkles className="w-3 h-3" />
                              {term}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Popular Categories */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <History className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            Popular Categories
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {popularCategories.map((cat, index) => (
                            <motion.button
                              key={cat.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              onClick={() => handleCategoryClick(cat.name)}
                              className="p-4 bg-gray-50 hover:bg-rose-50 rounded-xl text-center transition-colors group"
                            >
                              <span className="text-2xl mb-2 block">{cat.icon}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-rose-600 transition-colors">
                                {cat.name}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick tip */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">ESC</kbd> to close
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
