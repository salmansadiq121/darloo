"use client";
import { categoryUri } from "@/app/utils/ServerURI";
import axios from "axios";
import { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { ChevronDown, ChevronRight, X, Filter, Tag } from "lucide-react";

export default function FilterProducts({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedCategories,
  setSelectedCategories,
  clearFilters,
  selectedFiltersCount,
  selectedSubCategories,
  setSelectedSubCategories,
  setOpenFilter,
}) {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState([minPrice || 0, maxPrice || 5000]);
  const [subCategories, setSubCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loadingSubCategories, setLoadingSubCategories] = useState(new Set());

  const handleChange = (newValues) => {
    setValues(newValues);
    setMinPrice(newValues[0]);
    setMaxPrice(newValues[1]);
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  // Handle subcategory selection
  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategories((prevSubCategories) =>
      prevSubCategories.includes(subCategory)
        ? prevSubCategories.filter((sc) => sc !== subCategory)
        : [...prevSubCategories, subCategory]
    );
  };

  // Toggle category expansion
  const toggleCategoryExpansion = async (categoryId, categoryName) => {
    const newExpanded = new Set(expandedCategories);

    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
      // Fetch subcategories if not already loaded
      if (!subCategories[categoryId]) {
        await fetchSubCategories(categoryId);
      }
    }

    setExpandedCategories(newExpanded);
  };

  // Remove individual filter
  const removeFilter = (filterType, filterValue) => {
    if (filterType === "category") {
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat !== filterValue)
      );
    } else if (filterType === "subcategory") {
      setSelectedSubCategories((prev) =>
        prev.filter((subCat) => subCat !== filterValue)
      );
    } else if (filterType === "price") {
      setValues([0, 5000]);
      setMinPrice(0);
      setMaxPrice(5000);
    }
  };

  // Fetch All Categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${categoryUri}/all/categories`);
      const categoriesData = data.categories;
      setCategoryData(categoriesData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategories = async (id) => {
    const newLoadingSet = new Set(loadingSubCategories);
    newLoadingSet.add(id);
    setLoadingSubCategories(newLoadingSet);

    try {
      const { data } = await axios.get(`${categoryUri}/subcategory/${id}`);
      const subCategoriesData = data.subCategories;
      setSubCategories((prev) => ({
        ...prev,
        [id]: subCategoriesData,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      const newLoadingSet = new Set(loadingSubCategories);
      newLoadingSet.delete(id);
      setLoadingSubCategories(newLoadingSet);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Check if price filter is active
  const isPriceFilterActive = values[0] !== 0 || values[1] !== 5000;

  return (
    <div className="w-full bg-white   ">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-yellow-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-600" />
          Filters
          {selectedFiltersCount > 0 && (
            <span className="text-xs font-medium bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {selectedFiltersCount}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={() => setOpenFilter(false)}
            className="lg:hidden flex items-center gap-1 bg-red-50 p-2 cursor-pointer text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-100  rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Applied Filters */}
      {(selectedCategories.length > 0 ||
        selectedSubCategories.length > 0 ||
        isPriceFilterActive) && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Applied Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* Price Filter Tag */}
            {isPriceFilterActive && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                <span>
                  ${values[0]} - ${values[1]}
                </span>
                <button
                  onClick={() => removeFilter("price")}
                  className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Category Filter Tags */}
            {selectedCategories.map((category, i) => (
              <div
                key={category ?? i}
                className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                <span>{category}</span>
                <button
                  onClick={() => removeFilter("category", category)}
                  className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Subcategory Filter Tags */}
            {selectedSubCategories.map((subCategory, i) => (
              <div
                key={subCategory ?? i}
                className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                <span>{subCategory}</span>
                <button
                  onClick={() => removeFilter("subcategory", subCategory)}
                  className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-6">
        {/* Price Range Filter */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Price Range
            </h3>

            {/* Min & Max Price Display */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                {/* <span className="text-xs text-gray-500 block">Min</span> */}
                <span className="text-sm font-semibold text-gray-900">
                  ${values[0]}
                </span>
              </div>
              <div className="flex-1 mx-3 h-px bg-gray-300"></div>
              <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                {/* <span className="text-xs text-gray-500 block">Max</span> */}
                <span className="text-sm font-semibold text-gray-900">
                  ${values[1]}
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="relative">
              <RangeSlider
                min={0}
                max={5000}
                step={5}
                value={values}
                onInput={handleChange}
                className="custom-slider"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            Categories
          </h3>

          <div className="space-y-2">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))
              : categoriesData.map((category) => (
                  <div
                    key={category._id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Main Category */}
                    <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                      <label className="flex items-center gap-3 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded cursor-pointer accent-red-600 focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </label>

                      <button
                        onClick={() =>
                          toggleCategoryExpansion(category._id, category.name)
                        }
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      >
                        {expandedCategories.has(category._id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.has(category._id) && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        {loadingSubCategories.has(category._id) ? (
                          <div className="p-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={index}
                                className="animate-pulse mb-2 last:mb-0"
                              >
                                <div className="h-6 bg-gray-300 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : subCategories[category._id] &&
                          subCategories[category._id].length > 0 ? (
                          <div className="p-3 space-y-2">
                            {subCategories[category._id].map((subCategory) => (
                              <label
                                key={subCategory._id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSubCategories.includes(
                                    subCategory._id
                                  )}
                                  onChange={() =>
                                    handleSubCategoryChange(subCategory._id)
                                  }
                                  className="w-3 h-3 text-yellow-500 border-gray-300 rounded accent-yellow-600 cursor-pointer focus:ring-yellow-400 focus:ring-2"
                                />
                                <span className="text-xs text-gray-700">
                                  {subCategory.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 text-xs text-gray-500 italic">
                            No subcategories available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-slider {
          --slider-track-color: #f3f4f6;
          --slider-range-color: #dc2626;
          --slider-thumb-color: #dc2626;
          --slider-thumb-border-color: #ffffff;
          --slider-thumb-size: 18px;
          --slider-track-height: 6px;
          height: 3px;
        }

        .custom-slider .range-slider__range {
          background: linear-gradient(90deg, #dc2626 0%, #eab308 100%);
          height: 3px;
        }

        .custom-slider .range-slider__thumb {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          border: 2px solid white;
          width: 18px;
          height: 18px;
          background: red;
        }
      `}</style>
    </div>
  );
}
