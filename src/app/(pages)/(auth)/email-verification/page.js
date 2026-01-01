"use client";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLoaderCircle,
  LuShieldCheck,
  LuSparkles,
  LuHouse,
  LuRefreshCw,
} from "react-icons/lu";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Image from "next/image";

export default function Verification() {
  const { activationToken, setActivationToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [invalidError, setInvalidError] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && verifyNumber[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newVerifyNumber = { ...verifyNumber };
      pasteData.split("").forEach((char, i) => {
        if (i < 4) newVerifyNumber[i] = char;
      });
      setVerifyNumber(newVerifyNumber);
      inputRefs[Math.min(pasteData.length, 3)].current?.focus();
    }
  };

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    setLoading(true);
    try {
      const token = activationToken || localStorage.getItem("activation");
      const { data } = await axios.post(`${authUri}/email/verification`, {
        activation_code: verificationNumber,
        activation_token: token,
      });
      if (data) {
        toast.success(data?.message || "Account verified successfully!");
        localStorage.removeItem("activation");
        // Check if the user registered as seller
        if (data.user?.role === "seller") {
          router.push("https://dashboard.darloo.com");
        } else {
          router.push("/authentication");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Verification failed!");
      setInvalidError(true);
    } finally {
      setLoading(false);
      setActivationToken("");
    }
  };

  const handleResendCode = async () => {
    // This would typically call an API to resend the code
    setResending(true);
    try {
      // Simulate resend - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification code resent to your email!");
      setCountdown(60);
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const isComplete = Object.values(verifyNumber).every((v) => v !== "");

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-rose-50">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-red-400/30 to-rose-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-orange-400/25 to-amber-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-rose-300/20 to-pink-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-white hover:border-red-200 hover:shadow-lg hover:shadow-red-100 transition-all group"
      >
        <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <LuHouse className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/70 border border-white/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
          {/* Decorative Lines */}
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
          <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={50}
                className="h-12 w-auto object-contain"
              />
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <LuSparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-500 text-sm">
              We've sent a 4-digit code to your email.
              <br />
              Enter it below to verify your account.
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-6"
            onPaste={handlePaste}
          >
            {Object.keys(verifyNumber).map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  ref={inputRefs[index]}
                  maxLength={1}
                  value={verifyNumber[key]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-16 h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 outline-none ${
                    invalidError
                      ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                      : verifyNumber[key]
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-red-400 focus:bg-white focus:shadow-lg focus:shadow-red-100"
                  }`}
                />
                {verifyNumber[key] && !invalidError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {invalidError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm text-center mb-4"
              >
                Invalid verification code. Please try again.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={verificationHandler}
              disabled={loading || !isComplete}
              className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <LuLoaderCircle className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LuShieldCheck className="w-5 h-5" />
                    Verify Account
                  </>
                )}
              </span>
            </button>
          </motion.div>

          {/* Resend Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <p className="text-slate-500 text-sm mb-2">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <p className="text-slate-400 text-sm">
                Resend code in{" "}
                <span className="text-red-600 font-semibold">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={resending}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 mx-auto transition-colors"
              >
                {resending ? (
                  <>
                    <LuLoaderCircle className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <LuRefreshCw className="w-4 h-4" />
                    Resend Code
                  </>
                )}
              </button>
            )}
          </motion.div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 pt-6 border-t border-slate-200"
          >
            <button
              onClick={() => router.push("/authentication")}
              className="text-slate-500 cursor-pointer hover:text-slate-700 text-sm transition-colors"
            >
              Back to{" "}
              <span className="text-red-600 font-semibold">Login</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-red-400/20 blur-2xl rounded-full" />
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -250% 0;
          }
          100% {
            background-position: 250% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
