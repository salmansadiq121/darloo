"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  StarHalf,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  BadgeCheck,
  MessageSquare,
  User,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";

// Star Rating Display Component
const StarRating = ({ rating, size = "sm" }) => {
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${sizes[size]} text-yellow-400 fill-yellow-400`}
        />
      ))}
      {hasHalfStar && (
        <StarHalf className={`${sizes[size]} text-yellow-400 fill-yellow-400`} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizes[size]} text-gray-300`} />
      ))}
    </div>
  );
};

// Rating Distribution Bar
const RatingBar = ({ rating, count, total, onClick, isActive }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full py-1.5 px-2 rounded-lg transition-all ${
        isActive ? "bg-yellow-50 ring-1 ring-yellow-300" : "hover:bg-gray-50"
      }`}
    >
      <span className="text-sm text-gray-600 w-16">{rating} stars</span>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-yellow-400 rounded-full"
        />
      </div>
      <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
    </button>
  );
};

// Media Lightbox Component
const MediaLightbox = ({ media, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentMedia = media[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 text-white hover:text-gray-300 p-2"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div
        className="max-w-4xl max-h-[80vh] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {currentMedia.type === "video" ? (
          <video
            src={currentMedia.url}
            controls
            className="max-w-full max-h-[80vh] rounded-lg"
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Review media"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 text-white hover:text-gray-300 p-2"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {media.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Single Review Card Component
const ReviewCard = ({ review, onVote, onViewMedia, currentUserId }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const hasVotedHelpful = review.helpfulVoters?.includes(currentUserId);
  const hasVotedUnhelpful = review.unhelpfulVoters?.includes(currentUserId);
  const commentLimit = 300;
  const isLongComment =
    review.comment && review.comment.length > commentLimit;

  const handleVote = async (voteType) => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(review._id, voteType);
    setIsVoting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        {/* User Info & Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900">
              {review.user?.name || "Anonymous"}
            </h4>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <BadgeCheck className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm text-gray-400">
              <Calendar className="w-3 h-3 inline mr-1" />
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h3 className="text-lg font-medium text-gray-900 mt-4">
          {review.title}
        </h3>
      )}

      {/* Review Comment */}
      {review.comment && (
        <div className="mt-3">
          <p className="text-gray-600 leading-relaxed">
            {showFullComment || !isLongComment
              ? review.comment
              : `${review.comment.slice(0, commentLimit)}...`}
          </p>
          {isLongComment && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-red-500 text-sm font-medium mt-1 hover:text-red-600"
            >
              {showFullComment ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* Media Gallery */}
      {review.media && review.media.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {review.media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onViewMedia(review.media, idx)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden group"
            >
              {item.type === "video" ? (
                <>
                  <img
                    src={item.thumbnail || item.url}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.thumbnail || item.url}
                  alt="Review media"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Seller Response */}
      {review.sellerResponse?.comment && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800 text-sm">
              {review.sellerResponse.sellerName || "Seller"} Response
            </span>
            <span className="text-xs text-blue-500">
              {review.sellerResponse.respondedAt &&
                formatDate(review.sellerResponse.respondedAt)}
            </span>
          </div>
          <p className="text-sm text-blue-700">
            {review.sellerResponse.comment}
          </p>
        </div>
      )}

      {/* Comment Replies */}
      {review.commentReplies && review.commentReplies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
            {review.commentReplies.length} replies
            {showReplies ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200"
              >
                {review.commentReplies.map((reply, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {reply.user?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {reply.createdAt && formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{reply.comment}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Helpful Votes */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">Was this review helpful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("helpful")}
            disabled={isVoting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
              hasVotedHelpful
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{review.helpfulVotes || 0}</span>
          </button>
          <button
            onClick={() => handleVote("unhelpful")}
            disabled={isVoting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
              hasVotedUnhelpful
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{review.unhelpfulVotes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Review Section Component
export default function ReviewSection({
  productId,
  reviews: initialReviews = [],
  averageRating = 0,
  totalReviews = 0,
  onWriteReview,
}) {
  const { auth } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filters & Sorting
  const [ratingFilter, setRatingFilter] = useState(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withMediaOnly, setWithMediaOnly] = useState(false);
  const [sortBy, setSortBy] = useState("most_recent");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const reviewsPerPage = 10;

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        dist[Math.floor(r.rating)]++;
      }
    });
    return dist;
  }, [reviews]);

  // Fetch reviews with filters
  const fetchReviews = async (resetPage = false) => {
    if (!productId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: resetPage ? 1 : page,
        limit: reviewsPerPage,
        sortBy,
      });

      if (ratingFilter) params.append("rating", ratingFilter);
      if (verifiedOnly) params.append("verifiedOnly", "true");
      if (withMediaOnly) params.append("withMedia", "true");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/${productId}/reviews?${params}`
      );

      if (data.success) {
        if (resetPage) {
          setReviews(data.reviews);
          setPage(1);
        } else {
          setReviews((prev) =>
            page === 1 ? data.reviews : [...prev, ...data.reviews]
          );
        }
        setHasMore(data.reviews.length === reviewsPerPage);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchReviews(true);
  }, [ratingFilter, verifiedOnly, withMediaOnly, sortBy, productId]);

  // Vote on a review
  const handleVote = async (reviewId, voteType) => {
    if (!auth?.user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/review/${productId}/${reviewId}/vote`,
        { voteType }
      );

      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? {
                  ...r,
                  helpfulVotes: data.review.helpfulVotes,
                  unhelpfulVotes: data.review.unhelpfulVotes,
                  helpfulVoters: data.review.helpfulVoters,
                  unhelpfulVoters: data.review.unhelpfulVoters,
                }
              : r
          )
        );
        toast.success(
          voteType === "helpful" ? "Marked as helpful" : "Marked as unhelpful"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record vote");
    }
  };

  // Open media lightbox
  const handleViewMedia = (media, index) => {
    setLightboxMedia(media);
    setLightboxIndex(index);
  };

  // Load more reviews
  const loadMore = () => {
    setPage((prev) => prev + 1);
    fetchReviews();
  };

  // Clear all filters
  const clearFilters = () => {
    setRatingFilter(null);
    setVerifiedOnly(false);
    setWithMediaOnly(false);
    setSortBy("most_recent");
  };

  const hasActiveFilters =
    ratingFilter || verifiedOnly || withMediaOnly || sortBy !== "most_recent";

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-gray-500 text-sm mt-1">
            Based on {totalReviews} reviews
          </p>
        </div>
        {onWriteReview && (
          <button
            onClick={onWriteReview}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center lg:min-w-[180px]">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="lg" />
            <p className="text-gray-500 text-sm mt-2">
              {totalReviews} total reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={ratingDistribution[rating]}
                total={totalReviews}
                onClick={() =>
                  setRatingFilter(ratingFilter === rating ? null : rating)
                }
                isActive={ratingFilter === rating}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="most_recent">Most Recent</option>
              <option value="most_helpful">Most Helpful</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    verifiedOnly
                      ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  Verified Purchases
                </button>
                <button
                  onClick={() => setWithMediaOnly(!withMediaOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    withMediaOnly
                      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  With Images/Videos
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && reviews.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-400">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Be the first to review this product!"}
            </p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onVote={handleVote}
                onViewMedia={handleViewMedia}
                currentUserId={auth?.user?._id}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-colors inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Reviews"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Media Lightbox */}
      <AnimatePresence>
        {lightboxMedia && (
          <MediaLightbox
            media={lightboxMedia}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxMedia(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
