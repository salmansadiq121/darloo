"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import TrendingProducts from "@/app/components/Home/TrendingProducts";
import CheckoutElement from "@/app/components/checkout/CheckoutElement";
import CheckoutStepper from "@/app/components/checkout/CheckoutStepper";
import SellerProductGroup from "@/app/components/checkout/SellerProductGroup";
import OrderSummaryCard from "@/app/components/checkout/OrderSummaryCard";
import ShippingForm from "@/app/components/checkout/ShippingForm";
import PaymentMethodSelector from "@/app/components/checkout/PaymentMethodSelector";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

export default function Checkout() {
  const { auth, selectedProduct, setSelectedProduct } = useAuth();
  const [shippingFee, setShippingFee] = useState(0);
  const [cart, setCart] = useState({
    user: "",
    products: [],
    totalAmount: "",
    shippingFee: 0,
    discount: 0,
    shippingAddress: {
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
    },
    paymentMethod: "Credit Card",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  // Fetch Trending Products
  useEffect(() => {
    setIsLoading(true);
    const fetchTrendingProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/trending/products`
        );
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrendingProducts();
  }, []);

  // Group products by seller
  const groupedProducts = useMemo(() => {
    const groups = {};
    selectedProduct?.forEach((item) => {
      const sellerId = item.sellerId || item.seller || "marketplace";
      const sellerName = item.sellerName || item.storeName || "Darloo Store";
      const storeLogo = item.storeLogo || "";

      if (!groups[sellerId]) {
        groups[sellerId] = {
          sellerId,
          sellerName,
          storeLogo,
          products: [],
          subtotal: 0,
          estimatedDelivery: { min: 3, max: 7 },
        };
      }
      groups[sellerId].products.push(item);
      groups[sellerId].subtotal +=
        parseFloat(item.price || 0) * (item.quantity || 1);
    });
    return Object.values(groups);
  }, [selectedProduct]);

  // Update Quantity
  const updateQuantity = (id, newQuantity) => {
    setSelectedProduct((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        const matches = item._id === id || item.combinationId === id;
        if (matches) {
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Remove Product
  const removeProduct = (id) => {
    setSelectedProduct((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item._id !== id && item.combinationId !== id
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success("Item removed from cart");
  };

  // Get Total Price
  const getSubtotal = () => {
    return selectedProduct.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  // Apply Voucher
  const applyVoucher = async () => {
    if (!voucherCode) {
      toast.error("Please enter a voucher code");
      return;
    }
    setLoading(true);
    try {
      const subtotal = getSubtotal();
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/apply/order`,
        {
          code: voucherCode,
          cartItems: selectedProduct.map((item) => ({
            productId: item._id || item.product,
            price: item.price,
            quantity: item.quantity,
          })),
          cartTotal: parseFloat(subtotal || 0),
        }
      );
      if (data) {
        setDiscount(data.discount);
        toast.success("Voucher applied successfully!");
        setIsVoucherApplied(true);
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error(error.response?.data?.message || "Invalid voucher code");
    } finally {
      setLoading(false);
    }
  };

  // Get Shipping Fee
  useEffect(() => {
    const getShippingFee = async () => {
      if (!auth?.user?.addressDetails?.country) return;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/${auth.user.addressDetails.country}`
        );
        if (data) {
          setCountry(data?.shipping?.country || "");
          setShippingFee(data?.shipping?.fee ?? 0);
        }
      } catch (error) {
        console.error("Error getting shipping fee:", error);
      }
    };
    getShippingFee();
  }, [auth?.user?.addressDetails?.country]);

  // Update Cart
  useEffect(() => {
    const subtotal = getSubtotal();
    const discountAmount = parseFloat(discount || 0);
    const shipping = parseFloat(shippingFee || 0);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const gst = subtotalAfterDiscount * 0.01;
    const finalTotal = subtotalAfterDiscount + shipping + gst;

    setCart({
      user: auth?.user?._id,
      products: selectedProduct,
      totalAmount: finalTotal.toFixed(2),
      discount: discountAmount,
      couponCode: isVoucherApplied ? voucherCode : "",
      shippingFee: shipping,
      shippingAddress: {
        address: auth?.user?.addressDetails?.address || "",
        country: auth?.user?.addressDetails?.country || "",
        state: auth?.user?.addressDetails?.state || "",
        city: auth?.user?.addressDetails?.city || "",
        postalCode: auth?.user?.addressDetails?.pincode || "",
      },
    });
  }, [selectedProduct, auth?.user, discount, shippingFee, voucherCode, isVoucherApplied]);

  // Calculate totals
  const subtotal = getSubtotal();
  const tax = (subtotal - discount) * 0.01;
  const total = subtotal - discount + shippingFee + tax;

  // Validation
  const isFormValid =
    auth?.user?.name &&
    auth?.user?.email &&
    auth?.user?.number &&
    auth?.user?.addressDetails?.address &&
    auth?.user?.addressDetails?.country &&
    auth?.user?.addressDetails?.city;

  const canCheckout =
    selectedProduct?.length > 0 && isFormValid && total <= 150 && country;

  // Handle Checkout
  const handleCheckout = () => {
    if (!auth?.user) {
      router.push("/authentication");
      return;
    }

    if (!isFormValid) {
      toast.error("Please complete your shipping information");
      setCurrentStep(2);
      return;
    }

    if (total > 150) {
      toast.error("Order total cannot exceed €150. Please adjust your cart.");
      return;
    }

    if (!country) {
      toast.error("Shipping not available in your country");
      return;
    }

    setCurrentStep(3);
    setShowPayment(true);
  };

  // Handle Step Change
  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      if (step < 3) {
        setShowPayment(false);
      }
    }
  };

  // Navigate steps
  const goToNextStep = () => {
    if (currentStep === 1 && selectedProduct?.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (currentStep === 2 && !isFormValid) {
      toast.error("Please complete shipping information");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowPayment(false);
    }
  };

  return (
    <MainLayout title="Darloo - Checkout">
      <div className="bg-gray-50 min-h-screen w-full relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 z-10">
        {/* Progress Stepper */}
        <CheckoutStepper currentStep={currentStep} onStepClick={handleStepClick} />

        <div className="max-w-7xl mx-auto mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Cart Review */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ShoppingBag className="w-6 h-6 text-red-500" />
                      <h2 className="text-xl font-bold text-gray-800">
                        Review Your Cart
                      </h2>
                      <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full">
                        {selectedProduct?.length || 0} items
                      </span>
                    </div>

                    {selectedProduct?.length === 0 ? (
                      <div className="bg-white rounded-xl p-8 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          Your cart is empty
                        </h3>
                        <p className="text-gray-400 mb-4">
                          Add some products to continue shopping
                        </p>
                        <button
                          onClick={() => router.push("/products")}
                          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Browse Products
                        </button>
                      </div>
                    ) : (
                      groupedProducts.map((group) => (
                        <SellerProductGroup
                          key={group.sellerId}
                          sellerName={group.sellerName}
                          storeLogo={group.storeLogo}
                          products={group.products}
                          estimatedDelivery={group.estimatedDelivery}
                          subtotal={group.subtotal}
                          onQuantityChange={updateQuantity}
                          onRemoveProduct={removeProduct}
                        />
                      ))
                    )}

                    {selectedProduct?.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          onClick={goToNextStep}
                          className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Continue to Shipping
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Shipping & Payment */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <ShippingForm
                      user={auth?.user}
                      shippingAddress={cart.shippingAddress}
                      isEditing={isEditingShipping}
                      setIsEditing={setIsEditingShipping}
                    />

                    <PaymentMethodSelector
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                    />

                    <div className="flex justify-between">
                      <button
                        onClick={goToPrevStep}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                      </button>
                      <button
                        onClick={handleCheckout}
                        disabled={!canCheckout}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Proceed to Payment
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment Processing */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Complete Your Payment
                      </h3>
                      <p className="text-gray-600">
                        Your payment window is open. Please complete the payment
                        to place your order.
                      </p>
                    </div>

                    <button
                      onClick={goToPrevStep}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Shipping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummaryCard
                subtotal={subtotal}
                shippingFee={shippingFee}
                tax={tax}
                discount={discount}
                total={total}
                itemCount={selectedProduct?.length || 0}
                voucher={voucherCode}
                onVoucherChange={setVoucherCode}
                onVoucherApply={applyVoucher}
                isVoucherApplied={isVoucherApplied}
                isApplyingVoucher={loading}
                onCheckout={handleCheckout}
                isCheckoutDisabled={!canCheckout || !auth?.user}
                isProcessing={showPayment}
              />
            </div>
          </div>

          {/* Trending Products - Hide when payment modal is open */}
          {!showPayment && (
            <div className="mt-12">
              <TrendingProducts products={products} loading={isLoading} />
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <CheckoutElement
            setpayment={setShowPayment}
            carts={cart}
            shippingFee={shippingFee}
          />
        )}
      </div>
    </MainLayout>
  );
}
