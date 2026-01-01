"use client";

import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import {
  LuLoaderCircle,
  LuLock,
  LuSparkles,
  LuShieldCheck,
  LuEye,
  LuEyeOff,
  LuKeyRound,
  LuHouse,
} from "react-icons/lu";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();
  const params = useParams();
  const token = params?.id;

  // Password strength checker
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordStrength < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.put(`${authUri}/update/password/${token}`, {
        password,
      });

      if (data) {
        setSuccess(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/authentication");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-white">
      {/* Animated Background with Glowing Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
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
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-green-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-teal-400/25 to-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-300/20 to-emerald-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-lime-300/15 to-green-400/10 rounded-full blur-3xl"
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
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 transition-all group"
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
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />

          <AnimatePresence mode="wait">
            {!success ? (
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <LuKeyRound className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
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
                    Create New Password
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Your new password must be different from previous passwords
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                        focusedField === "password"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                        focusedField === "password"
                          ? "bg-white border-emerald-400 shadow-lg shadow-emerald-100"
                          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <LuLock
                        className={`w-5 h-5 transition-colors duration-300 ${
                          focusedField === "password"
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        required
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <LuEyeOff className="w-5 h-5" />
                        ) : (
                          <LuEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                        focusedField === "confirmPassword"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                        focusedField === "confirmPassword"
                          ? "bg-white border-emerald-400 shadow-lg shadow-emerald-100"
                          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <LuShieldCheck
                        className={`w-5 h-5 transition-colors duration-300 ${
                          focusedField === "confirmPassword"
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        required
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <LuEyeOff className="w-5 h-5" />
                        ) : (
                          <LuEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Password Strength Indicator */}
                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  i < passwordStrength
                                    ? strengthColors[passwordStrength - 1]
                                    : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength > 0
                                ? strengthColors[passwordStrength - 1].replace(
                                    "bg-",
                                    "text-"
                                  )
                                : "text-slate-400"
                            }`}
                          >
                            {passwordStrength > 0
                              ? strengthLabels[passwordStrength - 1]
                              : "Too weak"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              password.length >= 8
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            8+ chars
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              /[A-Z]/.test(password)
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            Uppercase
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              /[0-9]/.test(password)
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            Number
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              /[^A-Za-z0-9]/.test(password)
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            Special
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password Match Indicator */}
                  <AnimatePresence>
                    {confirmPassword.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 text-xs ${
                          password === confirmPassword
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {password === confirmPassword ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Passwords match
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Passwords don&apos;t match
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        password !== confirmPassword ||
                        passwordStrength < 2
                      }
                      className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <LuLoaderCircle className="w-5 h-5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            Reset Password
                            <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                  transition={{ delay: 0.7 }}
                  className="text-center mt-8"
                >
                  <button
                    type="button"
                    onClick={() => router.push("/authentication")}
                    className="text-slate-500 hover:text-slate-700 cursor-pointer text-sm transition-colors"
                  >
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
                    Password Updated!
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Your password has been successfully updated. You will be
                    redirected to login shortly.
                  </p>

                  {/* Countdown */}
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <LuLoaderCircle className="w-4 h-4 animate-spin" />
                    Redirecting to login...
                  </div>
                </motion.div>

                {/* Manual Redirect Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <button
                    type="button"
                    onClick={() => router.push("/authentication")}
                    className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 transition-transform group-hover:scale-105" />
                    <span className="relative flex items-center justify-center gap-2">
                      Go to Login
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-emerald-400/20 blur-2xl rounded-full" />
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
