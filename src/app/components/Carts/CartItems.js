"use client";
import { useAuth } from "@/app/content/authContent";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Package, Truck, Shield, Gift, X, Heart, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CartItems({ products }) {
  const { selectedProduct, setSelectedProduct, countryCode } = useAuth();
  const router = useRouter();
  const [removingId, setRemovingId] = useState(null);

  const isGerman = countryCode === "DE";
  const currencySymbol = "€";

  // Translations
  const t = {
    yourCart: isGerman ? "Warenkorb" : "Shopping Cart",
    items: isGerman ? "Artikel" : "items",
    item: isGerman ? "Artikel" : "item",
    emptyCart: isGerman ? "Ihr Warenkorb ist leer" : "Your cart is empty",
    emptyCartDesc: isGerman
      ? "Sieht so aus, als hätten Sie noch nichts hinzugefügt"
      : "Looks like you haven't added anything yet",
    continueShopping: isGerman ? "Weiter einkaufen" : "Continue Shopping",
    orderSummary: isGerman ? "Bestellübersicht" : "Order Summary",
    subtotal: isGerman ? "Zwischensumme" : "Subtotal",
    shipping: isGerman ? "Versand" : "Shipping",
    tax: isGerman ? "Steuer" : "Tax",
    total: isGerman ? "Gesamt" : "Total",
    checkout: isGerman ? "Zur Kasse" : "Proceed to Checkout",
    freeShipping: isGerman ? "Kostenloser Versand" : "Free Shipping",
    calculated: isGerman ? "Wird berechnet" : "Calculated at checkout",
    remove: isGerman ? "Entfernen" : "Remove",
    secureCheckout: isGerman ? "Sichere Zahlung" : "Secure Checkout",
    freeReturns: isGerman ? "Kostenlose Rückgabe" : "Free Returns",
    fastDelivery: isGerman ? "Schnelle Lieferung" : "Fast Delivery",
    qty: isGerman ? "Menge" : "Qty",
    each: isGerman ? "pro Stück" : "each",
    savedForLater: isGerman ? "Für später gespeichert" : "Move to Wishlist",
  };

  // Update Quantity with animation
  const updateQuantity = (id, change) => {
    setSelectedProduct((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Delete Product from Cart with animation
  const deleteItem = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setSelectedProduct((prevCart) => {
        const updatedCart = prevCart?.filter((item) => item._id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success(isGerman ? "Produkt entfernt" : "Product removed from cart");
        return updatedCart;
      });
      setRemovingId(null);
    }, 300);
  };

  // Get Total Price
  const getSubtotal = () => {
    return selectedProduct
      ?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  };

  const getTax = () => {
    return 0; // Tax calculated at checkout
  };

  const getShipping = () => {
    return 0; // Free shipping
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  const itemCount = selectedProduct?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Empty Cart View
  if (!products || products.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-red-400" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {t.emptyCart}
          </h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            {t.emptyCartDesc}
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
            >
              {t.continueShopping}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {t.yourCart}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              {itemCount} {itemCount === 1 ? t.item : t.items}
            </p>
          </div>
          <Link
            href="/products"
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm sm:text-base transition-colors"
          >
            {t.continueShopping}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items Section */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {products?.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: removingId === item._id ? 0 : 1,
                  x: removingId === item._id ? -100 : 0,
                  scale: removingId === item._id ? 0.8 : 1
                }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
              >
                <div className="flex gap-3 sm:gap-5">
                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => router.push(`/products/${item._id}`)}
                    className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
                      <Image
                        src={item?.image || "/placeholder.svg"}
                        alt={item?.title || "Product"}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 128px"
                      />
                    </div>
                    {item?.sale?.isActive && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        -{item.sale.discountPercentage}%
                      </div>
                    )}
                  </motion.div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Title & Remove Button Row */}
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => router.push(`/products/${item._id}`)}
                        className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
                      >
                        {item?.title}
                      </h3>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
                        aria-label={t.remove}
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Variant Info (if any) */}
                    {item?.selectedColor && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Color: <span className="font-medium">{item.selectedColor}</span>
                      </p>
                    )}
                    {item?.selectedSize && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </p>
                    )}

                    {/* Price & Quantity Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-2 sm:mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 hidden sm:inline">{t.qty}:</span>
                        <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item._id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.button>
                          <span className="w-8 sm:w-10 text-center font-semibold text-gray-900 text-sm sm:text-base">
                            {item?.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl">
                          {currencySymbol}{(item?.price * item?.quantity)?.toFixed(2)}
                        </p>
                        {item?.quantity > 1 && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            {currencySymbol}{item?.price?.toFixed(2)} {t.each}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Section */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 sticky top-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              {t.orderSummary}
            </h2>

            {/* Summary Details */}
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between text-gray-600">
                <span>{t.subtotal}</span>
                <span className="font-medium text-gray-900">
                  {currencySymbol}{getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.shipping}</span>
                <span className="text-green-600 font-medium">{t.freeShipping}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.tax}</span>
                <span className="text-gray-500 text-sm">{t.calculated}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-dashed border-gray-200"></div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">{t.total}</span>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {currencySymbol}{getTotal().toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => router.push("/checkout")}
              disabled={!selectedProduct || selectedProduct.length === 0}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t.checkout}
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center p-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight">
                    {t.secureCheckout}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight">
                    {t.fastDelivery}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight">
                    {t.freeReturns}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
              <Image src="/visa.svg" alt="Visa" width={32} height={20} className="h-5 w-auto" />
              <Image src="/mastercard.svg" alt="Mastercard" width={32} height={20} className="h-5 w-auto" />
              <Image src="/paypal.svg" alt="PayPal" width={32} height={20} className="h-5 w-auto" />
              <Image src="/applepay.svg" alt="Apple Pay" width={32} height={20} className="h-5 w-auto" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
