"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import Image from "next/image";
import toast from "react-hot-toast";
import MainLayout from "@/app/components/Layout/Layout";
import FilterProducts from "@/app/components/Product/FilterProducts";
import ProductCard from "@/app/components/ProductCard";
import Pagination from "@/app/utils/Pagination";
import axios from "axios";

const sortingOptions = [
  {
    label: "Price: Low to High",
    value: "price_asc",
    icon: <FaSortAmountDown />,
  },
  {
    label: "Price: High to Low",
    value: "price_desc",
    icon: <FaSortAmountUp />,
  },
  {
    label: "Alphabetical (A-Z)",
    value: "name_asc",
    icon: <FaSortAlphaDown />,
  },
  {
    label: "Alphabetical (Z-A)",
    value: "name_desc",
    icon: <FaSortAlphaUp />,
  },
  {
    label: "Newest First",
    value: "createdAt_desc",
    icon: <FaSortAmountDown />,
  },
  {
    label: "Most Popular",
    value: "purchased_desc",
    icon: <FaSortAmountUp />,
  },
];

// Loading skeleton component
const ProductSkeleton = () => (
  <div className="group bg-white min-w-[14rem] border overflow-hidden animate-pulse">
    <div className="relative">
      <div className="w-full h-[230px] bg-gray-300"></div>
      <div className="absolute top-3 right-3 w-16 h-6 bg-gray-400 rounded-full"></div>
    </div>
    <div className="p-3">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ onClearFilters }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center mt-10 py-12"
  >
    <Image
      src="/9960436.jpg?height=200&width=200"
      alt="No products found"
      width={200}
      height={200}
      className="w-64 h-64 opacity-50"
    />
    <h3 className="text-xl font-semibold mt-6 text-gray-700">
      No products found!
    </h3>
    <p className="text-gray-500 mt-2 text-center max-w-md">
      We couldn&apos;t find any products matching your criteria. Try adjusting
      your filters or search terms.
    </p>
    <button
      onClick={onClearFilters}
      className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Clear All Filters
    </button>
  </motion.div>
);

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  // State management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [trending, setTrending] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // UI states
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 20;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate selected filters count
  const selectedFiltersCount = useMemo(() => {
    return (
      (selectedCategories.length > 0 ? selectedCategories.length : 0) +
      (selectedSubCategories.length > 0 ? selectedSubCategories.length : 0) +
      (debouncedSearchTerm ? 1 : 0) +
      (minPrice !== "" ? 1 : 0) +
      (maxPrice !== "" ? 1 : 0) +
      (trending ? 1 : 0) +
      (onSale ? 1 : 0)
    );
  }, [
    selectedCategories,
    selectedSubCategories,
    debouncedSearchTerm,
    minPrice,
    maxPrice,
    trending,
    onSale,
  ]);

  console.log("products", products);

  useEffect(() => {
    const cat = searchParams.get("category");
    const sub = searchParams.get("subcategory");

    if (cat) setSelectedCategories([cat]);
    if (sub) setSelectedSubCategories([sub]);

    setTimeout(() => {
      setFiltersInitialized(true);
    }, 0);
  }, [searchParams]);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Pagination
      params.append("page", currentPage.toString());
      params.append("limit", productsPerPage.toString());

      // Categories (comma-separated)
      if (selectedCategories.length > 0) {
        params.append("category", selectedCategories.join(","));
      }

      // Subcategories (comma-separated)
      if (selectedSubCategories.length > 0) {
        params.append("subCategory", selectedSubCategories.join(","));
      }

      // Price range
      if (minPrice !== "" && minPrice !== "0") {
        params.append("minPrice", minPrice.toString());
      }
      if (maxPrice !== "" && maxPrice !== "5000") {
        params.append("maxPrice", maxPrice.toString());
      }

      // Sort option
      if (sortOption) {
        params.append("sortBy", sortOption);
      }

      // Boolean flags
      if (trending) {
        params.append("trending", "true");
      }
      if (onSale) {
        params.append("onSale", "true");
      }

      // Search term
      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URI
        }/api/v1/products/pagination?${params.toString()}`
      );

      console.log("data", data);

      if (data) {
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 0);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError(err.message);
      toast.error("Error fetching products. Please try again.");
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    selectedCategories,
    selectedSubCategories,
    minPrice,
    maxPrice,
    sortOption,
    trending,
    onSale,
    debouncedSearchTerm,
  ]);

  // Fetch products when dependencies change
  useEffect(() => {
    if (filtersInitialized) {
      fetchProducts();
    }
  }, [fetchProducts, filtersInitialized]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategories,
    selectedSubCategories,
    minPrice,
    maxPrice,
    sortOption,
    trending,
    onSale,
    debouncedSearchTerm,
  ]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSortOption("");
    setTrending(false);
    setOnSale(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
    setOpenFilter(false);
    // const params = new URLSearchParams(searchParams.toString());
    // params.delete("subCategory");
    router.push(`/products`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle sort selection
  const handleSortSelection = useCallback((value) => {
    setSortOption(value);
    setOpenSort(false);
  }, []);

  // Get current sort label
  const currentSortLabel = useMemo(() => {
    const option = sortingOptions.find((opt) => opt.value === sortOption);
    return option ? option.label : "Sort By";
  }, [sortOption]);

  return (
    <MainLayout title="Darloo - Products">
      <div className="relative bg-transparent text-black min-h-screen z-10">
        <div className="grid grid-cols-4 z-10">
          {/* Desktop Filters */}
          <div className="hidden lg:block col-span-1 border-r border-gray-200 w-full min-h-screen overflow-y-auto">
            <FilterProducts
              maxPrice={maxPrice}
              minPrice={minPrice}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              clearFilters={clearFilters}
              selectedFiltersCount={selectedFiltersCount}
              selectedSubCategories={selectedSubCategories}
              setSelectedSubCategories={setSelectedSubCategories}
              setOpenFilter={setOpenFilter}
            />
          </div>

          {/* Mobile Filter Overlay */}
          <AnimatePresence>
            {openFilter && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="flex lg:hidden absolute top-[0rem] max-w-[24rem] left-0 z-50 bg-white border border-gray-400 w-full h-screen overflow-y-auto shadow-2xl"
              >
                <div className="w-full">
                  <FilterProducts
                    maxPrice={maxPrice}
                    minPrice={minPrice}
                    setMaxPrice={setMaxPrice}
                    setMinPrice={setMinPrice}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    clearFilters={clearFilters}
                    selectedFiltersCount={selectedFiltersCount}
                    selectedSubCategories={selectedSubCategories}
                    setSelectedSubCategories={setSelectedSubCategories}
                    setOpenFilter={setOpenFilter}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Section */}
          <div className="col-span-4 lg:col-span-3 w-full min-h-screen flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm">
              <div className="flex flex-col gap-4 px-4 py-2">
                {/* Top Row - Mobile Filter Toggle & Search */}
                {/* <div className="flex items-center gap-4">
                  <button
                    onClick={() => setOpenFilter(!openFilter)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaSliders className="text-gray-600 w-5 h-5" />
                  </button>

                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearchTerm("");
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div> */}

                {/* Bottom Row - Results & Sort */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setOpenFilter(!openFilter)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaSliders className="text-gray-600 w-5 h-5" />
                  </button>
                  <div className="text-sm text-gray-600 hidden sm:block">
                    {isLoading ? (
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span>
                        Showing {products.length} of {totalProducts} products
                        {selectedFiltersCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {selectedFiltersCount} filter
                            {selectedFiltersCount > 1 ? "s" : ""} applied
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative ">
                    <button
                      onClick={() => setOpenSort(!openSort)}
                      className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-between min-w-[140px]"
                    >
                      <Filter size={16} className="mr-2 text-gray-600" />
                      <span className="truncate">{currentSortLabel}</span>
                      {openSort ? (
                        <ChevronUp size={16} className="ml-2 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="ml-2 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {openSort && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-12 right-0 w-56 bg-white shadow-lg rounded-lg z-20 border border-gray-200"
                        >
                          <ul className="py-2">
                            {sortingOptions.map((option) => (
                              <li
                                key={option.value}
                                className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 transition-all ${
                                  sortOption === option.value
                                    ? "bg-red-50 text-red-700"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSortSelection(option.value)
                                }
                              >
                                {option.icon}
                                {option.label}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 max-[350px]:px-6 px-1 sm:px-4 py-4">
              {error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-500 text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Error Loading Products
                    </h3>
                    <p className="text-sm mb-4">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : products.length === 0 && !isLoading ? (
                <EmptyState onClearFilters={clearFilters} />
              ) : (
                <div className="grid  max-[350px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 sm:gap-3 gap-4">
                  {isLoading
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <ProductSkeleton key={index} />
                      ))
                    : products.map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard
                            product={product}
                            sale={true}
                            tranding={true}
                            isDesc={true}
                          />
                        </motion.div>
                      ))}
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center mt-8">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
