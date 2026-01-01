"use client";

import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  LuLoaderCircle,
  LuMail,
  LuSparkles,
  LuKeyRound,
  LuArrowLeft,
  LuSend,
  LuHouse,
} from "react-icons/lu";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPassword({ setActive }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${authUri}/reset/password`, {
        email,
      });

      if (data) {
        setEmailSent(true);
        toast.success("Reset password link sent to your email");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-white">
      {/* Animated Background with Glowing Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50">
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
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-rose-400/25 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-yellow-300/20 to-amber-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-red-300/15 to-rose-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-white hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100 transition-all group"
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
          {/* Decorative Elements */}
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Logo/Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <LuKeyRound className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <LuSparkles className="w-3 h-3 text-white" />
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
                    Forgot Password?
                  </h1>
                  <p className="text-slate-500 text-sm">
                    No worries, we&apos;ll send you reset instructions
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                        focusedField === "email" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                        focusedField === "email"
                          ? "bg-white border-amber-400 shadow-lg shadow-amber-100"
                          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <LuMail
                        className={`w-5 h-5 transition-colors duration-300 ${
                          focusedField === "email"
                            ? "text-amber-500"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        required
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[15px]"
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <LuLoaderCircle className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Reset Link
                            <LuSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.div>
                </form>

                {/* Back to Login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-8"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActive
                        ? setActive("login")
                        : router.push("/authentication")
                    }
                    className="inline-flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700 text-sm transition-colors group"
                  >
                    <LuArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <motion.svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </motion.svg>
                    </div>
                    {/* Ripple Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-green-500"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    Check Your Email
                  </h2>
                  <p className="text-slate-500 text-sm mb-2">
                    We&apos;ve sent a password reset link to
                  </p>
                  <p className="text-amber-600 font-medium mb-6">{email}</p>
                  <p className="text-slate-400 text-xs mb-8">
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                      type="button"
                      onClick={() => setEmailSent(false)}
                      className="text-amber-500 hover:text-amber-600 underline underline-offset-2"
                    >
                      try again
                    </button>
                  </p>
                </motion.div>

                {/* Open Email Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-4"
                >
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform group-hover:scale-105" />
                    <span className="relative flex items-center justify-center gap-2">
                      Open Email App
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      setActive
                        ? setActive("login")
                        : router.push("/authentication")
                    }
                    className="w-full py-3 rounded-xl font-medium text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    Back to Login
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-400/20 blur-2xl rounded-full" />
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
      `}</style>
    </div>
  );
}
