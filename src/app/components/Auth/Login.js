"use client";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsGithub, BsShieldLock } from "react-icons/bs";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import {
  LuEye,
  LuEyeOff,
  LuLoaderCircle,
  LuMail,
  LuLock,
  LuSparkles,
  LuHouse,
} from "react-icons/lu";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ setActive }) {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${authUri}/login`, {
        email,
        password,
      });

      if (data) {
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("@darloo", JSON.stringify({ user: data.user }));
        Cookies.set("@darloo", data.token, {
          expires: 1,
          secure: window?.location?.protocol === "https:",
          sameSite: "Strict",
          path: "/",
        });
        router.push("/");
        toast.success("Login successfully!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async () => {
    if (!sessionData) return;

    try {
      const { data } = await axios.post(`${authUri}/socialAuth`, {
        email: sessionData.user.email,
        name: sessionData.user.name,
        avatar: sessionData.user.image,
      });

      if (data) {
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("@darloo", JSON.stringify({ user: data.user }));
        Cookies.set("@darloo", data.token, {
          expires: 1,
          secure: window?.location?.protocol === "https:",
          sameSite: "Strict",
          path: "/",
        });
        router.push("/");
        toast.success(data.message || "Login Successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Social login failed.");
    }
  };

  useEffect(() => {
    if (sessionData && !localStorage.getItem("@darloo")) {
      handleSocialAuth();
    }
    // eslint-disable-next-line
  }, [sessionData]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-white">
      {/* Animated Background with Glowing Effects */}
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
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-red-400/30 to-rose-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-rose-400/25 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-amber-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-300/15 to-violet-400/10 rounded-full blur-3xl"
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
          {/* Decorative Elements */}
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
          <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />

          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <BsShieldLock className="w-8 h-8 text-white" />
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
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to continue to your account
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
                className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                  focusedField === "email" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                  focusedField === "email"
                    ? "bg-white border-red-400 shadow-lg shadow-red-100"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <LuMail
                  className={`w-5 h-5 transition-colors duration-300 ${
                    focusedField === "email" ? "text-red-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  required
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[15px]"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                  focusedField === "password" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                  focusedField === "password"
                    ? "bg-white border-red-400 shadow-lg shadow-red-100"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <LuLock
                  className={`w-5 h-5 transition-colors duration-300 ${
                    focusedField === "password"
                      ? "text-red-500"
                      : "text-slate-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

            {/* Options Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 rounded border border-slate-300 bg-white peer-checked:bg-red-500 peer-checked:border-red-500 transition-all" />
                  <svg
                    className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
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
                </div>
                <span className="text-slate-500 group-hover:text-slate-700 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setActive("resetPassword")}
                className="text-red-500 hover:text-red-600 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LuLoaderCircle className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 my-8"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-slate-400 text-sm font-medium">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-4"
          >
            {[
              {
                icon: FaGoogle,
                label: "Google",
                onClick: () => signIn("google"),
                color: "from-red-500 to-orange-500",
              },
              {
                icon: FaFacebookF,
                label: "Facebook",
                onClick: () => signIn("facebook"),
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: BsGithub,
                label: "GitHub",
                onClick: () => signIn("github"),
                color: "from-gray-600 to-gray-800",
              },
            ].map((provider, index) => (
              <motion.button
                key={provider.label}
                type="button"
                onClick={provider.onClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${provider.color} rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity`}
                />
                <div className="relative w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-lg">
                  <provider.icon className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setActive("register")}
                className="text-red-500 hover:text-red-600 cursor-pointer font-semibold transition-colors"
              >
                Create account
              </button>
            </p>
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
