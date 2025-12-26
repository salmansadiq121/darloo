"use client";
import React from "react";
import { Check, ShoppingCart, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, name: "Cart Review", icon: ShoppingCart },
  { id: 2, name: "Shipping", icon: Truck },
  { id: 3, name: "Payment", icon: CreditCard },
];

export default function CheckoutStepper({ currentStep = 1, onStepClick }) {
  return (
    <div className="w-full py-4 px-2 sm:px-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = step.id <= currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full
                    transition-all duration-300 transform
                    ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : isCurrent
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110"
                        : "bg-gray-200 text-gray-400"
                    }
                    ${isClickable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"}
                  `}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}

                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={`
                    mt-2 text-xs sm:text-sm font-medium text-center
                    ${isCurrent ? "text-red-600" : isCompleted ? "text-green-600" : "text-gray-400"}
                  `}
                >
                  {step.name}
                </span>

                {/* Step number badge */}
                <span
                  className={`
                    absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                    text-[10px] font-bold rounded-full
                    ${isCompleted ? "bg-green-600 text-white" : isCurrent ? "bg-red-600 text-white" : "bg-gray-300 text-gray-600"}
                  `}
                >
                  {step.id}
                </span>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        isCompleted ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress text */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </div>
  );
}
