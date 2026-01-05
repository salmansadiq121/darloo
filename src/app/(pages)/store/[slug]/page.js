"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaStore,
  FaStar,
  FaShoppingBag,
  FaUsers,
  FaThumbsUp,
  FaFilter,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBox,
  FaShieldAlt,
  FaHeart,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { IoGrid, IoList, IoClose, IoStorefront } from "react-icons/io5";
import { MdVerified, MdLocalShipping } from "react-icons/md";
import { TbPackage, TbTruckDelivery, TbShieldCheck } from "react-icons/tb";
import { BiSort, BiMessageDetail } from "react-icons/bi";
import dynamic from "next/dynamic";
import { format } from "date-fns";

const Layout = dynamic(() => import("../../../components/Layout/Layout"), {
  ssr: false,
});
const ProductCard = dynamic(() => import("../../../components/ProductCard"), {
  ssr: false,
});

// Loading Skeleton
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 w-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating, size = "sm" }) => {
  const sizeClass =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating) ? "text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-start gap-3 mb-3">
      {review.user?.avatar ? (
        <Image
          src={review.user.avatar}
          alt={review.user.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
          {review.user?.name?.charAt(0) || "U"}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">
            {review.user?.name || "Anonymous"}
          </p>
          <span className="text-xs text-gray-500">
            {review.createdAt &&
              format(new Date(review.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
        <StarRating rating={review.rating} />
      </div>
    </div>
    {review.product && (
      <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
        {review.product.thumbnails && (
          <Image
            src={review.product.thumbnails}
            alt={review.product.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded object-cover"
          />
        )}
        <span className="text-xs text-gray-600 line-clamp-1">
          {review.product.name}
        </span>
      </div>
    )}
    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    {review.images?.length > 0 && (
      <div className="flex gap-2 mt-3">
        {review.images.slice(0, 3).map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt="Review"
            width={60}
            height={60}
            className="w-15 h-15 rounded-lg object-cover"
          />
        ))}
      </div>
    )}
  </motion.div>
);

export default function SellerStorePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug;

  // States
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("grid");
  const [isFollowing, setIsFollowing] = useState(false);
  const [storeStatusMessage, setStoreStatusMessage] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch store data
  const fetchStoreData = useCallback(
    async (page = 1, append = false) => {
      if (!slug) return;

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sort: sortBy,
        });

        if (selectedCategory && selectedCategory !== "all") {
          queryParams.append("category", selectedCategory);
        }
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/seller/store/${slug}?${queryParams}`
        );

        if (data?.success) {
          setSeller(data.seller);
          setProducts(
            append
              ? [...products, ...(data.products || [])]
              : data.products || []
          );
          setCategories(data.categories || []);
          setReviews(data.reviews || []);
          setReviewStats(data.reviewStats || null);
          setPagination(data.pagination || null);
          // Set status message if store is pending or inactive
          if (data.message) {
            setStoreStatusMessage(data.message);
          } else {
            setStoreStatusMessage(null);
          }
        }
      } catch (error) {
        console.error("Error fetching store:", error);
        const status = error.response?.status;
        if (status === 404) {
          toast.error("Store not found");
          setSeller(null);
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
          setSeller(null);
        } else {
          toast.error(error.response?.data?.message || "Failed to load store");
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [slug, sortBy, selectedCategory, searchQuery, products]
  );

  useEffect(() => {
    fetchStoreData(1, false);
  }, [slug, sortBy, selectedCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug) fetchStoreData(1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (pagination?.hasMore && !isLoadingMore) {
      fetchStoreData(pagination.currentPage + 1, true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: seller?.storeName,
          text: `Check out ${seller?.storeName} on our marketplace!`,
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed store" : "Following store!");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header Skeleton */}
          <div className="relative h-48 md:h-64 bg-gray-300 animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gray-300 animate-pulse border-4 border-white shadow-xl" />
              <div className="flex-1 pb-4">
                <div className="h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
          {/* Products Skeleton */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!seller) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <IoStorefront className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Store Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The store you're looking for doesn't exist or is no longer active.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Store Status Banner */}
        {/* {storeStatusMessage && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{storeStatusMessage}</span>
              </div>
            </div>
          </div>
        )} */}

        {/* Store Banner */}
        <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
          {seller.storeBanner ? (
            <Image
              src={seller.storeBanner}
              alt={seller.storeName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Share & Follow Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <FaShare className="text-lg" />
            </motion.button>
          </div>
        </div>

        {/* Store Info Section */}
        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
            {/* Store Logo */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white  shadow-xl border-4 border-white overflow-hidden">
                {seller.storeLogo ? (
                  <Image
                    src={seller.storeLogo}
                    alt={seller.storeName}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <FaStore className="text-white text-4xl md:text-5xl" />
                  </div>
                )}
              </div>
              {seller.verificationStatus === "approved" && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <MdVerified className="text-white text-lg" />
                </div>
              )}
            </div>

            {/* Store Details */}
            <div className="flex-1 -pb-4 ">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-black">
                  {seller.storeName}
                </h1>
                {seller.verificationStatus === "approved" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <MdVerified className="text-sm" />
                    Verified Seller
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {seller.storeAddress?.city && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>
                      {seller.storeAddress.city}, {seller.storeAddress.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    Joined{" "}
                    {seller.createdAt &&
                      format(new Date(seller.createdAt), "MMM yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 -pb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFollow}
                className={`px-6 py-2.5 rounded-xl cursor-pointer font-semibold transition-all flex items-center gap-2 ${
                  isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <FaHeart className={isFollowing ? "text-red-500" : ""} />
                {isFollowing ? "Following" : "Follow"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/chat?sellerId=${seller._id}`)}
                className="px-6 py-2.5 rounded-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <BiMessageDetail className="text-lg" />
                Chat
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TbPackage className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {seller.totalProducts || 0}
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Products
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <FaStar className="text-amber-500 text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {reviewStats?.avgRating?.toFixed(1) ||
                        seller.rating?.average?.toFixed(1) ||
                        "0.0"}
                    </p>
                    <FaStar className="text-amber-400 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {reviewStats?.totalReviews ||
                      seller.rating?.totalReviews ||
                      0}{" "}
                    reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FaThumbsUp className="text-emerald-500 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {seller.positivePercentage || 0}%
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Positive
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <TbTruckDelivery className="text-purple-500 text-2xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {seller.totalOrders || 0}
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center border-b border-gray-100 overflow-x-auto">
              {[
                {
                  id: "products",
                  label: "Products",
                  icon: TbPackage,
                  count: pagination?.totalProducts,
                },
                {
                  id: "reviews",
                  label: "Reviews",
                  icon: FaStar,
                  count: reviewStats?.totalReviews,
                },
                { id: "about", label: "About Store", icon: IoStorefront },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative cursor-pointer  flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-red-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.id
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeStoreTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 md:p-6"
                >
                  {/* Filters Bar */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products in this store..."
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative min-w-[180px]">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat._id || cat} value={cat._id || cat}>
                            {cat.name || cat}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Sort */}
                    <div className="relative min-w-[160px]">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Top Rated</option>
                      </select>
                      <BiSort className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-all ${
                          viewMode === "grid"
                            ? "bg-white shadow-sm text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        <IoGrid className="text-lg" />
                      </button>
                      {/* <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-all ${
                          viewMode === "list"
                            ? "bg-white shadow-sm text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        <IoList className="text-lg" />
                      </button> */}
                    </div>
                  </div>

                  {/* Products Grid */}
                  {products.length === 0 ? (
                    <div className="text-center py-16">
                      <TbPackage className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Products Found
                      </h3>
                      <p className="text-gray-500">
                        This seller hasn't added any products yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`grid gap-4 md:gap-6 ${
                          viewMode === "grid"
                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "grid-cols-1"
                        }`}
                      >
                        {products.map((product, idx) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </div>

                      {/* Load More */}
                      {pagination?.hasMore && (
                        <div className="text-center mt-8">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingMore ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="animate-spin h-5 w-5"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              `Load More (${
                                pagination.totalProducts - products.length
                              } remaining)`
                            )}
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 md:p-6"
                >
                  {/* Review Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Overall Rating */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center">
                      <p className="text-5xl font-bold text-gray-900 mb-2">
                        {reviewStats?.avgRating?.toFixed(1) || "0.0"}
                      </p>
                      <StarRating
                        rating={reviewStats?.avgRating || 0}
                        size="lg"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {reviewStats?.totalReviews || 0} reviews
                      </p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewStats?.[`rating${star}`] || 0;
                        const percentage =
                          reviewStats?.totalReviews > 0
                            ? (count / reviewStats.totalReviews) * 100
                            : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="flex items-center gap-1 w-12 text-sm text-gray-600">
                              {star}{" "}
                              <FaStar className="text-amber-400 text-xs" />
                            </span>
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.1 * (5 - star),
                                }}
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                              />
                            </div>
                            <span className="w-12 text-sm text-gray-500 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-16">
                      <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500">
                        Be the first to review products from this store!
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {reviews.map((review, idx) => (
                        <ReviewCard key={review._id || idx} review={review} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 md:p-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Store Info */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <IoStorefront className="text-red-500" />
                          Store Information
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <FaStore className="text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Store Name
                              </p>
                              <p className="text-gray-900">
                                {seller.storeName}
                              </p>
                            </div>
                          </div>
                          {seller.storeDescription && (
                            <div className="flex items-start gap-3">
                              <BiMessageDetail className="text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Description
                                </p>
                                <p className="text-gray-900">
                                  {seller.storeDescription}
                                </p>
                              </div>
                            </div>
                          )}
                          {seller.storeAddress && (
                            <div className="flex items-start gap-3">
                              <FaMapMarkerAlt className="text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Location
                                </p>
                                <p className="text-gray-900">
                                  {[
                                    seller.storeAddress.address,
                                    seller.storeAddress.city,
                                    seller.storeAddress.state,
                                    seller.storeAddress.country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <FaCalendarAlt className="text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Member Since
                              </p>
                              <p className="text-gray-900">
                                {seller.createdAt &&
                                  format(
                                    new Date(seller.createdAt),
                                    "MMMM dd, yyyy"
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <FaEnvelope className="text-red-500" />
                          Contact Information
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          {seller.contactEmail && (
                            <div className="flex items-center gap-3">
                              <FaEnvelope className="text-gray-400" />
                              <a
                                href={`mailto:${seller.contactEmail}`}
                                className="text-gray-900 hover:text-red-600 transition-colors"
                              >
                                {seller.contactEmail}
                              </a>
                            </div>
                          )}
                          {seller.contactPhone && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-gray-400" />
                              <a
                                href={`tel:${seller.contactPhone}`}
                                className="text-gray-900 hover:text-red-600 transition-colors"
                              >
                                {seller.contactPhone}
                              </a>
                            </div>
                          )}
                          {seller.socialLinks?.website && (
                            <div className="flex items-center gap-3">
                              <FaGlobe className="text-gray-400" />
                              <a
                                href={seller.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-900 hover:text-red-600 transition-colors"
                              >
                                {seller.socialLinks.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges & Policies */}
                    <div className="space-y-6">
                      {/* Trust Badges */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <TbShieldCheck className="text-red-500" />
                          Trust & Safety
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-emerald-50 rounded-xl p-4 text-center">
                            <MdVerified className="text-emerald-500 text-3xl mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-900">
                              Verified Seller
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <FaShieldAlt className="text-blue-500 text-3xl mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-900">
                              Secure Payments
                            </p>
                          </div>
                          <div className="bg-amber-50 rounded-xl p-4 text-center">
                            <MdLocalShipping className="text-amber-500 text-3xl mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-900">
                              Fast Delivery
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <BiMessageDetail className="text-purple-500 text-3xl mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-900">
                              24/7 Support
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      {(seller.socialLinks?.facebook ||
                        seller.socialLinks?.instagram ||
                        seller.socialLinks?.twitter) && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Follow Us
                          </h3>
                          <div className="flex items-center gap-3">
                            {seller.socialLinks?.facebook && (
                              <a
                                href={seller.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                              >
                                <FaFacebook className="text-xl" />
                              </a>
                            )}
                            {seller.socialLinks?.instagram && (
                              <a
                                href={seller.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                              >
                                <FaInstagram className="text-xl" />
                              </a>
                            )}
                            {seller.socialLinks?.twitter && (
                              <a
                                href={seller.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                              >
                                <FaTwitter className="text-xl" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Store Owner */}
                      {seller.user && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Store Owner
                          </h3>
                          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            {seller.user.avatar ? (
                              <Image
                                src={seller.user.avatar}
                                alt={seller.user.name}
                                width={56}
                                height={56}
                                className="w-14 h-14 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                                {seller.user.name?.charAt(0) || "U"}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">
                                {seller.user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {seller.user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
