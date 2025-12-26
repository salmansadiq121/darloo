"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle,
  Sparkles,
  Package,
  Truck,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowRight,
  Star,
  Gift,
  Heart,
  Mail,
  Phone,
  Home,
  ChevronRight,
  Copy,
  Share2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/content/authContent";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

// Confetti celebration effect
const triggerConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"],
    });
  }, 250);
};

// Floating particles component
const FloatingParticles = () => {
  const particles = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      x: Math.random() * 100,
      color: ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)]
    })),
  []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            backgroundColor: particle.color,
          }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.3, 0.3, 0],
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Animated checkmark with rings
const AnimatedCheckmark = () => (
  <div className="relative">
    {/* Outer glowing rings */}
    <motion.div
      className="absolute inset-0 rounded-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)" }}
    />
    <motion.div
      className="absolute inset-0 rounded-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1.8, opacity: 0 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)" }}
    />

    {/* Main circle */}
    <motion.div
      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/40"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
    >
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

      {/* Checkmark */}
      <motion.div
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
      </motion.div>
    </motion.div>

    {/* Sparkles around */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          top: `${50 + 60 * Math.sin((i * Math.PI * 2) / 6)}%`,
          left: `${50 + 60 * Math.cos((i * Math.PI * 2) / 6)}%`,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
      >
        <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-glow" />
      </motion.div>
    ))}
  </div>
);

// Order timeline step
const TimelineStep = ({ icon: Icon, title, subtitle, status, delay, isLast }) => (
  <motion.div
    className="flex items-start gap-4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="relative flex flex-col items-center">
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          status === "completed"
            ? "bg-gradient-to-br from-green-400 to-green-600"
            : status === "current"
            ? "bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse"
            : "bg-slate-200"
        }`}
        whileHover={{ scale: 1.1 }}
      >
        <Icon className={`w-5 h-5 ${status !== "pending" ? "text-white" : "text-slate-400"}`} />
      </motion.div>
      {!isLast && (
        <div className={`w-0.5 h-12 mt-2 ${status === "completed" ? "bg-green-400" : "bg-slate-200"}`} />
      )}
    </div>
    <div className="pt-1.5">
      <h4 className={`text-sm font-semibold ${status !== "pending" ? "text-slate-900" : "text-slate-400"}`}>
        {title}
      </h4>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </motion.div>
);

// Quick action button
const QuickAction = ({ icon: Icon, label, onClick, gradient, delay }) => (
  <motion.button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl transition-all group`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
    <span className="text-xs font-medium">{label}</span>
  </motion.button>
);

// Stat card
const StatCard = ({ icon: Icon, value, label, gradient, delay }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl p-4 ${gradient}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    <Icon className="w-8 h-8 text-white/80 mb-2" />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-white/70">{label}</p>
  </motion.div>
);

export default function SuccessPage() {
  const { auth } = useAuth();
  const [count, setCount] = useState(15);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  // Generate random order number
  const orderNumber = useMemo(() => {
    return `DL${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  // Estimated delivery date
  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 5);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  }, []);

  useEffect(() => {
    // Trigger confetti on mount
    triggerConfetti();
    localStorage.removeItem("oneClickBuyProduct");

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/profile/${auth?.user?._id}?tab=orders`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auth?.user?._id, router]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied!");
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Order",
        text: `I just placed an order! Order #${orderNumber}`,
        url: window.location.href,
      });
    } else {
      toast.success("Share link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <FloatingParticles />

      {/* Top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-green-50/80 via-emerald-50/50 to-transparent pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Main Success Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="relative px-6 pt-10 pb-8 sm:px-10 sm:pt-14 sm:pb-10 text-center bg-gradient-to-b from-green-50/50 to-transparent">
            {/* Celebration badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Thank you for your purchase!</span>
              <Gift className="w-4 h-4 text-amber-600" />
            </motion.div>

            {/* Animated Checkmark */}
            <div className="flex justify-center mb-8">
              <AnimatedCheckmark />
            </div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3">
                Order Confirmed!
              </h1>
              <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">
                Your order has been successfully placed. We're preparing your items with care and will ship them soon.
              </p>
            </motion.div>

            {/* Order Number */}
            <motion.div
              className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Order Number</p>
                <p className="text-lg font-bold tracking-wide">{orderNumber}</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <button
                onClick={copyOrderNumber}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="px-6 sm:px-10 py-6 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                icon={Package}
                value="Processing"
                label="Order Status"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                delay={0.9}
              />
              <StatCard
                icon={Truck}
                value={estimatedDelivery.split(",")[1]?.trim() || "5-7 Days"}
                label="Est. Delivery"
                gradient="bg-gradient-to-br from-emerald-500 to-green-600"
                delay={1}
              />
              <StatCard
                icon={Clock}
                value="24/7"
                label="Support"
                gradient="bg-gradient-to-br from-purple-500 to-violet-600"
                delay={1.1}
              />
              <StatCard
                icon={Heart}
                value="100%"
                label="Satisfaction"
                gradient="bg-gradient-to-br from-rose-500 to-pink-600"
                delay={1.2}
              />
            </div>
          </div>

          {/* Order Timeline */}
          <motion.div
            className="px-6 sm:px-10 py-6 border-t border-slate-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Order Progress</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                {showDetails ? "Hide" : "Show"} Details
                <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-0">
                <TimelineStep
                  icon={ShoppingBag}
                  title="Order Placed"
                  subtitle="Just now"
                  status="completed"
                  delay={1.1}
                />
                <TimelineStep
                  icon={CheckCircle}
                  title="Payment Confirmed"
                  subtitle="Payment received"
                  status="completed"
                  delay={1.2}
                />
                <TimelineStep
                  icon={Package}
                  title="Processing"
                  subtitle="Preparing your order"
                  status="current"
                  delay={1.3}
                />
                <TimelineStep
                  icon={Truck}
                  title="Shipping"
                  subtitle="On the way"
                  status="pending"
                  delay={1.4}
                />
                <TimelineStep
                  icon={MapPin}
                  title="Delivered"
                  subtitle={estimatedDelivery}
                  status="pending"
                  delay={1.5}
                  isLast
                />
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    className="bg-slate-50 rounded-2xl p-5 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Confirmation Sent
                    </h4>
                    <p className="text-sm text-slate-600">
                      We've sent a confirmation email to{" "}
                      <span className="font-medium text-slate-900">{auth?.user?.email || "your email"}</span>
                    </p>

                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Payment Method</p>
                          <p className="text-sm font-medium text-slate-900">Credit Card</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Home className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Shipping Address</p>
                          <p className="text-sm font-medium text-slate-900">
                            {auth?.user?.addressDetails?.city || "Your saved address"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="px-6 sm:px-10 py-6 border-t border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              <QuickAction
                icon={ShoppingBag}
                label="Track Order"
                onClick={() => router.push(`/profile/${auth?.user?._id}?tab=orders`)}
                gradient="from-blue-500 to-blue-600"
                delay={1.3}
              />
              <QuickAction
                icon={Phone}
                label="Support"
                onClick={() => router.push("/contact")}
                gradient="from-emerald-500 to-green-600"
                delay={1.4}
              />
              <QuickAction
                icon={Share2}
                label="Share"
                onClick={shareOrder}
                gradient="from-purple-500 to-violet-600"
                delay={1.5}
              />
              <QuickAction
                icon={Star}
                label="Rate Us"
                onClick={() => toast.success("Thank you for your feedback!")}
                gradient="from-amber-500 to-orange-600"
                delay={1.6}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 sm:px-10 py-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <motion.button
                  className="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </motion.button>
              </Link>
              <Link href={`/profile/${auth?.user?._id}?tab=orders`} className="flex-1">
                <motion.button
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View My Orders
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Redirect Timer */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-sm text-slate-500">
                Redirecting to your orders in{" "}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-bold text-sm">
                  {count}
                </span>{" "}
                seconds
              </p>
              <div className="mt-3 h-1.5 w-48 mx-auto bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {[
            { icon: "🔒", text: "Secure Payment" },
            { icon: "🚚", text: "Fast Shipping" },
            { icon: "💯", text: "Quality Guaranteed" },
            { icon: "🎁", text: "Free Returns" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur rounded-full border border-slate-200/50 shadow-sm"
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="text-xs font-medium text-slate-600">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Thank You Message */}
        <motion.p
          className="text-center mt-8 text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Thank you for choosing us! We appreciate your business. 💖
        </motion.p>
      </div>
    </div>
  );
}
