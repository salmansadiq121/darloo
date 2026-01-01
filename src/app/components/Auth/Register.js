"use client";
import { useAuth } from "@/app/content/authContent";
import { getCountries } from "@/app/utils/CountryData";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsGithub, BsPersonPlus } from "react-icons/bs";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import {
  LuEye,
  LuEyeOff,
  LuLoaderCircle,
  LuMail,
  LuLock,
  LuUser,
  LuPhone,
  LuCamera,
  LuSparkles,
  LuShieldCheck,
  LuHouse,
  LuStore,
  LuShoppingBag,
} from "react-icons/lu";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { signIn, useSession } from "next-auth/react";
import PhoneNumberInput from "@/app/utils/PhoneInput";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export default function Register({ setActive }) {
  const { setActivationToken, setAuth, auth } = useAuth();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [number, setNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [phoneCode, setPhoneCode] = useState("+1");
  const [focusedField, setFocusedField] = useState(null);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    setCountries(getCountries());
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

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
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("file", avatar);
      formData.append("number", number);
      formData.append("phoneCode", phoneCode);
      formData.append("role", role);
      const { data } = await axios.post(`${authUri}/register`, formData);

      if (data) {
        setActivationToken(data.activationToken);
        localStorage.setItem("activation", data.activationToken);
        router.push("/email-verification");
        toast.success("Please check your email to activate your account");
        setName("");
        setEmail("");
        setLastName("");
        setPassword("");
        setAvatar(null);
        setNumber("");
        setPhoneCode("+1");
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
          secure: true,
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
          className="absolute top-10 right-20 w-80 h-80 bg-gradient-to-br from-red-400/30 to-rose-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-rose-400/25 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-300/20 to-amber-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-300/15 to-violet-400/10 rounded-full blur-3xl"
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
        className="relative w-full max-w-lg z-10"
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
                <BsPersonPlus className="w-8 h-8 text-white" />
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
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm">
              Join us and start your journey
            </p>
          </motion.div>

          {/* Avatar Upload */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center mb-6"
          >
            <label htmlFor="avatar" className="relative cursor-pointer group">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-red-400 transition-colors">
                {avatar ? (
                  <Image
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-1">
                    <LuCamera className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-[10px] text-slate-400 group-hover:text-red-500 transition-colors">
                      Add Photo
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LuCamera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              {avatar && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
            </label>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mb-6"
          >
            <p className="text-xs text-slate-500 text-center mb-3">
              Register as
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all duration-300 ${
                  role === "user"
                    ? "border-red-400 bg-red-50 text-red-600 shadow-lg shadow-red-100"
                    : "border-slate-200 bg-slate-50/80 text-slate-500 hover:border-slate-300"
                }`}
              >
                {role === "user" && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="absolute inset-0 border-2 border-red-400 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <LuShoppingBag
                  className={`w-4 h-4 ${
                    role === "user" ? "text-red-500" : "text-slate-400"
                  }`}
                />
                <span className="text-sm font-medium">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all duration-300 ${
                  role === "seller"
                    ? "border-red-400 bg-red-50 text-red-600 shadow-lg shadow-red-100"
                    : "border-slate-200 bg-slate-50/80 text-slate-500 hover:border-slate-300"
                }`}
              >
                {role === "seller" && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="absolute inset-0 border-2 border-red-400 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <LuStore
                  className={`w-4 h-4 ${
                    role === "seller" ? "text-red-500" : "text-slate-400"
                  }`}
                />
                <span className="text-sm font-medium">Seller</span>
              </button>
            </div>
            {role === "seller" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-amber-600 text-center mt-2 bg-amber-50 px-3 py-1.5 rounded-lg"
              >
                You'll need to complete seller verification after registration
              </motion.p>
            )}
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                    focusedField === "name" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    focusedField === "name"
                      ? "bg-white border-red-400 shadow-lg shadow-red-100"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <LuUser
                    className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
                      focusedField === "name"
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={name}
                    required
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[14px] min-w-0"
                  />
                </div>
              </motion.div>

              {/* Last Name Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                    focusedField === "lastName" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    focusedField === "lastName"
                      ? "bg-white border-red-400 shadow-lg shadow-red-100"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <LuUser
                    className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
                      focusedField === "lastName"
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    required
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[14px] min-w-0"
                  />
                </div>
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                  focusedField === "email" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                  focusedField === "email"
                    ? "bg-white border-red-400 shadow-lg shadow-red-100"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <LuMail
                  className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
                    focusedField === "email"
                      ? "text-red-500"
                      : "text-slate-400"
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
                  className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[14px] min-w-0"
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                  focusedField === "phone" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative rounded-xl border transition-all duration-300 ${
                  focusedField === "phone"
                    ? "bg-white border-red-400 shadow-lg shadow-red-100"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
              >
                <PhoneNumberInput
                  value={number}
                  setPhone={setNumber}
                  placeholder="+1 234 567 8901"
                  phoneCode={phoneCode}
                  setPhoneCode={setPhoneCode}
                />
              </div>
            </motion.div>

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                    focusedField === "password" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    focusedField === "password"
                      ? "bg-white border-red-400 shadow-lg shadow-red-100"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <LuLock
                    className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
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
                    className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[14px] min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  >
                    {showPassword ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur-xl transition-opacity duration-300 ${
                    focusedField === "confirmPassword"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    focusedField === "confirmPassword"
                      ? "bg-white border-red-400 shadow-lg shadow-red-100"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <LuShieldCheck
                    className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
                      focusedField === "confirmPassword"
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    required
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-[14px] min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  >
                    {showConfirmPassword ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

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
                      ? "text-green-400"
                      : "text-red-400"
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
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                disabled={loading || password !== confirmPassword}
                className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <LuLoaderCircle className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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
            className="flex items-center gap-4 my-6"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-slate-400 text-sm font-medium">
              or sign up with
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
            ].map((provider) => (
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

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActive("login")}
                className="text-red-500 hover:text-red-600 cursor-pointer font-semibold transition-colors"
              >
                Sign in
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
