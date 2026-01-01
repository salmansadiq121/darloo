"use client";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuEye,
  LuEyeOff,
  LuLoaderCircle,
  LuLock,
  LuShieldCheck,
  LuSparkles,
  LuHouse,
  LuCheck,
  LuX,
} from "react-icons/lu";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Image from "next/image";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const router = useRouter();
  const { id: token } = useParams();

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((passed) => {
      if (passed) score++;
    });

    return {
      score,
      checks,
      label: score < 2 ? "Weak" : score < 4 ? "Medium" : "Strong",
      color: score < 2 ? "red" : score < 4 ? "amber" : "emerald",
    };
  }, [password]);

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const passwordsMismatch =
    password && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(`${authUri}/update/password`, {
        newPassword: password,
        token: token,
      });

      if (data) {
        toast.success("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        router.push(`/authentication`);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    emerald: "bg-green-500",
  };

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
              Update Password
            </h1>
            <p className="text-slate-500 text-sm">
              Create a new secure password for your account.
              <br />
              Make sure it's strong and unique.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  required
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-14 px-5 pr-12 text-[15px] text-slate-800 bg-slate-50 border-2 rounded-xl transition-all duration-300 outline-none ${
                    focused === "password"
                      ? "border-red-400 bg-white shadow-lg shadow-red-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {/* Strength Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            strengthColors[passwordStrength.color]
                          }`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.color === "red"
                            ? "text-red-500"
                            : passwordStrength.color === "amber"
                            ? "text-amber-500"
                            : "text-green-500"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { key: "length", label: "8+ characters" },
                        { key: "lowercase", label: "Lowercase" },
                        { key: "uppercase", label: "Uppercase" },
                        { key: "number", label: "Number" },
                        { key: "special", label: "Special char" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-1.5">
                          {passwordStrength.checks[key] ? (
                            <LuCheck className="w-3 h-3 text-green-500" />
                          ) : (
                            <LuX className="w-3 h-3 text-slate-300" />
                          )}
                          <span
                            className={
                              passwordStrength.checks[key]
                                ? "text-slate-600"
                                : "text-slate-400"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  required
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-14 px-5 pr-12 text-[15px] text-slate-800 bg-slate-50 border-2 rounded-xl transition-all duration-300 outline-none ${
                    passwordsMismatch
                      ? "border-red-400 bg-red-50"
                      : passwordsMatch
                      ? "border-green-400 bg-green-50"
                      : focused === "confirm"
                      ? "border-red-400 bg-white shadow-lg shadow-red-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <LuEyeOff size={20} />
                  ) : (
                    <LuEye size={20} />
                  )}
                </button>

                {/* Match/Mismatch Indicator */}
                <AnimatePresence>
                  {(passwordsMatch || passwordsMismatch) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute top-1/2 -translate-y-1/2 right-12 w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordsMatch ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {passwordsMatch ? (
                        <LuCheck className="w-3 h-3 text-white" />
                      ) : (
                        <LuX className="w-3 h-3 text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mismatch Message */}
              <AnimatePresence>
                {passwordsMismatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-xs mt-2"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={
                  loading || !passwordsMatch || passwordStrength.score < 3
                }
                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LuLoaderCircle className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <LuShieldCheck className="w-5 h-5" />
                      Update Password
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
            className="text-center mt-6 pt-6 border-t border-slate-200"
          >
            <button
              onClick={() => router.push("/authentication")}
              className="text-slate-500 hover:text-slate-700 cursor-pointer text-sm transition-colors"
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
      `}</style>
    </div>
  );
}
