"use client";
import React from "react";
import { CreditCard, Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, AMEX",
    icon: "https://img.icons8.com/color/48/stripe.png",
    badges: [
      "https://img.icons8.com/color/32/visa.png",
      "https://img.icons8.com/color/32/mastercard.png",
      "https://img.icons8.com/color/32/amex.png",
    ],
  },
  // {
  //   id: "paypal",
  //   name: "PayPal",
  //   description: "Pay securely with PayPal",
  //   icon: "https://img.icons8.com/color/48/paypal.png",
  //   badges: [],
  // },
];

export default function PaymentMethodSelector({
  selectedMethod = "card",
  onMethodChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-800">Payment Method</h3>
        </div>
      </div>

      {/* Payment Options */}
      <div className="p-4 space-y-3">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onMethodChange?.(method.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
              selectedMethod === method.id
                ? "border-red-500 bg-red-50/50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            {/* Radio Circle */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedMethod === method.id
                  ? "border-red-500 bg-red-500"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === method.id && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>

            {/* Icon */}
            <img
              src={method.icon}
              alt={method.name}
              className="w-10 h-10 object-contain"
            />

            {/* Method Info */}
            <div className="flex-1 text-left">
              <p
                className={`font-medium ${
                  selectedMethod === method.id
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
              >
                {method.name}
              </p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>

            {/* Card Badges */}
            {method.badges.length > 0 && (
              <div className="flex items-center gap-1">
                {method.badges.map((badge, idx) => (
                  <img
                    key={idx}
                    src={badge}
                    alt="card"
                    className="w-8 h-5 object-contain"
                  />
                ))}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Security Info */}
      <div className="px-4 pb-4">
        <div className="bg-green-50 rounded-lg p-3 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Secure Payment</p>
            <p className="text-xs text-green-600 mt-0.5">
              Your payment information is encrypted and secure. We never store
              your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Icons Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <img
            src="https://img.icons8.com/color/32/visa.png"
            alt="Visa"
            className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://img.icons8.com/color/32/mastercard.png"
            alt="Mastercard"
            className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://img.icons8.com/color/32/amex.png"
            alt="Amex"
            className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://img.icons8.com/color/32/paypal.png"
            alt="PayPal"
            className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          <img
            src="https://img.icons8.com/color/32/stripe.png"
            alt="Stripe"
            className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-green-500" />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
