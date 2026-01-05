"use client";
import { useState, useEffect } from "react";
import {
  Smartphone,
  Truck,
  RotateCcw,
  Percent,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gift,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoBannerPage({ countryCode }) {
  const isGerman = countryCode === "DE";
  const [currentSlide, setCurrentSlide] = useState(0);

  const promos = [
    {
      icon: Truck,
      text: isGerman ? "Kostenloser Versand " : "Free Shipping",
      highlight: isGerman ? "50€" : "€50",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Percent,
      text: isGerman ? "Bis zu 70% Rabatt" : "Up to 70% Off",
      highlight: "70%",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      icon: RotateCcw,
      text: isGerman ? "7 Tage Rückgabe" : "7-Day Returns",
      highlight: "7",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      text: isGerman ? "Sichere Zahlung" : "Secure Payment",
      highlight: "",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickLinks = [
    {
      icon: Smartphone,
      text: isGerman ? "App herunterladen" : "Get the App",
      href: "https://play.google.com/store/apps/details?id=com.animmza.ayoob",
      badge: isGerman ? "Neu" : "New",
    },
    {
      icon: Gift,
      text: isGerman ? "Angebote" : "Deals",
      href: "/top-sale",
      badge: "Hot",
    },
  ];

  // Auto-slide for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [promos.length]);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.5)'%3E%3C/path%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-8xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-9">
          {/* Left side - Quick links */}
          <div className="hidden md:flex items-center gap-1">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <link.icon className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors" />
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                  {link.text}
                </span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Center - Promo carousel (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-6">
            {promos.map((promo, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group cursor-default"
              >
                <div
                  className={`w-6 h-6 rounded-full ${promo.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <promo.icon className={`w-3.5 h-3.5 ${promo.color}`} />
                </div>
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                  {promo.text}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile - Single promo with carousel */}
          <div className="flex md:hidden items-center justify-center flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-6 h-6 rounded-full ${promos[currentSlide].bgColor} flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = promos[currentSlide].icon;
                    return (
                      <Icon
                        className={`w-3.5 h-3.5 ${promos[currentSlide].color}`}
                      />
                    );
                  })()}
                </div>
                <span className="text-xs text-gray-200">
                  {promos[currentSlide].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - Special offer */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-full border border-rose-500/30">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span className="text-xs font-medium text-rose-200">
                {isGerman ? "Flash Sale Live!" : "Flash Sale Live!"}
              </span>
            </div>
          </div>

          {/* Mobile carousel indicators */}
          <div className="flex md:hidden items-center gap-1">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-white w-3"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
