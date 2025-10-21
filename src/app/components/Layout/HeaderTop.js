import CountrySelector from "@/components/ui/country-selector";
import {
  ShoppingBag,
  Truck,
  ArrowLeftRight,
  Megaphone,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function PromoBannerPage({ countryCode }) {
  // Determine if user is in Germany
  const isGerman = countryCode === "DE";

  // Translations
  const t = {
    getApp: isGerman ? "Hol dir unsere Mobile App" : "Get our Mobile App",
    getIphone: isGerman ? "Iphone App" : "Iphone App",
    insider: isGerman ? "FASHIONINSIDER" : "FASHIONINSIDER",
    subscribe: isGerman ? "Abonnieren & Sparen" : "Subscribe & Save",
    shipping: isGerman ? "Kostenloser Versand" : "Free Shipping",
    returns: isGerman ? "Kostenlose Rücksendungen" : "Free Returns",
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <div className="bg-red-50/80 border-b border-red-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 ">
          <div className="flex overflow-x-auto shidden items-start justify-between text-red-700 text-xs sm:text-sm">
            {/* <div className="w-[5.5rem]">
              <CountrySelector />
            </div> */}
            {/* Mobile App */}
            <Link
              href="https://play.google.com/store/apps/details?id=com.animmza.ayoob"
              target="_blank"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Smartphone
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{t.getApp}</span>
            </Link>

            {/* App Store */}
            <Link
              href="https://apps.apple.com/us/app/darloo/id6747489472"
              target="_blank"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Smartphone
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{t.getIphone}</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Insider */}
            <Link
              href="/top-sale"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Megaphone
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{t.insider}</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Subscribe */}
            <Link
              href="#subscribe"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <ShoppingBag
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{t.subscribe}</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Free Shipping */}
            <Link
              href="#shipping"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Truck
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{t.shipping}</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Free Returns */}
            <Link
              href="/refund-policy"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <ArrowLeftRight
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="flex flex-col">
                <span>{t.returns}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
