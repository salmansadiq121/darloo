"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Truck,
  Shield,
  Info,
  Loader2,
  CheckCircle,
  Wallet,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderSummaryCard({
  subtotal = 0,
  shippingFee = 0,
  tax = 0,
  discount = 0,
  total = 0,
  itemCount = 0,
  voucher = "",
  onVoucherApply,
  onVoucherChange,
  isVoucherApplied = false,
  isApplyingVoucher = false,
  onCheckout,
  isCheckoutDisabled = false,
  isProcessing = false,
  // Wallet props
  walletBalance = 0,
  useWallet = false,
  setUseWallet,
  walletUseAmount = 0,
  setWalletUseAmount,
  maxWalletUsable = 0,
  appliedWallet = 0,
  // Points props
  pointsBalance = 0,
  usePoints = false,
  setUsePoints,
  pointsToUse = 0,
  setPointsToUse,
  maxPointsUsable = 0,
  appliedPoints = 0,
  pointsDiscount = 0,
  pointsConversionRate = 100,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [showPointsInput, setShowPointsInput] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-4"
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-white font-semibold text-lg">Order Summary</h3>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {itemCount} items
          </span>
          <button className="md:hidden text-white">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Price Breakdown */}
            <div className="p-4 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  &euro;{parseFloat(subtotal).toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Shipping</span>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    title="Shipping fee varies by location"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </div>
                <span
                  className={`font-medium ${
                    shippingFee === 0 ? "text-green-600" : ""
                  }`}
                >
                  {shippingFee === 0
                    ? "FREE"
                    : `€${parseFloat(shippingFee).toFixed(2)}`}
                </span>
              </div>

              {/* Tax */}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Tax (GST 1%)</span>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Goods and Services Tax"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-medium">
                    &euro;{parseFloat(tax).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>Discount</span>
                  </div>
                  <span className="font-medium">
                    -&euro;{parseFloat(discount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Wallet Applied */}
              {appliedWallet > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <div className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    <span>Wallet Applied</span>
                  </div>
                  <span className="font-medium">
                    -&euro;{parseFloat(appliedWallet).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Points Discount */}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-sm text-purple-600">
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4" />
                    <span>Points Discount ({appliedPoints} pts)</span>
                  </div>
                  <span className="font-medium">
                    -&euro;{parseFloat(pointsDiscount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 my-2" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-600">
                    &euro;{parseFloat(total).toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">Tax included</p>
                </div>
              </div>
            </div>

            {/* Voucher Section */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setShowVoucherInput(!showVoucherInput)}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mb-2"
              >
                <Tag className="w-4 h-4" />
                <span>{showVoucherInput ? "Hide" : "Have a voucher code?"}</span>
              </button>

              <AnimatePresence>
                {showVoucherInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucher}
                        onChange={(e) => onVoucherChange?.(e.target.value)}
                        placeholder="Enter voucher code"
                        disabled={isVoucherApplied}
                        className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          isVoucherApplied
                            ? "bg-green-50 border-green-300"
                            : "border-gray-200"
                        }`}
                      />
                      <button
                        onClick={onVoucherApply}
                        disabled={
                          isVoucherApplied || !voucher || isApplyingVoucher
                        }
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isVoucherApplied
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        }`}
                      >
                        {isApplyingVoucher ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isVoucherApplied ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {isVoucherApplied && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Voucher applied successfully!
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Section */}
            {walletBalance > 0 && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowWalletInput(!showWalletInput)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{showWalletInput ? "Hide" : "Use Wallet"}</span>
                  <span className="text-xs text-gray-500">
                    (&euro;{walletBalance.toFixed(2)} available)
                  </span>
                </button>

                <AnimatePresence>
                  {showWalletInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-blue-50 rounded-lg p-3 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available Balance</span>
                          <span className="font-medium text-blue-700">
                            &euro;{walletBalance.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max Usable</span>
                          <span className="font-medium text-blue-700">
                            &euro;{maxWalletUsable.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                          <span className="text-sm font-medium text-gray-700">
                            Use Wallet for Payment
                          </span>
                          <button
                            onClick={() => {
                              const newUseWallet = !useWallet;
                              setUseWallet?.(newUseWallet);
                              if (newUseWallet) {
                                setWalletUseAmount?.(maxWalletUsable);
                              } else {
                                setWalletUseAmount?.(0);
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              useWallet ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                useWallet ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {useWallet && (
                          <div className="pt-2">
                            <label className="text-xs text-gray-600 block mb-1">
                              Amount to Use
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={maxWalletUsable}
                              step="0.01"
                              value={walletUseAmount}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                const clamped = Math.min(
                                  Math.max(0, value),
                                  maxWalletUsable
                                );
                                setWalletUseAmount?.(clamped);
                              }}
                              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-blue-600 mt-1">
                              Discount: &euro;{parseFloat(walletUseAmount).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Points Section */}
            {pointsBalance > 0 && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowPointsInput(!showPointsInput)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 mb-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>{showPointsInput ? "Hide" : "Use Points"}</span>
                  <span className="text-xs text-gray-500">
                    ({pointsBalance.toLocaleString()} pts available)
                  </span>
                </button>

                <AnimatePresence>
                  {showPointsInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-purple-50 rounded-lg p-3 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available Points</span>
                          <span className="font-medium text-purple-700">
                            {pointsBalance.toLocaleString()} pts
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversion Rate</span>
                          <span className="font-medium text-purple-700">
                            {pointsConversionRate} pts = &euro;1
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max Usable</span>
                          <span className="font-medium text-purple-700">
                            {Math.floor(maxPointsUsable).toLocaleString()} pts
                            (&euro;{(maxPointsUsable / pointsConversionRate).toFixed(2)})
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-purple-100">
                          <span className="text-sm font-medium text-gray-700">
                            Use Points for Payment
                          </span>
                          <button
                            onClick={() => {
                              const newUsePoints = !usePoints;
                              setUsePoints?.(newUsePoints);
                              if (newUsePoints) {
                                setPointsToUse?.(Math.floor(maxPointsUsable));
                              } else {
                                setPointsToUse?.(0);
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              usePoints ? "bg-purple-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                usePoints ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {usePoints && (
                          <div className="pt-2">
                            <label className="text-xs text-gray-600 block mb-1">
                              Points to Use
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={Math.floor(maxPointsUsable)}
                              value={pointsToUse}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const clamped = Math.min(
                                  Math.max(0, value),
                                  Math.floor(maxPointsUsable)
                                );
                                setPointsToUse?.(clamped);
                              }}
                              className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-xs text-purple-600 mt-1">
                              Discount: &euro;{(pointsToUse / pointsConversionRate).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Checkout Button */}
            <div className="px-4 pb-4">
              <button
                onClick={onCheckout}
                disabled={isCheckoutDisabled || isProcessing}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform ${
                  isCheckoutDisabled || isProcessing
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                      &euro;{parseFloat(total).toFixed(2)}
                    </span>
                  </span>
                )}
              </button>
            </div>

            {/* Security Badges */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="https://img.icons8.com/color/24/stripe.png"
                    alt="Stripe"
                    className="w-4 h-4"
                  />
                  <span>Stripe</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <img
                    src="https://img.icons8.com/color/24/paypal.png"
                    alt="PayPal"
                    className="w-4 h-4"
                  />
                  <span>PayPal</span>
                </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
