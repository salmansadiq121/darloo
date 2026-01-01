"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight, Sparkles, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const trendingSearches = ["Electronics", "Fashion", "Gaming", "Home Decor"];

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
        if (searchTerm.trim().length === 0 && !isFocused) {
          setShowResults(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, isFocused]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsFocused(false);
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
    setIsFocused(false);
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

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowResults(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input Container */}
      <motion.div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/10"
            : "ring-1 ring-gray-200 hover:ring-gray-300"
        } rounded-full bg-white overflow-hidden`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="pl-4 flex items-center pointer-events-none">
          <Search
            className={`h-4 w-4 transition-colors duration-200 ${
              isFocused ? "text-rose-500" : "text-gray-400"
            }`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, brands, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent placeholder-gray-400 focus:outline-none text-gray-800"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-1.5 mr-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>
        <button
          onClick={() => searchTerm.trim() && router.push(`/products?search=${searchTerm}`)}
          className="h-full px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
        >
          <Search className="h-4 w-4 text-white" />
        </button>
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {loading ? (
              <div className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-rose-500 rounded-full"
                        animate={{ y: [0, -8, 0] }}
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
              <div className="max-h-[400px] overflow-y-auto">
                <div className="p-2 border-b border-gray-100">
                  <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Products
                  </span>
                </div>
                <div className="py-1">
                  {searchResults.slice(0, 6).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProductClick(product._id)}
                      className="group px-3 py-2 hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 group-hover:ring-rose-200 transition-all">
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
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {product.category?.name || product.description?.slice(0, 50)}
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
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                {searchResults.length > 6 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => router.push(`/products?search=${searchTerm}`)}
                      className="w-full py-2 text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center justify-center gap-2 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      View all {searchResults.length} results
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : searchTerm.trim().length > 2 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords or browse categories
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trending Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term, index) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTrendingClick(term)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
