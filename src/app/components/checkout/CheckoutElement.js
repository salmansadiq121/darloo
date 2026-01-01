"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Shield, Lock, CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CheckOutForm from "./CheckoutForm";
import Cookies from "js-cookie";

// Load stripe ONCE at module level - this is critical
const stripePromise = loadStripe(
  "pk_test_51OoTmdDy4uT85vUQJcAXdDEWUTSjn2zxNMRy1GqzWoLAWiwAEpIl1G6E5wBcx9XxrVqTV6nsm09PhqWGZy0g0rEK00wxxaNysW"
);

export default function CheckoutElement({ carts, setpayment, shippingFee, affiliateRef }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const createPaymentIntent = async () => {
      try {
        const amount = parseFloat(carts?.totalAmount || 0);
        if (amount < 0.5) {
          throw new Error("Minimum order amount is €0.50");
        }

        const token = Cookies.get("@darloo");
        if (!token) {
          throw new Error("Please log in to continue");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/payment`,
          { amount },
          { headers: { Authorization: token } }
        );

        if (mounted && response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      }
    };

    createPaymentIntent();
    return () => { mounted = false; };
  }, [carts?.totalAmount]);

  const handleClose = () => setpayment(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999999] flex items-start justify-center pt-8 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">Secure Payment</h2>
              <p className="text-white/80 text-sm">€{parseFloat(carts?.totalAmount || 0).toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Initializing payment...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => { setError(null); setLoading(true); }}
                className="px-6 py-2 bg-red-500 text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
              <CheckOutForm
                carts={carts}
                shippingFee={shippingFee}
                clientSecret={clientSecret}
                onClose={handleClose}
                affiliateRef={affiliateRef}
              />
            </Elements>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> PCI</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
