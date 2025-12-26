"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  Check,
  Clock,
  Diamond,
  Package,
  ShieldCheck,
  RefreshCw,
  Leaf,
  Settings,
  Feather,
  ArrowLeft,
  MessageCircle,
  Store,
  Verified,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/app/components/Layout/Layout";
import axios from "axios";
import ProductCarousel from "@/app/components/ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";
import ShareData from "@/app/utils/Share";
import ReviewSection from "@/app/components/Product/ReviewSection";
import AddReviewModal from "@/app/components/Profile/ReviewModal";

export default function ProductDetail() {
  const { setSelectedProduct, setOneClickBuyProduct, countryCode } = useAuth();
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const productRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [varientPrice, setVarientPrice] = useState(0);
  const {} = useAuth();
  const [selectedImage, setSelectedImage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState("");

  // Determine language based on country code
  const isGerman = countryCode === "DE";

  const defaultHighlights = isGerman
    ? [
        {
          text: "Hochwertige Materialien für Langlebigkeit",
          icon: ShieldCheck,
        },
        { text: "Ergonomisches Design für Komfort", icon: Feather },
        { text: "Leicht und tragbar", icon: Package },
        { text: "Einfach zu reinigen und zu pflegen", icon: RefreshCw },
        {
          text: "Kompatibel mit den meisten Standardzubehörteilen",
          icon: Settings,
        },
        { text: "Umweltfreundliche und nachhaltige Herstellung", icon: Leaf },
        { text: "Elegantes und modernes Design", icon: Star },
        { text: "Zuverlässige Leistung mit langer Lebensdauer", icon: Check },
      ]
    : [
        { text: "High-quality materials for durability", icon: ShieldCheck },
        { text: "Ergonomic design for comfort", icon: Feather },
        { text: "Lightweight and portable", icon: Package },
        { text: "Easy to clean and maintain", icon: RefreshCw },
        { text: "Compatible with most standard accessories", icon: Settings },
        { text: "Eco-friendly and sustainable manufacturing", icon: Leaf },
        { text: "Sleek and modern aesthetics", icon: Star },
        { text: "Reliable performance with long lifespan", icon: Check },
      ];

  // Translations
  const t = {
    productDetail: isGerman ? "Produktdetails" : "Product Details",
    shippingReturns: isGerman ? "Versand & Rückgabe" : "Shipping & Returns",
    review: isGerman ? "Bewertungen" : "Reviews",
    description: isGerman ? "Beschreibung" : "Description",
    productHighlights: isGerman ? "Produkt-Highlights" : "Product Highlights",
    addToWishlist: isGerman ? "Zur Wunschliste hinzufügen" : "Add to Wishlist",
    shareProduct: isGerman ? "Produkt teilen" : "Share Product",
    buyNow: isGerman ? "Jetzt kaufen" : "Buy Now",
    oneClickBuy: isGerman ? "Mit einem Klick kaufen" : "One Click Buy",
    checkout: isGerman ? "Zur Kasse" : "Checkout",
    quantity: isGerman ? "Menge" : "Quantity",
    color: isGerman ? "Farbe" : "Color",
    size: isGerman ? "Größe" : "Size",
    price: isGerman ? "Preis" : "Price",
    estimatedPrice: isGerman ? "Geschätzter Preis" : "Estimated Price",
    addToCart: isGerman ? "In den Warenkorb" : "Add to Cart",
    product: isGerman ? "Produkt" : "Product",

    productInformation: isGerman
      ? "Produktinformationen"
      : "Product Information",
    category: isGerman ? "Kategorie" : "Category",
    availableColors: isGerman ? "Verfügbare Farben" : "Available Colors",
    availableSizes: isGerman ? "Verfügbare Größen" : "Available Sizes",
    shippingFee: isGerman ? "Versandkosten" : "Shipping Fee",
    customerReviews: isGerman ? "Kundenbewertungen" : "Customer Reviews",
    customersSaying: isGerman
      ? "Was unsere Kunden sagen"
      : "See What Our Customers Are Saying",
    rating: isGerman ? "Bewertung" : "Rating",
    returnPolicy: isGerman ? "Rückgaberecht" : "Return Policy",
    shippingInformation: isGerman
      ? "Versandinformationen"
      : "Shipping Information",
  };

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window?.location?.origin);
    }
  }, []);

  // Get all available images (variations) with their titles and color codes
  const getAllImages = useMemo(() => {
    const imagesWithDetails = [];
    if (product?.variations?.length > 0) {
      product.variations.forEach((variation) => {
        if (variation.imageURL) {
          imagesWithDetails.push({
            url: variation.imageURL,
            title: variation.title || product.name, // Use variation title or product name as fallback
            colorCode: variation.color,
            price: variation.price,
          });
        }
      });
    }
    return imagesWithDetails;
  }, [product?.variations, product?.name]);

  // Get current image based on active index
  const getCurrentImage = useMemo(() => {
    return (
      getAllImages[activeImageIndex]?.url ||
      getAllImages[0]?.url ||
      "/placeholder.svg"
    );
  }, [getAllImages, activeImageIndex]);

  // Set default selected color when product loads
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
      // Set initial image based on first color's variation if available
      const firstColor = product.colors[0];
      const matchingVariation = product?.variations?.find(
        (v) => v.color === firstColor.code
      );
      if (matchingVariation && matchingVariation.imageURL) {
        const imageIndex = getAllImages.findIndex(
          (imgObj) => imgObj.url === matchingVariation.imageURL
        );
        if (imageIndex !== -1) {
          setActiveImageIndex(imageIndex);
        }
      }
    }
  }, [product?.colors, selectedColor, getAllImages, product?.variations]);

  // Improved color selection handler with better state management
  const handleColorSelection = useCallback(
    (color) => {
      setSelectedColor(color.name);
      // Find matching variation by color code
      const matchingVariation = product?.variations?.find(
        (v) => v.color === color.code
      );
      if (matchingVariation && matchingVariation.imageURL) {
        // Find the index of the matching variation image in getAllImages
        const imageIndex = getAllImages.findIndex(
          (imgObj) => imgObj.url === matchingVariation.imageURL
        );
        if (imageIndex !== -1) {
          // Immediately update the active image index
          setActiveImageIndex(imageIndex);
        }
      }
    },
    [product?.variations, getAllImages]
  );

  // Product data
  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/product/detail/${productId}`
      );
      setProduct(data.product);
      setReturnPolicy(data.return_policy);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // Handle Add to Cart - Creates separate entries for each color/size combination
  const handleAddToCart = (product) => {
    if (!product || !product._id) return;

    // Create a unique identifier for this color/size combination
    const combinationId = `${product._id}_${selectedColor}_${selectedSize}`;

    setSelectedProduct((prevProducts) => {
      const updatedProducts = [...prevProducts];

      // Check if exact combination (product + color + size) already exists
      const existingCombinationIndex = updatedProducts.findIndex((p) => {
        const pCombinationId = `${p?.product}_${p?.colors?.[0] || ""}_${
          p?.sizes?.[0] || ""
        }`;
        return pCombinationId === combinationId;
      });

      if (existingCombinationIndex !== -1) {
        // If exact combination exists, just update quantity
        const existingProduct = {
          ...updatedProducts[existingCombinationIndex],
        };
        existingProduct.quantity += quantity;
        updatedProducts[existingCombinationIndex] = existingProduct;
        toast.success(`Quantity updated for ${selectedColor} ${selectedSize}`);
      } else {
        // Create a new separate entry for this color/size combination
        updatedProducts.push({
          product: product._id,
          quantity,
          price: varientPrice > 0 ? varientPrice : product.price,
          image: selectedImage || getCurrentImage || product.thumbnails,
          colors: [selectedColor],
          sizes: [selectedSize],
          title: product.name,
          _id: `${product._id}_${Date.now()}`, // Unique ID for this combination
          combinationId: combinationId, // Store combination ID for easy lookup
        });
        toast.success(`Added ${selectedColor} ${selectedSize} to cart`);
      }

      localStorage.setItem("cart", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  // One Click Buy Now
  const handleOneClickBuy = async (product) => {
    const combinationId = `${product._id}_${selectedColor}_${selectedSize}`;
    const productData = {
      product: product._id,
      quantity,
      price: varientPrice > 0 ? varientPrice : product.price,
      image: selectedImage || getCurrentImage || product.thumbnails,
      colors: [selectedColor],
      sizes: [selectedSize],
      title: product.name,
      _id: `${product._id}_${Date.now()}`,
      combinationId: combinationId,
    };
    localStorage.setItem("oneClickBuyProduct", JSON.stringify(productData));
    setOneClickBuyProduct(productData);
    router.push("/oneclick/checkout");
  };

  // Calculate average rating
  const averageRating =
    product?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
    product?.reviews?.length;

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  product?.reviews?.forEach((review) => {
    const ratingIndex = Math.floor(review.rating) - 1;
    if (ratingIndex >= 0 && ratingIndex < 5) {
      ratingDistribution[ratingIndex]++;
    }
  });

  // Calculate sale end time - only if sale is active and has future expiry
  const saleEndDate = useMemo(() => {
    if (!product?.sale?.isActive || !product?.sale?.saleExpiry) return null;
    const expiryDate = new Date(product?.sale?.saleExpiry);
    // Only return date if it's in the future
    return expiryDate.getTime() > Date.now() ? expiryDate : null;
  }, [product?.sale?.isActive, product?.sale?.saleExpiry]);

  // Check if sale is actually active (has time remaining)
  const isSaleActive = useMemo(() => {
    if (!saleEndDate) return false;
    return saleEndDate.getTime() > Date.now();
  }, [saleEndDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!saleEndDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Calculate initial time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      };
    };

    // Set initial value
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (initial.expired) return;

    const timer = setInterval(() => {
      const result = calculateTimeLeft();
      setTimeLeft(result);

      if (result.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndDate]);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === getAllImages.length - 1 ? 0 : prev + 1
    );
  };
  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? getAllImages.length - 1 : prev - 1
    );
  };

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Handle sticky add to cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (!productRef.current) return;
      const productPosition = productRef.current.getBoundingClientRect().top;
      const productHeight = productRef.current.offsetHeight;
      const scrollPosition = window.scrollY;
      if (scrollPosition > productPosition + productHeight / 2) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch related products
  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/category/${product?.category?._id}`
      );
      setRelatedProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
    // eslint-disable-next-line
  }, [product?.category?._id]);

  const handleFavorite = (productId) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(productId)) {
      favorites = favorites.filter((id) => id !== productId);
    } else {
      favorites.push(productId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(product?._id)) {
      setIsWishlisted(true);
    }
  }, [product]);

  // Add product to recent View Products
  useEffect(() => {
    if (!product?._id) return;
    const now = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const viewDate = new Date().toISOString();
    let recentProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];
    recentProducts = recentProducts.filter(
      (item) => now - item.timestamp < threeDaysInMs
    );
    const existingIndex = recentProducts.findIndex(
      (item) => item.id === product._id
    );
    if (existingIndex === -1) {
      recentProducts.push({ id: product._id, timestamp: now, viewDate });
    } else {
      recentProducts[existingIndex].timestamp = now;
      recentProducts[existingIndex].viewDate = viewDate;
    }
    localStorage.setItem("recentProducts", JSON.stringify(recentProducts));
  }, [product]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex space-x-2">
                <Skeleton className="h-24 w-24 rounded" />
                <Skeleton className="h-24 w-24 rounded" />
                <Skeleton className="h-24 w-24 rounded" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div>
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-14 flex-1 rounded-xl" />
                <Skeleton className="h-14 flex-1 rounded-xl" />
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-14 w-14 rounded-xl" />
              </div>
            </div>
          </div>
          <Skeleton className="h-14 w-full max-w-md mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // If product data is empty after loading
  // if (!loading && (!product || Object.keys(product).length === 0)) {
  //   return (
  //     <div className="bg-white min-h-screen flex items-center justify-center flex-col">
  //       <div className="container mx-auto px-4 py-8 max-w-7xl">
  //         <div className="text-center py-12">
  //           <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //             Product Not Found
  //           </h2>
  //           <p className="text-gray-600 mb-6">
  //             The product you&apos;re looking for doesn&apos;t exist or has been
  //             removed.
  //           </p>
  //           <Button asChild>
  //             <Link href="/products">
  //               <ArrowLeft className="mr-2 h-4 w-4" />
  //               Back to Products
  //             </Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <MainLayout title="Product Detail - Darloo">
      <div className="bg-gradient-to-b from-gray-50 via-white to-white min-h-screen relative z-10">
        {/* Modern Breadcrumb */}
        <div className="bg-gradient-to-r from-white via-gray-50/50 to-white border-b border-gray-100 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center text-sm text-gray-600 flex-wrap gap-2">
              <Link
                href="/"
                className="hover:text-red-600 transition-colors duration-200 font-medium flex items-center gap-1 group"
              >
                <span className="group-hover:translate-x-[-2px] transition-transform">
                  Home
                </span>
              </Link>
              {product?.category?.name && (
                <>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href="/categories"
                    className="hover:text-red-600 transition-colors duration-200 font-medium capitalize"
                  >
                    {product?.category?.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-red-600 font-semibold truncate max-w-[200px] sm:max-w-none">
                {product?.name?.slice(0, 40)}
                {product?.name?.length > 40 && "..."}
              </span>
            </div>
          </div>
        </div>
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl"
          ref={productRef}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/*---------------------------
              Left  Product Images - Modern Design
            --------------------------*/}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-zoom-in"
                ref={imageRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => {
                  setIsFullscreen(true);
                  setFullscreenIndex(activeImageIndex);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div
                    className={`relative w-full h-full transition-transform duration-300 ease-out ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={getCurrentImage || "/placeholder.svg"}
                      alt={product?.name || "Product"}
                      fill
                      className="object-contain p-2"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                {/* Navigation arrows - Modern Design */}
                {getAllImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100 pointer-events-auto group/prev"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700 group-hover/prev:text-red-600 transition-colors" />
                      <span className="sr-only">Previous image</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100 pointer-events-auto group/next"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700 group-hover/next:text-red-600 transition-colors" />
                      <span className="sr-only">Next image</span>
                    </Button>
                  </div>
                )}
                {product?.estimatedPrice &&
                  product?.estimatedPrice > product?.price && (
                    <motion.div
                      className="absolute top-4 left-4 z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <div className="bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 text-white shadow-2xl border-2 border-white/30">
                        <Diamond size={14} className="animate-pulse" />
                        {product?.estimatedPrice > product?.price
                          ? `${(
                              (1 - product?.price / product?.estimatedPrice) *
                              100
                            ).toFixed(0)}% OFF`
                          : ""}
                      </div>
                    </motion.div>
                  )}
                {product?.trending && (
                  <motion.div
                    className="absolute top-4 right-4 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-4 py-2 text-sm rounded-full shadow-xl border-2 border-white/30 backdrop-blur-sm">
                      🔥 Trending
                    </Badge>
                  </motion.div>
                )}
                {isZoomed && (
                  <motion.div
                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-gray-800 shadow-xl border border-gray-200 flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>🔍 Hover to zoom</span>
                    <span className="text-gray-400">|</span>
                    <span>Click for fullscreen</span>
                  </motion.div>
                )}
                {/* Fullscreen Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                    setFullscreenIndex(activeImageIndex);
                  }}
                  className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-xl border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Open fullscreen"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              </div>
              {/* Modern Thumbnail Gallery */}
              {getAllImages.length > 1 && (
                <div className="space-y-4">
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-1">
                    {getAllImages.map((imageObj, index) => {
                      const isActive = activeImageIndex === index;
                      return (
                        <motion.button
                          key={index}
                          className={`relative h-16 w-16 sm:h-20 sm:w-20 min-w-[5rem] sm:min-w-24 cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-300 bg-white ${
                            isActive
                              ? "border-red-600 shadow-xl ring-4 ring-red-500/20 scale-100"
                              : "border-gray-200 hover:border-red-400 hover:shadow-lg"
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Image
                            src={imageObj.url || "/placeholder.svg"}
                            alt={
                              imageObj.title || product?.name || "Product image"
                            }
                            fill
                            className={`object-cover transition-transform duration-300 ${
                              isActive ? "scale-90" : "scale-100"
                            }`}
                            loading="lazy"
                            sizes="(max-width: 640px) 5rem, 6rem"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-red-600/10" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {/* Modern Image Counter */}
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold px-4 py-1.5 bg-white/80 backdrop-blur-sm border-gray-300 shadow-sm"
                    >
                      <span className="text-red-600 font-bold">
                        {activeImageIndex + 1}
                      </span>
                      <span className="mx-1 text-gray-400">/</span>
                      <span className="text-gray-600">
                        {getAllImages.length}
                      </span>
                    </Badge>
                  </div>
                </div>
              )}
            </motion.div>
            {/* -------------------Modern Product Info---------------------- */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/category/${product?.category?.name?.toLowerCase()}`}
                    className="group"
                  >
                    <Badge
                      variant="outline"
                      className="text-xs font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 cursor-pointer border-2 px-3 py-1"
                    >
                      {product?.category?.name}
                    </Badge>
                  </Link>
                  {product?.trending && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xs px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-200 border-0">
                      🔥 Trending
                    </Badge>
                  )}
                </div>
                <h1 className="text-sm sm:text-[15px] lg:text-[17px] font-bold tracking-tight text-gray-900 leading-snug">
                  {product?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 transition-all ${
                            i < Math.floor(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < averageRating
                              ? "fill-yellow-300 text-yellow-300 opacity-60"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1.5 text-xs font-bold text-gray-900">
                      {averageRating ? averageRating?.toFixed(1) : "0.0"}
                    </span>
                    <span className="mx-1.5 text-gray-300 h-3 w-px bg-gray-300"></span>
                    <Link
                      href="#reviews"
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                      {product?.reviews?.length || 0}{" "}
                      {isGerman ? "Bewertungen" : "Reviews"}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      {product?.purchased || 0}
                    </span>
                    <span>{isGerman ? "verkauft" : "sold"}</span>
                  </div>
                </div>
              </div>
              {/* Modern Price Section - Enhanced */}
              <motion.div
                className="relative overflow-hidden rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Background with glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,113,133,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,146,60,0.1),transparent_50%)]" />

                <div className="relative p-5 border-2 border-red-100/50 rounded-2xl backdrop-blur-sm">
                  <div className="space-y-3">
                    {/* Price Display */}
                    <div className="flex items-start gap-3 flex-wrap">
                      <motion.div
                        className="flex items-baseline gap-0.5"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <span className="text-sm font-medium text-gray-600">
                          €
                        </span>
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                          {varientPrice > 0
                            ? varientPrice?.toLocaleString()
                            : product?.price?.toLocaleString()}
                        </span>
                      </motion.div>

                      {product?.estimatedPrice > product?.price && (
                        <motion.div
                          className="flex flex-col items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="text-sm text-gray-400 line-through decoration-red-400 decoration-2">
                            €{product?.estimatedPrice?.toLocaleString()}
                          </span>
                          <motion.div
                            className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/25"
                            whileHover={{ scale: 1.05 }}
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-[11px] font-bold text-white">
                              {isGerman ? "Spare" : "Save"} €
                              {(
                                product?.estimatedPrice -
                                (varientPrice > 0
                                  ? varientPrice
                                  : product?.price)
                              )?.toLocaleString()}
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                    {/* Sale Countdown - Only shows when sale is active with time remaining */}
                    {isSaleActive &&
                      !timeLeft?.expired &&
                      (timeLeft?.days > 0 ||
                        timeLeft?.hours > 0 ||
                        timeLeft?.minutes > 0 ||
                        timeLeft?.seconds > 0) && (
                        <motion.div
                          className="mt-4 relative overflow-hidden rounded-2xl"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 100,
                          }}
                        >
                          {/* Animated gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_100%] animate-gradient" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

                          <div className="relative p-4">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              >
                                <Clock className="h-4 w-4 text-white drop-shadow-lg" />
                              </motion.div>
                              <span className="text-xs font-bold text-white tracking-wide drop-shadow-lg">
                                {isGerman
                                  ? "⚡ ANGEBOT ENDET IN"
                                  : "⚡ FLASH SALE ENDS IN"}
                              </span>
                              <motion.span
                                className="text-sm"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                🔥
                              </motion.span>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                              {[
                                {
                                  value: timeLeft?.days,
                                  label: isGerman ? "Tage" : "Days",
                                  icon: "📅",
                                },
                                {
                                  value: timeLeft?.hours,
                                  label: isGerman ? "Std" : "Hours",
                                  icon: "⏰",
                                },
                                {
                                  value: timeLeft?.minutes,
                                  label: isGerman ? "Min" : "Mins",
                                  icon: "⏱️",
                                },
                                {
                                  value: timeLeft?.seconds,
                                  label: isGerman ? "Sek" : "Secs",
                                  icon: "⚡",
                                },
                              ].map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  className="relative group"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 + idx * 0.1 }}
                                >
                                  <div className="absolute inset-0 bg-white rounded-lg blur-sm opacity-90 group-hover:opacity-100 transition-opacity" />
                                  <div className="relative bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-xl border border-white/50 group-hover:scale-105 transition-transform duration-300">
                                    <motion.div
                                      className="text-base sm:text-lg font-black bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent"
                                      key={item.value}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {String(item.value || 0).padStart(2, "0")}
                                    </motion.div>
                                    <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">
                                      {item.label}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Urgency message */}
                            <motion.div
                              className="mt-3 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                </span>
                                {isGerman
                                  ? "Beeilen Sie sich! Begrenztes Angebot"
                                  : "Hurry! Limited time offer"}
                              </span>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <motion.div
                        className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -1 }}
                      >
                        <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                          <Truck className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900">
                            {isGerman ? "Kostenloser Versand" : "Free Shipping"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {isGerman ? "3-5 Werktage" : "3-5 business days"}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -1 }}
                      >
                        <div className="p-1.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors">
                          <Package className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900">
                            {product?.quantity > 0
                              ? isGerman
                                ? "Auf Lager"
                                : "In Stock"
                              : isGerman
                              ? "Ausverkauft"
                              : "Out of Stock"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {product?.quantity > 0 ? (
                              <span className="text-green-600 font-medium">
                                {product?.quantity}{" "}
                                {isGerman ? "verfügbar" : "available"}
                              </span>
                            ) : (
                              <span className="text-red-500">
                                {isGerman ? "Bald wieder da" : "Coming soon"}
                              </span>
                            )}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -1 }}
                      >
                        <div className="p-1.5 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg group-hover:from-purple-200 group-hover:to-violet-200 transition-colors">
                          <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900">
                            {isGerman ? "Sichere Zahlung" : "Secure Payment"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {isGerman ? "SSL verschlüsselt" : "SSL encrypted"}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -1 }}
                      >
                        <div className="p-1.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                          <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900">
                            {isGerman ? "Einfache Rückgabe" : "Easy Returns"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {isGerman ? "14 Tage Rückgabe" : "14-day returns"}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
              <div className="space-y-6 lg:space-y-8">
                {/* Modern Variation Selector */}
                {getAllImages?.length > 1 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-900">
                      {isGerman ? "Variationen auswählen" : "Select Variation"}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2">
                      {getAllImages?.map((imageObj, index) => {
                        const isActive = activeImageIndex === index;
                        return (
                          <motion.button
                            key={index}
                            className={`relative h-10 sm:h-11 flex items-center gap-1.5 cursor-pointer rounded border-2 overflow-hidden transition-all duration-300 bg-white ${
                              isActive
                                ? "border-red-600 shadow-lg "
                                : "border-gray-200 hover:border-red-400 hover:shadow-md"
                            }`}
                            onClick={() => {
                              setActiveImageIndex(index);
                              setSelectedImage(imageObj.url);
                              setVarientPrice(imageObj?.price);
                              setSelectedColor(imageObj?.title);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                              <Image
                                src={imageObj.url || "/placeholder.svg"}
                                alt={
                                  imageObj.title ||
                                  product?.name ||
                                  "Product image"
                                }
                                fill
                                className="object-fill"
                                loading="lazy"
                                sizes="(max-width: 640px) 3rem, 4rem"
                              />
                              {isActive && (
                                <div className="absolute inset-0 bg-red-600/10 border-2 border-red-600" />
                              )}
                            </div>
                            <div className="text-gray-800 text-[10px] font-medium capitalize px-1.5 pr-3 line-clamp-2 text-left">
                              {imageObj?.title}
                            </div>
                            {isActive && (
                              <div className="absolute top-0.5 right-0.5 bg-red-600 rounded-full p-0.5">
                                <Check className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Colors */}
                {/* {product?.colors?.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-medium text-gray-900">
                      Color: {selectedColor}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product?.colors?.map((color) => {
                        const hasVariation = product?.variations?.some(
                          (v) => v.color === color.code
                        );
                        return (
                          <TooltipProvider key={color._id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                                    selectedColor === color?.name
                                      ? "border-primary ring-4 ring-primary/20"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                  style={{
                                    backgroundColor: color?.code,
                                    boxShadow:
                                      color.name === "White"
                                        ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                                        : undefined,
                                  }}
                                  onClick={() => handleColorSelection(color)}
                                  aria-label={`Select ${color?.name} color`}
                                >
                                  {selectedColor === color?.name && (
                                    <Check
                                      className={`h-6 w-6 mx-auto ${
                                        color?.name === "White"
                                          ? "text-gray-800"
                                          : "text-white"
                                      }`}
                                    />
                                  )}
                                  {hasVariation && (
                                    <div
                                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                                      title="Has variation image"
                                    />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {color?.name}{" "}
                                  {hasVariation ? "(Has variation)" : ""}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const selectedColorObj = product?.colors?.find(
                          (c) => c.name === selectedColor
                        );
                        const hasMatchingVariation =
                          selectedColorObj &&
                          product?.variations?.some(
                            (v) => v.color === selectedColorObj.code
                          );
                        return hasMatchingVariation ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span>Showing {selectedColor} variation image</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <span>
                              Showing default image for {selectedColor}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )} */}
                {product?.sizes?.length > 0 && product?.sizes[0] !== "" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900">
                        {isGerman ? "Größe" : "Size"}
                      </h3>
                      <Link
                        href="#"
                        className="text-[11px] text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center group"
                      >
                        {isGerman ? "Größen-Richtlinie" : "Size guide"}
                        <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product?.sizes?.map((size) => (
                        <motion.button
                          key={size}
                          className={`h-8 min-w-8 rounded-md border-2 px-3 font-semibold text-xs transition-all duration-300 ${
                            selectedSize === size
                              ? "border-red-600 bg-red-600 text-white shadow-lg ring-2 ring-red-500/20 scale-105"
                              : "border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50 hover:text-red-700 bg-white"
                          }`}
                          onClick={() => setSelectedSize(size)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-900">
                    {isGerman ? "Menge" : "Quantity"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md cursor-pointer border-2 border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <div className="flex h-8 w-12 items-center justify-center border-2 border-red-600 text-white bg-gradient-to-r from-red-600 to-red-700 text-sm font-bold shadow-md rounded-md">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md cursor-pointer border-2 border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={increaseQuantity}
                      disabled={quantity >= product?.quantity}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                    <div className="ml-3 text-xs text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {product?.quantity || 0}
                      </span>{" "}
                      {isGerman ? "verfügbar" : "available"}
                    </div>
                  </div>
                </div>
              </div>
              {/* Modern Action Buttons - Enhanced */}
              <div className="space-y-4 pt-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    className="flex-1 relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                    <Button
                      className="relative w-full h-10 cursor-pointer rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                      size="lg"
                      onClick={() => handleAddToCart(product)}
                      title={
                        isGerman
                          ? "Jede Farbe/Größe-Kombination wird als separates Produkt hinzugefügt"
                          : "Each color/size combination will be added as a separate item"
                      }
                    >
                      <ShoppingCart className="mr-1.5 h-4 w-4" />
                      {isGerman ? "In den Warenkorb" : "Add to Cart"}
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1 relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                    <Button
                      className="relative w-full h-10 text-xs font-bold rounded-lg cursor-pointer bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                      size="lg"
                      onClick={() => {
                        handleOneClickBuy(product);
                        setShowStickyBar(false);
                      }}
                    >
                      <span className="mr-1.5">⚡</span>
                      {isGerman ? "Jetzt kaufen" : "Buy Now"}
                    </Button>
                  </motion.div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: isWishlisted ? 0 : 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isWishlisted
                          ? "bg-gradient-to-br from-red-50 to-pink-50 text-red-600 border-red-300 shadow-md shadow-red-500/20"
                          : "border-gray-200 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:border-red-300 hover:text-red-600 bg-white"
                      }`}
                      onClick={() => {
                        setIsWishlisted(!isWishlisted);
                        handleFavorite(product._id);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all ${
                          isWishlisted
                            ? "fill-red-500 text-red-500 animate-pulse"
                            : ""
                        }`}
                      />
                      <span className="sr-only">{t.addToWishlist}</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShow(true)}
                      className="h-10 w-10 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 hover:text-blue-600 bg-white transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </motion.div>
                  <div className="flex-1 hidden sm:flex items-center justify-end gap-1.5 text-[10px] text-gray-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    <span>
                      {isGerman
                        ? "100% sichere Zahlung"
                        : "100% Secure Checkout"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Modern Product Highlights */}
              <div className="mt-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-xl p-4 border-2 border-gray-200 shadow-lg">
                <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  {t.productHighlights}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(product?.features?.length > 0
                    ? product.features.map((feature) => ({
                        text: feature,
                        icon: Check,
                      }))
                    : defaultHighlights
                  ).map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-xs text-gray-700 bg-white/60 backdrop-blur-sm p-2.5 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-white transition-all duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="p-1 bg-red-100 rounded-full mt-0.5">
                        <item.icon className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Seller Information Card */}
              {product?.seller && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-2xl p-4 sm:p-5 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    {/* Clickable Seller Info - Links to Store */}
                    <Link
                      href={`/store/${product.seller.storeSlug || product.seller._id}`}
                      className="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto group cursor-pointer"
                    >
                      {/* Seller Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-blue-200 shadow-md overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:border-blue-400 transition-colors duration-300">
                          {product?.seller?.storeLogo ? (
                            <Image
                              src={product.seller.storeLogo}
                              alt={product.seller.storeName || "Seller"}
                              fill
                              className="object-cover"
                            />
                          ) : product?.seller?.user?.avatar ? (
                            <Image
                              src={product.seller.user.avatar}
                              alt={product.seller.user.name || "Seller"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Store className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                          <Verified className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                            {product.seller.storeName || "Store"}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <Store className="w-3 h-3 mr-1" />
                            {isGerman ? "Verkäufer" : "Seller"}
                          </Badge>
                        </div>
                        {product.seller.user?.name && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            {isGerman ? "Von" : "By"} {product.seller.user.name}
                          </p>
                        )}
                        {product.seller.storeDescription && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {product.seller.storeDescription}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              {product.seller.rating?.average?.toFixed(1) || "4.8"}
                            </span>
                            {product.seller.rating?.totalReviews > 0 && (
                              <span className="text-xs text-gray-500">
                                ({product.seller.rating.totalReviews})
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {isGerman ? "Verifiziert" : "Verified Seller"}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {/* Visit Store Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Link
                          href={`/store/${product.seller.storeSlug || product.seller._id}`}
                        >
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm font-semibold"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>
                              {isGerman ? "Shop besuchen" : "Visit Store"}
                            </span>
                          </Button>
                        </Link>
                      </motion.div>

                      {/* Chat Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          onClick={() => {
                            // Navigate to chat with seller (use seller._id for seller document)
                            router.push(
                              `/chat?sellerId=${product.seller._id}&productId=${product._id}`
                            );
                          }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-semibold"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>
                            {isGerman
                              ? "Chat"
                              : "Chat"}
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          {/* Modern Tabs Section */}
          <Tabs defaultValue="details" className="w-full mt-16">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-200 p-1 shadow-lg">
              <TabsTrigger
                value="details"
                className="rounded-lg cursor-pointer px-4 min-w-fit font-medium text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-red-600"
              >
                {t.productDetail}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg cursor-pointer px-4 min-w-fit font-medium text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-red-600"
              >
                {t.review} ({product?.reviews?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-lg cursor-pointer px-4 min-w-fit font-medium text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-red-600"
              >
                {t.shippingReturns}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 animate-fadeIn">
              <Card className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
                <div className="space-y-5">
                  <div className="w-full">
                    <h3 className="text-base font-semibold text-gray-900">
                      {t.description}
                    </h3>
                    {product?.size_chart && (
                      <Image
                        src={product?.size_chart}
                        alt="size chart"
                        width={500}
                        height={500}
                        priority
                        className="rounded-lg object-contain"
                      />
                    )}
                    <div className=" w-full flex items-center justify-center">
                      <div
                        className="mt-2 text-xs text-gray-600  w-full leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: product?.description,
                        }}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {t.productInformation}
                    </h3>
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: t.category, value: product?.category?.name },
                        {
                          label: t.availableColors,
                          value: product?.variations
                            ?.map((c) => c?.title)
                            .join(", "),
                        },
                        {
                          label: t.availableSizes,
                          value: product?.sizes?.join(", "),
                        },
                        {
                          label: t.shippingFee,
                          value: `€${product?.shipping?.toLocaleString()}`,
                        },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <dt className="text-xs font-semibold text-gray-600 mb-1">
                            {item.label}
                          </dt>
                          <dd className="text-sm font-bold text-gray-900 capitalize">
                            {item.value || "N/A"}
                          </dd>
                        </motion.div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Card>
            </TabsContent>
            {/* Reviews Tab - Using new ReviewSection component */}
            <TabsContent
              value="reviews"
              className="mt-6 animate-fadeIn"
              id="reviews"
            >
              <ReviewSection
                productId={productId}
                reviews={product?.reviews || []}
                averageRating={averageRating || 0}
                totalReviews={product?.reviews?.length || 0}
                onWriteReview={() => {
                  setReviewProductId(productId);
                  setShowReviewModal(true);
                }}
              />
            </TabsContent>
            <TabsContent value="shipping" className="mt-6 animate-fadeIn">
              <Card className="p-4 rounded-lg border-gray-200 shadow-sm">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {t.shippingInformation}
                    </h3>
                    {/* <div className="mt-4 space-y-4">
                      <div className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                        <Truck className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Standard Shipping
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivery within 3-5 business days
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            €{product?.shipping?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                        <Truck className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Express Shipping
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivery within 1-5 business days
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            €{(product?.shipping * 2).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <Separator />
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: returnPolicy,
                      }}
                      className=" px-2 py-2"
                    ></div>
                    {/* <h3 className="text-xl font-semibold text-gray-900">
                      {t.returnPolicy}
                    </h3> */}
                    {/* <p className="mt-3 text-gray-600 leading-relaxed">
                      We accept returns within 14 days of delivery. Items must
                      be in their original condition with tags attached. Please
                      note that shipping costs are non-refundable, and the
                      customer is responsible for return shipping fees.
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-100">
                      <h4 className="font-medium text-gray-900">
                        How to Return
                      </h4>
                      <ol className="mt-2 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>
                          Contact our customer service team to initiate a return
                        </li>
                        <li>
                          Pack the item securely in its original packaging
                        </li>
                        <li>Ship the item back to our return address</li>
                        <li>
                          Once received and inspected, we&apos;ll process your
                          refund
                        </li>
                      </ol>
                    </div> */}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          {/*-------------------Related Products---------------------- */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {isGerman ? "Könnten Sie auch gerne" : "You May Also Like"}
              </h2>
              <div className="w-full">
                <ProductCarousel products={relatedProducts} />
              </div>
            </div>
          )}
        </div>
        {/* Sticky Add to Cart Bar (Mobile) */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text font-bold text-gray-900">
                    €{product?.price?.toLocaleString()}
                  </div>
                  {product.estimatedPrice > product.price && (
                    <div className="text-sm text-gray-500 line-through">
                      €{product?.estimatedPrice?.toLocaleString()}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {isGerman ? "In den Warenkorb" : "Add to Cart"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Fullscreen Image Viewer */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
            >
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-all duration-300 hover:scale-110"
                  aria-label="Close fullscreen"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {getAllImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenIndex((prev) =>
                          prev === 0 ? getAllImages.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all duration-300 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenIndex((prev) =>
                          prev === getAllImages.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all duration-300 hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                <motion.div
                  className="relative max-w-7xl max-h-[90vh] w-full h-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={
                      getAllImages[fullscreenIndex]?.url ||
                      getCurrentImage ||
                      "/placeholder.svg"
                    }
                    alt={product?.name || "Product"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>

                {getAllImages.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
                    {fullscreenIndex + 1} / {getAllImages.length}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Share Modal */}
        <AnimatePresence>
          {show && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isGerman ? "Produkt teilen" : "Share Product"}
                    </h2>
                    <button
                      onClick={() => setShow(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Close"
                    >
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Product Preview */}
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={
                            getCurrentImage ||
                            product?.thumbnails ||
                            "/placeholder.svg"
                          }
                          alt={product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                          {product?.name}
                        </h3>
                        <p className="text-lg font-bold text-red-600">
                          €
                          {varientPrice > 0
                            ? varientPrice?.toLocaleString()
                            : product?.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Share Options */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        {isGerman ? "Teilen über:" : "Share via:"}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            name: "Facebook",
                            icon: "📘",
                            color: "bg-blue-600 hover:bg-blue-700",
                          },
                          {
                            name: "Twitter",
                            icon: "🐦",
                            color: "bg-sky-500 hover:bg-sky-600",
                          },
                          {
                            name: "WhatsApp",
                            icon: "💬",
                            color: "bg-green-500 hover:bg-green-600",
                          },
                          {
                            name: "Email",
                            icon: "📧",
                            color: "bg-gray-600 hover:bg-gray-700",
                          },
                          {
                            name: "Copy Link",
                            icon: "🔗",
                            color: "bg-purple-600 hover:bg-purple-700",
                          },
                          {
                            name: "Pinterest",
                            icon: "📌",
                            color: "bg-red-600 hover:bg-red-700",
                          },
                          {
                            name: "LinkedIn",
                            icon: "💼",
                            color: "bg-blue-700 hover:bg-blue-800",
                          },
                          {
                            name: "Telegram",
                            icon: "✈️",
                            color: "bg-cyan-500 hover:bg-cyan-600",
                          },
                        ].map((platform) => (
                          <motion.button
                            key={platform.name}
                            className={`${platform.color} text-white p-4 rounded-xl font-semibold text-sm transition-all duration-300 flex flex-col items-center gap-2 shadow-lg hover:shadow-xl`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const url = `${currentUrl}/products/${product?._id}`;
                              const text = `${product?.name} - €${
                                varientPrice > 0 ? varientPrice : product?.price
                              }`;

                              if (platform.name === "Copy Link") {
                                navigator.clipboard.writeText(url);
                                toast.success(
                                  isGerman ? "Link kopiert!" : "Link copied!"
                                );
                              } else {
                                const shareUrls = {
                                  Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    url
                                  )}`,
                                  Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    url
                                  )}&text=${encodeURIComponent(text)}`,
                                  WhatsApp: `https://wa.me/?text=${encodeURIComponent(
                                    text + " " + url
                                  )}`,
                                  Email: `mailto:?subject=${encodeURIComponent(
                                    product?.name
                                  )}&body=${encodeURIComponent(
                                    text + " " + url
                                  )}`,
                                  Pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                                    url
                                  )}&description=${encodeURIComponent(text)}`,
                                  LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    url
                                  )}`,
                                  Telegram: `https://t.me/share/url?url=${encodeURIComponent(
                                    url
                                  )}&text=${encodeURIComponent(text)}`,
                                };
                                if (shareUrls[platform.name]) {
                                  window.open(
                                    shareUrls[platform.name],
                                    "_blank"
                                  );
                                }
                              }
                            }}
                          >
                            <span className="text-2xl">{platform.icon}</span>
                            <span>{platform.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* URL Copy */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        {isGerman ? "Produkt-URL:" : "Product URL:"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`${currentUrl}/products/${product?._id}`}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 text-sm bg-gray-50"
                        />
                        <motion.button
                          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${currentUrl}/products/${product?._id}`
                            );
                            toast.success(
                              isGerman ? "Link kopiert!" : "Link copied!"
                            );
                          }}
                        >
                          {isGerman ? "Kopieren" : "Copy"}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        {showReviewModal && (
          <AddReviewModal
            setShow={setShowReviewModal}
            productId={reviewProductId}
            setProductId={setReviewProductId}
            countryCode={countryCode}
            productName={product?.name}
            productImage={getCurrentImage || product?.thumbnails}
          />
        )}
      </div>
    </MainLayout>
  );
}
