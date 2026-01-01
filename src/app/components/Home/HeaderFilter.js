"use client";

import { categoryUri } from "@/app/utils/ServerURI";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import axios from "axios";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";

export default function HeaderFilter({ categoriesData, isLoading }) {
  const [active, setActive] = useState("");
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [isLoadingSubCategory, setIsLoadingSubCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef();

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;

    setIsLoadingSubCategory(true);
    try {
      const { data } = await axios.get(
        `${categoryUri}/subcategory/${categoryId}`
      );
      setSubcategories(data.subCategories || []);
    } catch (error) {
      console.log(error);
      setSubcategories([]);
    } finally {
      setIsLoadingSubCategory(false);
    }
  };

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${category._id}`);
    setShowDropdown(false);
  };

  const handleSubCategoryClick = (subcategory) => {
    router.push(`/products?subcategory=${subcategory._id}`);
    setShowDropdown(false);
  };

  const handleCategoryHover = (category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setHoveredCategory(category);
    setSelectedCategoryId(category._id);
    setShowDropdown(true);
    fetchSubCategories(category._id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      setHoveredCategory(null);
    }, 300);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownLeave = () => {
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 relative">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden py-2.5 scrollbar-hide">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div className="flex-shrink-0 animate-pulse" key={index}>
                  <div className="w-28 h-9 bg-gray-200 rounded-lg"></div>
                </div>
              ))
            : categoriesData &&
              categoriesData?.map((category, index) => (
                <div
                  className="flex-shrink-0 relative"
                  key={index}
                  onMouseEnter={() => handleCategoryHover(category)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 transition-all duration-200 cursor-pointer rounded-lg whitespace-nowrap ${
                      active === category.name
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setActive(category.name);
                      handleCategoryClick(category);
                    }}
                  >
                    <span>{category?.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showDropdown && hoveredCategory?._id === category._id
                          ? "rotate-180 text-rose-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Advanced Dropdown */}
      {showDropdown && hoveredCategory && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 overflow-hidden z-50"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-8xl mx-auto">
            {/* Dropdown Header */}
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
              <h3 className="text-white font-semibold text-lg">
                {hoveredCategory.name}
              </h3>
              <p className="text-rose-100 text-sm">
                Explore our {hoveredCategory.name.toLowerCase()} collection
              </p>
            </div>

            {/* Dropdown Content */}
            <div className="max-h-96 overflow-y-auto">
              {isLoadingSubCategory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    <p className="text-gray-500 text-sm">
                      Loading subcategories...
                    </p>
                  </div>
                </div>
              ) : subcategories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 p-4">
                  {subcategories.map((subcategory, index) => (
                    <div
                      key={index}
                      onClick={() => handleSubCategoryClick(subcategory)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-rose-200 transition-all">
                          {subcategory.image ? (
                            <Image
                              src={subcategory.image || "/placeholder.svg"}
                              alt={subcategory.name}
                              width={120}
                              height={120}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {subcategory.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-rose-600 transition-colors duration-200 text-sm">
                          {subcategory.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          View products
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-gray-500 text-sm">No subcategories found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Check back later for more options
                  </p>
                </div>
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
              <button
                onClick={() => handleCategoryClick(hoveredCategory)}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200"
              >
                View all {hoveredCategory.name.toLowerCase()} products →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
