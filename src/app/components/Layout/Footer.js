"use client";
import React, { useState } from "react";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import toast from "react-hot-toast";
import axios from "axios";

const Footer = () => {
  const { auth, countryCode } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        toast.success(
          countryCode === "DE"
            ? "Danke für dein Abonnement! Wir senden dir eine Bestätigungs-E-Mail."
            : "Thank you for subscribing!. We will send you a confirmation email."
        );
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

  // ✅ Language dictionary
  const t = (key) => {
    const translations = {
      en: {
        companyDesc:
          "Your one-stop online marketplace for the latest fashion, electronics, home essentials, and more—secure shopping with fast delivery.",
        company: "Company",
        topSale: "Top Sale",
        popularProducts: "Popular Products",
        categories: "Categories",
        aboutUs: "About Us",
        support: "Support",
        helpCenter: "Help Center",
        faqs: "FAQs",
        refundPolicy: "Escrow & Refund Policy",
        privacyPolicy: "Privacy Policy",
        accountSecurity: "Account Security",
        contactUs: "Contact Us",
        downloadApp: "Download Our App",
        newsletter: "Newsletter",
        newsletterText:
          "Get the latest updates and exclusive offers straight to your inbox.",
        subscribe: "Subscribe",
        placeholder: "Enter your email address",
        secureEscrow: "Secure Escrow Service",
        rights: "© 2025 Darloo. All rights reserved.",
        androidAppOn: "Android App on",
        googlePlay: "Google Play",
        downloadOn: "Download on the",
        appStore: "App Store",
      },
      de: {
        companyDesc:
          "Dein One-Stop-Online-Marktplatz für aktuelle Mode, Elektronik, Haushaltsartikel und mehr – sicheres Einkaufen mit schneller Lieferung.",
        company: "Unternehmen",
        topSale: "Top Angebot",
        popularProducts: "Beliebte Produkte",
        categories: "Kategorien",
        aboutUs: "Über uns",
        support: "Support",
        helpCenter: "Hilfezentrum",
        faqs: "Häufig gestellte Fragen",
        refundPolicy: "Treuhand- & Rückerstattungsrichtlinie",
        privacyPolicy: "Datenschutzrichtlinie",
        accountSecurity: "Kontosicherheit",
        contactUs: "Kontaktieren Sie uns",
        downloadApp: "Lade unsere App herunter",
        newsletter: "Newsletter",
        newsletterText:
          "Erhalte die neuesten Updates und exklusiven Angebote direkt in dein Postfach.",
        subscribe: "Abonnieren",
        placeholder: "Gib deine E-Mail-Adresse ein",
        secureEscrow: "Sicherer Treuhandservice",
        rights: "© 2025 Darloo. Alle Rechte vorbehalten.",
        androidAppOn: "Android-App auf",
        googlePlay: "Google Play",
        downloadOn: "Herunterladen im",
        appStore: "App Store",
      },
    };
    return translations[countryCode === "DE" ? "de" : "en"][key];
  };

  return (
    <footer className=" bg-slate-100 border-t border-gray-200 ">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#c6080a] to-[#ac0205] flex items-center justify-center">
                <span className="text-white font-bold font-serif text-xl ">
                  D
                </span>
              </div>
              <span className="ml-2 text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#c6080a] to-[#ac0205]">
                Darloo
              </span>
            </div>
            <p className=" text-gray-800 text-sm mb-4">{t("companyDesc")}</p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">
              {t("company")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="top-sale"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("topSale")}
                </Link>
              </li>
              <li>
                <Link
                  href="/popular"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("popularProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("aboutUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">
              {t("support")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={
                    auth?.user
                      ? `/profile/${auth?.user?._id}?tab=chat`
                      : "/authentication"
                  }
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("faqs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("refundPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account-security"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("accountSecurity")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/contact`}
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">
              {t("downloadApp")}
            </h3>
            <div className="flex flex-col gap-4">
              <Link
                href="https://play.google.com/store/apps/details?id=com.animmza.ayoob"
                target="_blank"
                className="text-white hover:text-gray-100 transition-colors duration-200 text-sm bg-black rounded-md px-4 py-3 flex  items-center gap-1 max-w-fit"
              >
                <Image
                  src="/playstore.svg"
                  alt="Google Play"
                  width={70}
                  height={70}
                  className="h-11 w-auto  rounded px-2"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-gray-100">
                    {t("androidAppOn")}
                  </span>
                  <h3 className="text-white font-semibold text-[18px]">
                    {t("googlePlay")}
                  </h3>
                </div>
              </Link>
              <Link
                href="https://apps.apple.com/us/app/darloo/id6747489472"
                target="_blank"
                className="text-white hover:text-gray-100 transition-colors duration-200 text-sm bg-black rounded-md px-4 py-3 flex items-center gap-1 max-w-fit"
              >
                <Image
                  src="/appstore.svg"
                  alt="Apple Store"
                  width={70}
                  height={70}
                  className="h-11 w-auto  rounded px-2"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-gray-100">
                    {t("downloadOn")}
                  </span>
                  <h3 className="text-white font-semibold text-[18px]">
                    {t("appStore")}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className=" text-gray-800 text-sm">{t("rights")}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-black font-medium text-[17px]">
                    {t("newsletter")}
                  </h3>
                  <p className="text-sm text-gray-500">{t("newsletterText")}</p>
                </div>

                <form className="flex" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder={t("placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 rounded-l bg-white border border-gray-400 focus:border-red-500  text-sm focus:outline-none focus:ring-2 focus:ring-red-600 min-w-[200px]"
<<<<<<< HEAD
                    suppressHydrationWarning
=======
>>>>>>> e158cb47120590a5410ef9520a00f8635dcb3e8d
                  />
                  <button
                    type={"submit"}
                    className="px-4 py-2 rounded-r bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
<<<<<<< HEAD
                    suppressHydrationWarning
=======
>>>>>>> e158cb47120590a5410ef9520a00f8635dcb3e8d
                  >
                    {t("subscribe")}{" "}
                    {isLoading && (
                      <Loader2 className="animate-spin text-white" size={18} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center flex-col justify-center  space-x-4 gap-4">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
            </div>
            <div className="dark:bg-[#1E293B] w-fit bg-slate-300/80 px-3 py-1 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#06B6D4] mr-1"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              <span className="text-xs dark:text-white text-black">
                {t("secureEscrow")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
