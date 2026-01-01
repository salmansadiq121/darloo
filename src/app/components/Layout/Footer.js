"use client";
import React, { useState } from "react";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  HeadphonesIcon,
  Sparkles,
  Heart,
  Send,
  ChevronRight,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

const Footer = () => {
  const { auth, countryCode } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${authUri}/subscription`, {
        email,
      });
      if (data) {
        setIsLoading(false);
        setEmail("");
        setIsSubscribed(true);
        toast.success(
          countryCode === "DE"
            ? "Danke für dein Abonnement! Wir senden dir eine Bestätigungs-E-Mail."
            : "Thank you for subscribing! We will send you a confirmation email."
        );
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          (countryCode === "DE"
            ? "Etwas ist schiefgelaufen. Bitte versuche es später erneut."
            : "Something went wrong. Please try again later.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isGerman = countryCode === "DE";

  const t = (key) => {
    const translations = {
      en: {
        companyDesc:
          "Your premium online marketplace for the latest fashion, electronics, home essentials, and more. Shop securely with fast delivery.",
        company: "Explore",
        topSale: "Hot Deals",
        popularProducts: "Trending Now",
        categories: "Categories",
        aboutUs: "About Us",
        support: "Support",
        helpCenter: "Help Center",
        faqs: "FAQs",
        refundPolicy: "Escrow & Refunds",
        privacyPolicy: "Privacy Policy",
        accountSecurity: "Account Security",
        contactUs: "Contact Us",
        downloadApp: "Get the App",
        newsletter: "Stay Updated",
        newsletterText: "Get exclusive offers, new arrivals & special deals.",
        subscribe: "Subscribe",
        placeholder: "Enter your email",
        secureEscrow: "Secure Escrow Service",
        rights: "© 2025 Darloo. All rights reserved.",
        androidAppOn: "Android App on",
        googlePlay: "Google Play",
        downloadOn: "Download on the",
        appStore: "App Store",
        quickLinks: "Quick Links",
        legal: "Legal",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",
        followUs: "Follow Us",
        paymentMethods: "We Accept",
        shopAll: "Shop All",
        newArrivals: "New Arrivals",
      },
      de: {
        companyDesc:
          "Dein Premium-Online-Marktplatz für aktuelle Mode, Elektronik, Haushaltsartikel und mehr. Sicher einkaufen mit schneller Lieferung.",
        company: "Entdecken",
        topSale: "Top-Angebote",
        popularProducts: "Beliebt",
        categories: "Kategorien",
        aboutUs: "Über uns",
        support: "Support",
        helpCenter: "Hilfezentrum",
        faqs: "FAQ",
        refundPolicy: "Treuhand & Rückgabe",
        privacyPolicy: "Datenschutz",
        accountSecurity: "Kontosicherheit",
        contactUs: "Kontakt",
        downloadApp: "App herunterladen",
        newsletter: "Bleib informiert",
        newsletterText: "Erhalte exklusive Angebote und Neuheiten.",
        subscribe: "Abonnieren",
        placeholder: "E-Mail eingeben",
        secureEscrow: "Sicherer Treuhandservice",
        rights: "© 2025 Darloo. Alle Rechte vorbehalten.",
        androidAppOn: "Android-App auf",
        googlePlay: "Google Play",
        downloadOn: "Herunterladen im",
        appStore: "App Store",
        quickLinks: "Schnelllinks",
        legal: "Rechtliches",
        termsOfService: "AGB",
        cookiePolicy: "Cookie-Richtlinie",
        followUs: "Folge uns",
        paymentMethods: "Zahlungsarten",
        shopAll: "Alle Produkte",
        newArrivals: "Neuheiten",
      },
    };
    return translations[isGerman ? "de" : "en"][key];
  };

  const features = [
    {
      icon: Truck,
      title: isGerman ? "Kostenloser Versand" : "Free Shipping",
      desc: isGerman ? "Ab 50€ Bestellwert" : "On orders over €50",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Shield,
      title: isGerman ? "Sichere Zahlung" : "Secure Payment",
      desc: isGerman ? "100% geschützt" : "100% protected",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: HeadphonesIcon,
      title: isGerman ? "24/7 Support" : "24/7 Support",
      desc: isGerman ? "Immer für dich da" : "Always here for you",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: CreditCard,
      title: isGerman ? "Einfache Rückgabe" : "Easy Returns",
      desc: isGerman ? "30 Tage Rückgaberecht" : "30-day return policy",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Feature Bar */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-8xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-8xl mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <span className="text-white font-bold font-serif text-xl">
                  D
                </span>
              </div>
              <span className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-rose-500">
                Darloo
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
              {t("companyDesc")}
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                {t("newsletter")}
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                {t("newsletterText")}
              </p>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder={t("placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-l-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                      suppressHydrationWarning
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-r-xl flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                    suppressHydrationWarning
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSubscribed ? (
                      <Heart className="w-4 h-4 fill-current" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{t("subscribe")}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                {t("followUs")}
              </h4>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-rose-500 to-transparent rounded-full"></span>
              {t("company")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/top-sale", label: t("topSale") },
                { href: "/popular", label: t("popularProducts") },
                { href: "/products", label: t("shopAll") },
                { href: "/categories", label: t("categories") },
                { href: "/about-us", label: t("aboutUs") },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-rose-400 text-sm flex items-center gap-1.5 group transition-colors duration-200"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-rose-500 to-transparent rounded-full"></span>
              {t("support")}
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  href: auth?.user
                    ? `/profile/${auth?.user?._id}?tab=chat`
                    : "/authentication",
                  label: t("helpCenter"),
                },
                { href: "/faq", label: t("faqs") },
                { href: "/refund-policy", label: t("refundPolicy") },
                { href: "/privacy-policy", label: t("privacyPolicy") },
                { href: "/account-security", label: t("accountSecurity") },
                { href: "/contact", label: t("contactUs") },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-rose-400 text-sm flex items-center gap-1.5 group transition-colors duration-200"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-rose-500 to-transparent rounded-full"></span>
              {t("downloadApp")}
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="https://play.google.com/store/apps/details?id=com.animmza.ayoob"
                target="_blank"
                className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300"
              >
                <Image
                  src="/playstore.svg"
                  alt="Google Play"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {t("androidAppOn")}
                  </span>
                  <h4 className="text-white font-semibold text-sm group-hover:text-rose-400 transition-colors">
                    {t("googlePlay")}
                  </h4>
                </div>
              </Link>
              <Link
                href="https://apps.apple.com/us/app/darloo/id6747489472"
                target="_blank"
                className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300"
              >
                <Image
                  src="/appstore.svg"
                  alt="Apple Store"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {t("downloadOn")}
                  </span>
                  <h4 className="text-white font-semibold text-sm group-hover:text-rose-400 transition-colors">
                    {t("appStore")}
                  </h4>
                </div>
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                {t("paymentMethods")}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-md px-2 py-1.5">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    width={36}
                    height={24}
                    className="h-5 w-auto"
                  />
                </div>
                <div className="bg-white rounded-md px-2 py-1.5">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    width={36}
                    height={24}
                    className="h-5 w-auto"
                  />
                </div>
                <div className="bg-white rounded-md px-2 py-1.5">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    width={36}
                    height={24}
                    className="h-5 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-8xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{t("rights")}</span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-300">
                  {t("secureEscrow")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-slate-300">
                  {isGerman ? "DE" : "EN"}
                </span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <Link
                href="/privacy-policy"
                className="hover:text-rose-400 transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                href="/refund-policy"
                className="hover:text-rose-400 transition-colors"
              >
                {t("refundPolicy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
