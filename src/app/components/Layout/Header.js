"use client";
import {
  Menu,
  X,
  Bell,
  ShoppingCart,
  MessageCircle,
  User,
  LogOut,
  ChevronDown,
  Flame,
  TrendingUp,
  Grid3X3,
  ShoppingBag,
  HelpCircle,
  Heart,
  Settings,
  Package,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/content/authContent";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import MobileProductSearch from "./MobileSearch";
import PromoBannerPage from "./HeaderTop";
import SearchModal from "./SearchModal";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { auth, setAuth, setSearch, selectedProduct, countryCode } = useAuth();
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const closeNotification = useRef(null);
  const closeUserMenu = useRef(null);
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  const isGerman = countryCode === "DE";

  const navItems = [
    {
      href: "/top-sale",
      label: isGerman ? "Top-Angebote" : "Hot Deals",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      href: "/popular",
      label: isGerman ? "Beliebt" : "Trending",
      icon: TrendingUp,
      color: "text-rose-500",
    },
    {
      href: "/categories",
      label: isGerman ? "Kategorien" : "Categories",
      icon: Grid3X3,
      color: "text-purple-500",
    },
    {
      href: "/products",
      label: isGerman ? "Produkte" : "Shop",
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      href: "/contact",
      label: isGerman ? "Hilfe" : "Support",
      icon: HelpCircle,
      color: "text-emerald-500",
    },
  ];

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/all/user/${auth?.user?._id}`
      );
      if (data) {
        setNotifications(data.notifications.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [auth.user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeNotification.current &&
        !closeNotification.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      if (
        closeUserMenu.current &&
        !closeUserMenu.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    signOut();
    setAuth({ user: null, token: "" });
    localStorage.removeItem("@darloo");
    Cookies.remove("@darloo");
    router.push("/authentication");
  };

  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white"
      }`}
    >
      <PromoBannerPage countryCode={countryCode} />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <span className="text-white font-bold text-xl font-serif">
                  D
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent hidden sm:block">
              Darloo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathName === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative min-w-fit flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-rose-500" : item.color
                    }`}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-rose-50 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Search - Click to open modal */}
          <div className="hidden lg:block flex-1 max-w-xl mx-4">
            <button
              onClick={() => setShowSearchModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 group"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
              <span className="flex-1 text-left text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
                {isGerman
                  ? "Produkte, Marken, Kategorien suchen..."
                  : "Search products, brands, categories..."}
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-white rounded border border-gray-200">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Notifications */}
            <div ref={closeNotification} className="relative">
              <button
                onClick={() => setShowNotification(!showNotification)}
                className={`relative p-2.5 rounded-full transition-all duration-200 ${
                  showNotification
                    ? "bg-rose-100 text-rose-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <span className="font-semibold">
                          {isGerman ? "Benachrichtigungen" : "Notifications"}
                        </span>
                      </div>
                      {unreadNotifications > 0 && (
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {unreadNotifications} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications?.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              router.push(
                                `/profile/${auth?.user?._id}?tab=notifications`
                              )
                            }
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                              !notification.read ? "bg-rose-50/50" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {notification?.subject}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                              {notification?.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification?.createdAt
                                ? formatDistanceToNow(
                                    new Date(notification?.createdAt),
                                    { addSuffix: true }
                                  )
                                : isGerman
                                ? "Gerade eben"
                                : "Just now"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            {isGerman
                              ? "Keine Benachrichtigungen"
                              : "No notifications yet"}
                          </p>
                        </div>
                      )}
                    </div>
                    {notifications?.length > 5 && (
                      <Link
                        href={`/profile/${auth?.user?._id}?tab=notifications`}
                        className="block px-4 py-3 text-center text-sm font-medium text-rose-600 hover:bg-rose-50 border-t border-gray-100 transition-colors"
                      >
                        {isGerman ? "Alle anzeigen" : "View All"}
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={() => router.push("/checkout")}
              className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {selectedProduct?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedProduct.length}
                </span>
              )}
            </button>

            {/* Chat */}
            <button
              onClick={() => router.push(`/chat`)}
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {auth?.user ? (
              <div ref={closeUserMenu} className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all duration-200 ${
                    showUserMenu ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={auth?.user?.avatar || "/profile.png"}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {auth?.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {auth?.user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={`/profile/${auth?.user?._id}?tab=profile`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          {isGerman ? "Mein Profil" : "My Profile"}
                        </Link>
                        <Link
                          href={`/profile/${auth?.user?._id}?tab=orders`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          {isGerman ? "Bestellungen" : "My Orders"}
                        </Link>
                        <Link
                          href={`/profile/${auth?.user?._id}?tab=favorites`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-gray-400" />
                          {isGerman ? "Favoriten" : "Wishlist"}
                        </Link>
                        <Link
                          href={`/profile/${auth?.user?._id}?tab=settings`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          {isGerman ? "Einstellungen" : "Settings"}
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {isGerman ? "Abmelden" : "Sign Out"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/authentication"
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-full shadow-lg shadow-rose-500/25 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                {isGerman ? "Anmelden" : "Login"}
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsShow(!isShow)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push("/checkout")}
              className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {selectedProduct?.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {selectedProduct.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      {/* Mobile Search */}
      <AnimatePresence>
        {isShow && (
          <MobileProductSearch
            isShow={isShow}
            onClose={() => setIsShow(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {/* User Info */}
              {auth?.user ? (
                <Link
                  href={`/profile/${auth?.user?._id}?tab=profile`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3"
                >
                  <Image
                    src={auth?.user?.avatar || "/profile.png"}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {auth?.user?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {auth?.user?.email}
                    </p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </Link>
              ) : (
                <Link
                  href="/authentication"
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-xl mb-3"
                >
                  <User className="w-5 h-5" />
                  {isGerman ? "Anmelden" : "Sign In"}
                </Link>
              )}

              {/* Navigation Items */}
              {navItems.map((item) => {
                const isActive = pathName === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-rose-500" : item.color
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Quick Links */}
              {auth?.user && (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <Link
                    href={`/profile/${auth?.user?._id}?tab=orders`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">
                      {isGerman ? "Bestellungen" : "My Orders"}
                    </span>
                  </Link>
                  <Link
                    href={`/profile/${auth?.user?._id}?tab=chat`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">
                      {isGerman ? "Nachrichten" : "Messages"}
                    </span>
                  </Link>
                  <div className="h-px bg-gray-100 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">
                      {isGerman ? "Abmelden" : "Sign Out"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Notification Panel */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            ref={closeNotification}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg max-h-80 overflow-y-auto z-50"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <span className="font-semibold">
                  {isGerman ? "Benachrichtigungen" : "Notifications"}
                </span>
              </div>
              <button onClick={() => setShowNotification(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {notifications?.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    router.push(
                      `/profile/${auth?.user?._id}?tab=notifications`
                    );
                    setShowNotification(false);
                  }}
                  className={`px-4 py-3 border-b border-gray-100 cursor-pointer active:bg-gray-50 ${
                    !notification.read ? "bg-rose-50/50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {notification?.subject}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                    {notification?.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification?.createdAt
                      ? formatDistanceToNow(new Date(notification?.createdAt), {
                          addSuffix: true,
                        })
                      : isGerman
                      ? "Gerade eben"
                      : "Just now"}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {isGerman
                    ? "Keine Benachrichtigungen"
                    : "No notifications yet"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
