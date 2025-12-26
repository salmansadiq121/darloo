"use client";

import { useState, useRef } from "react";
import {
  Star,
  X,
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  BadgeCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const MAX_MEDIA_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export default function AddReviewModal({
  setShow,
  productId,
  setProductId,
  countryCode,
  orderId = null,
  isVerifiedPurchase = false,
  productName = "",
  productImage = "",
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef(null);
  const isGerman = countryCode === "DE";

  const characterLimit = 1000;
  const remainingChars = characterLimit - review.length;

  // Rating descriptions
  const ratingDescriptions = {
    1: isGerman ? "Sehr schlecht" : "Very Poor",
    2: isGerman ? "Schlecht" : "Poor",
    3: isGerman ? "Durchschnittlich" : "Average",
    4: isGerman ? "Gut" : "Good",
    5: isGerman ? "Ausgezeichnet" : "Excellent",
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (mediaFiles.length + files.length > MAX_MEDIA_FILES) {
      toast.error(`Maximum ${MAX_MEDIA_FILES} files allowed`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        continue;
      }

      // Check file type
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a supported format`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        type: isImage ? "image" : "video",
        uploading: false,
        uploaded: false,
        url: null,
      });
    }

    setMediaFiles((prev) => [...prev, ...validFiles]);
    e.target.value = ""; // Reset input
  };

  // Remove a media file
  const removeMedia = (index) => {
    setMediaFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Upload media files to server
  const uploadMediaFiles = async () => {
    const uploadedMedia = [];

    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaItem = mediaFiles[i];
      if (mediaItem.uploaded && mediaItem.url) {
        uploadedMedia.push({
          type: mediaItem.type,
          url: mediaItem.url,
          thumbnail: mediaItem.thumbnail || mediaItem.url,
        });
        continue;
      }

      try {
        setMediaFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], uploading: true };
          return newFiles;
        });

        const formData = new FormData();
        formData.append("file", mediaItem.file);
        formData.append("upload_preset", "e-commerce");

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "drvrkvnpa";
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          formData
        );

        const uploadedUrl = response.data.secure_url;
        const thumbnail =
          mediaItem.type === "video"
            ? uploadedUrl.replace(/\.[^/.]+$/, ".jpg")
            : uploadedUrl;

        uploadedMedia.push({
          type: mediaItem.type,
          url: uploadedUrl,
          thumbnail,
        });

        setMediaFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i] = {
            ...newFiles[i],
            uploading: false,
            uploaded: true,
            url: uploadedUrl,
            thumbnail,
          };
          return newFiles;
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${mediaItem.file.name}`);
        setMediaFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], uploading: false };
          return newFiles;
        });
      }
    }

    return uploadedMedia;
  };

  // Submit review
  const handleReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error(isGerman ? "Bitte wählen Sie eine Bewertung" : "Please select a rating");
      return;
    }

    if (review.trim() === "") {
      toast.error(isGerman ? "Bitte schreiben Sie eine Bewertung" : "Please write a review");
      return;
    }

    setLoading(true);
    setUploadingMedia(true);

    try {
      // Upload media files first
      let uploadedMedia = [];
      if (mediaFiles.length > 0) {
        uploadedMedia = await uploadMediaFiles();
      }
      setUploadingMedia(false);

      // Submit review
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/review/${productId}`,
        {
          rating,
          title: title.trim(),
          review: review.trim(),
          media: uploadedMedia,
          orderId: orderId,
        }
      );

      if (data) {
        toast.success(
          isGerman
            ? "Bewertung erfolgreich eingereicht"
            : "Review submitted successfully"
        );
        // Cleanup
        mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
        setRating(0);
        setTitle("");
        setReview("");
        setMediaFiles([]);
        setProductId("");
        setShow(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman ? "Etwas ist schief gelaufen" : "Something went wrong")
      );
    } finally {
      setLoading(false);
      setUploadingMedia(false);
    }
  };

  const handleClose = () => {
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
    setShow(false);
    setRating(0);
    setTitle("");
    setReview("");
    setMediaFiles([]);
    setProductId("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isGerman ? "Bewertung schreiben" : "Write a Review"}
                </h2>
                {productName && (
                  <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                    {productName}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleReview} className="p-6 space-y-6">
            {/* Product Preview */}
            {productImage && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {productName}
                  </p>
                  {isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {isGerman ? "Verifizierter Kauf" : "Verified Purchase"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <Label className="block mb-3 text-sm font-semibold text-gray-700">
                {isGerman ? "Ihre Bewertung" : "Your Rating"} *
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          (hoveredRating ? hoveredRating >= star : rating >= star)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {(hoveredRating || rating) > 0 && (
                    <motion.span
                      key={hoveredRating || rating}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-sm font-medium text-gray-600 ml-2"
                    >
                      {ratingDescriptions[hoveredRating || rating]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <Label
                htmlFor="title"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                {isGerman ? "Titel" : "Review Title"}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder={
                  isGerman
                    ? "Geben Sie Ihrer Bewertung einen Titel"
                    : "Summarize your experience"
                }
                className="w-full border-gray-200 focus:ring-red-500 focus:border-red-500"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {title.length}/100
              </p>
            </div>

            {/* Review Text */}
            <div>
              <Label
                htmlFor="review"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                {isGerman ? "Ihre Bewertung" : "Your Review"} *
              </Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, characterLimit))}
                placeholder={
                  isGerman
                    ? "Teilen Sie Ihre Erfahrung mit diesem Produkt..."
                    : "Share your experience with this product..."
                }
                className="w-full min-h-[150px] border-gray-200 focus:ring-red-500 focus:border-red-500 resize-none"
                required
              />
              <p
                className={`text-xs mt-1 text-right ${
                  remainingChars < 100 ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {remainingChars} {isGerman ? "Zeichen übrig" : "characters remaining"}
              </p>
            </div>

            {/* Media Upload */}
            <div>
              <Label className="block mb-3 text-sm font-semibold text-gray-700">
                {isGerman ? "Fotos & Videos hinzufügen" : "Add Photos & Videos"}
                <span className="font-normal text-gray-400 ml-2">
                  ({isGerman ? "Optional" : "Optional"})
                </span>
              </Label>

              {/* Upload Area */}
              {mediaFiles.length < MAX_MEDIA_FILES && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/50 transition-colors"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    {isGerman
                      ? "Klicken zum Hochladen oder ziehen"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isGerman
                      ? `Bilder (JPG, PNG, WebP) oder Videos (MP4, WebM) - max. ${MAX_MEDIA_FILES} Dateien`
                      : `Images (JPG, PNG, WebP) or Videos (MP4, WebM) - max ${MAX_MEDIA_FILES} files`}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Media Previews */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {mediaFiles.map((media, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                    >
                      {media.type === "video" ? (
                        <>
                          <video
                            src={media.preview}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={media.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Loading overlay */}
                      {media.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}

                      {/* Uploaded indicator */}
                      {media.uploaded && (
                        <div className="absolute top-1 left-1 bg-green-500 rounded-full p-0.5">
                          <BadgeCheck className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more button */}
                  {mediaFiles.length < MAX_MEDIA_FILES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs mt-1">
                        {isGerman ? "Hinzufügen" : "Add"}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    {isGerman ? "Tipps für eine hilfreiche Bewertung" : "Tips for a helpful review"}
                  </h4>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>
                      {isGerman
                        ? "• Beschreiben Sie, wie Sie das Produkt verwenden"
                        : "• Describe how you use the product"}
                    </li>
                    <li>
                      {isGerman
                        ? "• Erwähnen Sie Vor- und Nachteile"
                        : "• Mention pros and cons"}
                    </li>
                    <li>
                      {isGerman
                        ? "• Fügen Sie Fotos hinzu, um Ihre Bewertung zu veranschaulichen"
                        : "• Add photos to illustrate your review"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-6"
                disabled={loading}
              >
                {isGerman ? "Abbrechen" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={loading || rating === 0 || review.trim() === ""}
                className="px-6 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingMedia
                      ? isGerman
                        ? "Hochladen..."
                        : "Uploading..."
                      : isGerman
                      ? "Einreichen..."
                      : "Submitting..."}
                  </span>
                ) : isGerman ? (
                  "Bewertung einreichen"
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
