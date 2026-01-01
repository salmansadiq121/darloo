"use client";
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Gift,
  Mail,
  User,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  Euro,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Wallet,
  ExternalLink,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function ReferEarnSection() {
  const { auth } = useAuth();
  const [copied, setCopied] = useState({ code: false, link: false });
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalEarned: 0,
    approvedEarnings: 0,
    pendingEarnings: 0,
    totalRevenue: 0,
    conversions: 0,
    totalOrders: 0,
  });
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate referral code from user ID
  const referralCode = auth?.user?._id
    ? `DARLOO${auth.user._id.toString().slice(-6).toUpperCase()}`
    : "DARLOO000000";

  // Generate referral link with ref parameter for GoAffPro tracking
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://darloo.de";
  const referralLink = auth?.user?._id
    ? `${baseUrl}?ref=${auth.user._id}`
    : baseUrl;

  // Fetch affiliate earnings from API
  useEffect(() => {
    const fetchAffiliateEarnings = async () => {
      if (!auth?.user?._id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/affiliate/earnings/${auth.user._id}`
        );
        if (data?.success) {
          setStats(
            data.stats || {
              totalEarned: 0,
              approvedEarnings: 0,
              pendingEarnings: 0,
              totalRevenue: 0,
              conversions: 0,
              totalOrders: 0,
            }
          );
          setRecentEarnings(data.recentEarnings || []);
        }
      } catch (error) {
        console.log("Affiliate earnings not available:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateEarnings();
  }, [auth?.user?._id]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [type]: true }));
      toast.success(
        `${type === "code" ? "Referral code" : "Referral link"} copied!`
      );
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      "Join Darloo and get 20% off your first order!"
    );
    const body = encodeURIComponent(
      `Hey!\n\nI've been shopping at Darloo and thought you'd love it too. Use my referral link to sign up and get 20% off your first order:\n\n${referralLink}\n\nOr use my referral code: ${referralCode}\n\nHappy shopping!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(referralLink);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Join Darloo and get 20% off your first order! Use my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `I'm earning rewards on @Darloo! Join using my link and get 20% off your first order: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      `Join Darloo and get 20% off your first order! ${referralLink}`
    );
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Darloo",
          text: "Get 20% off your first order using my referral link!",
          url: referralLink,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      copyToClipboard(referralLink, "link");
    }
  };

  const steps = [
    {
      icon: Share,
      title: "Share Your Link",
      description: "Send your unique referral link to friends & family",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Friends Sign Up",
      description: "They create an account and start shopping",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Wallet,
      title: "Earn Rewards",
      description: "Get commission on every purchase they make",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const statCards = [
    {
      label: "Total Earned",
      value: `€${stats.totalEarned?.toFixed(2) || "0.00"}`,
      icon: Euro,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      label: "Approved",
      value: `€${stats.approvedEarnings?.toFixed(2) || "0.00"}`,
      icon: CheckCircle2,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      label: "Pending",
      value: `€${stats.pendingEarnings?.toFixed(2) || "0.00"}`,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-700",
    },
    {
      label: "Conversions",
      value: stats.conversions || 0,
      icon: ShoppingBag,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-700",
    },
  ];

  const socialButtons = [
    {
      name: "WhatsApp",
      onClick: shareOnWhatsApp,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      className: "bg-[#25D366] hover:bg-[#128C7E] text-white",
    },
    {
      name: "Facebook",
      onClick: shareOnFacebook,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      className: "bg-[#1877F2] hover:bg-[#0d65d9] text-white",
    },
    {
      name: "Twitter",
      onClick: shareOnTwitter,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      className: "bg-black hover:bg-gray-800 text-white",
    },
    {
      name: "Telegram",
      onClick: shareOnTelegram,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      className: "bg-[#0088cc] hover:bg-[#006699] text-white",
    },
    {
      name: "Email",
      onClick: shareViaEmail,
      icon: <Mail className="w-5 h-5" />,
      className: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 p-6 sm:p-8"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-400/20 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm px-3 py-1">
              Affiliate Program
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Invite Friends & Earn Rewards
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mb-6">
            Share your unique referral link and earn commission on every purchase
            made by friends who join through you!
          </p>

          {/* How It Works Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-xs font-medium">
                      Step {index + 1}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {step.title}
                  </h4>
                  <p className="text-white/70 text-xs">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-white/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <span className="text-sm text-gray-500">Loading your earnings...</span>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgGradient} p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                {stat.label}
              </p>
              <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              {/* Decorative gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {["overview", "earnings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "overview" ? "Share & Earn" : "Recent Earnings"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Referral Code & Link Section */}
            <div className="space-y-5">
              {/* Referral Code */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Your Referral Code</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl opacity-10" />
                    <div className="relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-gray-900 tracking-wider">
                        {referralCode}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode, "code")}
                    className={`h-14 w-14 rounded-xl border-2 transition-all duration-300 ${
                      copied.code
                        ? "bg-green-50 border-green-500 text-green-600"
                        : "border-gray-200 hover:border-rose-500 hover:text-rose-600"
                    }`}
                  >
                    {copied.code ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Your Referral Link</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-hidden">
                    <p className="text-sm text-gray-600 truncate font-mono">
                      {referralLink}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralLink, "link")}
                    className={`h-12 w-12 rounded-xl border-2 transition-all duration-300 ${
                      copied.link
                        ? "bg-green-50 border-green-500 text-green-600"
                        : "border-gray-200 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {copied.link ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Share className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Share via</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {socialButtons.map((social, index) => (
                  <motion.button
                    key={social.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={social.onClick}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${social.className}`}
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Native Share Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={nativeShare}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300"
              >
                <Share className="w-5 h-5" />
                <span>Share Link</span>
              </motion.button>

              {/* Info Text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Your friends get 20% off their first order when they use your link!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="earnings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Recent Earnings</h3>
                </div>
                <Badge variant="secondary" className="bg-gray-100">
                  {recentEarnings.length} transactions
                </Badge>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {recentEarnings.length > 0 ? (
                recentEarnings.map((earning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          earning.status === "Approved"
                            ? "bg-emerald-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {earning.status === "Approved" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          Order #{earning.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {earning.date
                            ? format(new Date(earning.date), "MMM dd, yyyy")
                            : "N/A"}
                        </p>
                        {earning.customer && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {earning.customer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`mb-1 ${
                          earning.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {earning.status}
                      </Badge>
                      <p className="text-sm font-bold text-emerald-600">
                        +€{earning.commission?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    No earnings yet
                  </h4>
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    Share your referral link with friends and start earning
                    commission on their purchases!
                  </p>
                  <Button
                    onClick={() => setActiveTab("overview")}
                    className="mt-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Start Sharing
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
