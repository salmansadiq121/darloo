"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/app/content/authContent";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  CreditCard,
} from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1f2937",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

const CheckOutForm = ({ carts, shippingFee, clientSecret, onClose, affiliateRef }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setSelectedProduct } = useAuth();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [cardComplete, setCardComplete] = useState(false);
  const cardElementRef = useRef(null);

  const createOrder = async (payment_info) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/stripe/create-order`,
        {
          ...carts,
          shippingFee: shippingFee,
          payment_info,
          paymentMethod: "Credit Card",
          affiliateRef: affiliateRef || null,
        }
      );
      if (data) {
        // Clear affiliate ref from localStorage after successful order
        if (affiliateRef) {
          localStorage.removeItem("affiliateRef");
          localStorage.removeItem("affiliateRefTime");
        }
        localStorage.removeItem("cart");
        setSelectedProduct([]);
        setPaymentStatus("success");
        setTimeout(() => {
          router.push("/order-success");
          toast.success("Order placed successfully!");
        }, 2000);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setPaymentStatus("error");
      setMessage(error.response?.data?.message || "Failed to create order.");
      toast.error(error.response?.data?.message || "Order creation failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Payment system not ready. Please wait...");
      return;
    }

    // Get card element BEFORE setting any state that might cause re-render
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("Card form not ready. Please refresh the page.");
      return;
    }

    // Store reference to prevent issues during async operations
    cardElementRef.current = cardElement;

    setIsLoading(true);
    setMessage("");

    try {
      // Use the stored reference
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElementRef.current,
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        setMessage(error.message || "Payment failed. Please try again.");
        setPaymentStatus("error");
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentStatus("processing");
        await createOrder(paymentIntent);
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        setMessage("Additional authentication required.");
        setPaymentStatus("error");
        setIsLoading(false);
      } else {
        setMessage("Payment failed. Please try again.");
        setPaymentStatus("error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(err.message || "An unexpected error occurred.");
      setPaymentStatus("error");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setMessage("");
    setPaymentStatus("idle");
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setMessage(event.error.message);
    } else {
      setMessage("");
    }
  };

  // Success state
  if (paymentStatus === "success") {
    return (
      <div className="text-center py-8 animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleIn">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-500 mb-4">
          Your order has been placed successfully.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to order confirmation...</span>
        </div>
      </div>
    );
  }

  // Main form - ALWAYS keep CardElement mounted until success
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Processing overlay - shows on top of form without unmounting it */}
      {paymentStatus === "processing" && (
        <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-red-200 rounded-full border-t-red-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Processing Payment...</p>
            <p className="text-gray-400 text-sm">Please wait</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {paymentStatus === "error" && message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slideDown">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Payment Failed
              </h4>
              <p className="text-sm text-red-600">{message}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Element - ALWAYS MOUNTED */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div className="border border-gray-300 rounded-lg p-4 pl-12 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Enter your card number, expiration date, and CVC
        </p>
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <strong>Test Card:</strong> 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
        </p>
      </div>

      {/* Order Confirmation */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <ShoppingBag className="w-4 h-4" />
          <span className="font-medium">Order Confirmation</span>
        </div>
        <p className="text-xs text-gray-500">
          By clicking &quot;Pay Now&quot;, you agree to our Terms of Service and confirm your
          purchase of €{parseFloat(carts?.totalAmount || 0).toFixed(2)}.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements || !cardComplete || paymentStatus === "processing"}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading || !stripe || !elements || !cardComplete || paymentStatus === "processing"
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Pay €{parseFloat(carts?.totalAmount || 0).toFixed(2)}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default CheckOutForm;
