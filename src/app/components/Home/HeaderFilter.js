"use client";

import { categoryUri } from "@/app/utils/ServerURI";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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

  // useEffect(() => {
  //   if (categoriesData && categoriesData.length > 0) {
  //     setActive(categoriesData[0]?.name);
  //   }
  // }, [categoriesData]);

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
    <div className="w-full h-full pt-4 pb-2 bg-transparent z-50 relative">
      <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden shidden">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div className="min-w-fit animate-pulse" key={index}>
                <div className="w-26 h-8 bg-gray-500/80 rounded-md animate-pulse"></div>
              </div>
            ))
          : categoriesData &&
            categoriesData?.map((category, index) => (
              <div
                className="min-w-fit relative"
                key={index}
                onMouseEnter={() => handleCategoryHover(category)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={`flex items-center gap-1 text-[14px] min-w-fit capitalize sm:text-[15px] font-medium px-2 py-[4px] transition-all duration-300 cursor-pointer rounded-md hover:bg-gray-100 ${
                    active === category.name
                      ? "border-b-2 border-yellow-500 text-yellow-500 bg-yellow-50"
                      : "border-b-2 border-transparent text-black"
                  }`}
                  onClick={() => {
                    setActive(category.name);
                    handleCategoryClick(category);
                  }}
                >
                  <span>{category?.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown && hoveredCategory?._id === category._id
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </div>
            ))}
      </div>

      {/* Advanced Dropdown */}
      {showDropdown && hoveredCategory && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          {/* Dropdown Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
            <h3 className="text-white font-semibold text-lg">
              {hoveredCategory.name} Categories
            </h3>
            <p className="text-yellow-100 text-sm">
              Explore our {hoveredCategory.name.toLowerCase()} collection
            </p>
          </div>

          {/* Dropdown Content */}
          <div className="max-h-96 overflow-y-auto">
            {isLoadingSubCategory ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                  <p className="text-gray-500 text-sm">
                    Loading subcategories...
                  </p>
                </div>
              </div>
            ) : subcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2 p-4">
                {subcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    onClick={() => handleSubCategoryClick(subcategory)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {subcategory.image ? (
                          <Image
                            src={subcategory.image || "/placeholder.svg"}
                            alt={subcategory.name}
                            width={120}
                            height={120}
                            loading="lazy"
                            unoptimized
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {subcategory.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-yellow-600 transition-colors duration-200">
                        {subcategory.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
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
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
            >
              View all {hoveredCategory.name.toLowerCase()} products →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
