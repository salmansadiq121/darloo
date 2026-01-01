"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, ArrowRight, Sparkles, Package, Mic } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileProductSearch({ isShow, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const trendingSearches = ["Electronics", "Fashion", "Gaming", "Home"];
  const recentSearches = [];

  // Auto-focus input when shown
  useEffect(() => {
    if (isShow) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isShow]);

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
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(searchTerm.trim().length === 0);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
    setShowResults(false);
    setSearchTerm("");
    onClose?.();
  };

  const handleTrendingClick = (term) => {
    setSearchTerm(term);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${searchTerm}`);
      onClose?.();
    }
  };

  if (!isShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="w-full bg-white border-b border-gray-100 shadow-lg"
      ref={searchRef}
    >
      {/* Search Input */}
      <div className="p-3">
        <div className="relative flex items-center bg-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-rose-500/50 transition-all">
          <div className="pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-3 py-3 text-sm bg-transparent placeholder-gray-400 focus:outline-none text-gray-800"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors mr-1"
              >
                <X className="h-5 w-5 text-gray-500" />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            onClick={handleSearch}
            className="h-full px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 active:from-rose-600 active:to-rose-700 transition-all"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Results Container */}
      <div className="max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="p-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-rose-500 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {searchResults.length} Products Found
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {searchResults.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleProductClick(product._id)}
                  className="flex items-center gap-3 p-3 active:bg-rose-50 cursor-pointer transition-colors"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200">
                    <Image
                      src={product.thumbnails || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-rose-600">
                        €{product.price?.toFixed(2)}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          €{product.comparePrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
            {searchResults.length > 8 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleSearch}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl flex items-center justify-center gap-2 active:from-rose-600 active:to-rose-700 transition-all shadow-lg shadow-rose-500/20"
                >
                  View All {searchResults.length} Results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : searchTerm.trim().length > 2 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try different keywords
            </p>
          </div>
        ) : (
          <div className="p-4">
            {/* Trending Searches */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Trending
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
                    className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-rose-100 hover:to-rose-50 active:from-rose-200 active:to-rose-100 rounded-full transition-all duration-200 flex items-center gap-2 border border-gray-200 hover:border-rose-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Categories */}
            <div>
              <span className="text-sm font-semibold text-gray-700 mb-3 block">
                Popular Categories
              </span>
              <div className="grid grid-cols-4 gap-2">
                {["Fashion", "Electronics", "Home", "Beauty"].map((cat, index) => (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => router.push(`/categories?cat=${cat.toLowerCase()}`)}
                    className="p-3 bg-gray-50 hover:bg-rose-50 active:bg-rose-100 rounded-xl text-center transition-colors border border-gray-100 hover:border-rose-200"
                  >
                    <span className="text-xs font-medium text-gray-700">{cat}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
