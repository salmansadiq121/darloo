"use client";
import { Menu, X, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { useAuth } from "@/app/content/authContent";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { MdSupportAgent } from "react-icons/md";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import ProductSearch from "./SearchProduct";
import MobileProductSearch from "./MobileSearch";
import PromoBannerPage from "./HeaderTop";

const deTranslations = {
  "Top Sale": "Top-Angebote",
  Popular: "Beliebt",
  Cateogry: "Kategorie",
  Category: "Kategorie",
  Accessories: "Zubehör",
  Help: "Hilfe",
  Login: "Anmelden",
  Logout: "Abmelden",
  Notifications: "Benachrichtigungen",
  Profile: "Profil",
  "Open main menu": "Hauptmenü öffnen",
  "Just now": "Gerade eben",
};

const Header = () => {
  const { auth, setAuth, setSearch, selectedProduct, countryCode } = useAuth();
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const closeNotification = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  console.log("countryCode:", countryCode);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/all/user/${auth?.user?._id}`
      );
      console.log("datanotifications", data);
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
    const handler = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.1;

      if (window.scrollY > scrollThreshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeNotification.current &&
        !closeNotification.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    signOut();
    setAuth({ user: null, token: "" });
    localStorage.removeItem("@ayoob");
    Cookies.remove("@ayoob");
    router.push("/authentication");
  };

  const tr = (s) => (countryCode === "DE" ? deTranslations[s] ?? s : s);

  return (
    <nav
      className={`relative z-50 bg-gray-50 backdrop-blur-md shadow-sm text-black transition-all duration-300  ${
        scrolled ? "border-b-2 border-red-600" : "border-b border-gray-300"
      }`}
    >
      <PromoBannerPage countryCode={countryCode} />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-[4.1rem]">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 cursor-pointer flex items-center"
            >
              <h1 className="text-2xl sm:text-4xl font-extrabold  font-serif text-[#c6080a] uppercase  relative shadow-custom">
                Darloo
              </h1>
            </Link>
          </div>
          <div className="hidden sm:ml-3 lg:flex sm:space-x-4">
            <Link
              href="/top-sale"
              className={` border-b-2 ${
                pathName === "/top-sale"
                  ? "border-red-500 text-red-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              {tr("Top Sale")}
            </Link>
            <Link
              href="/popular"
              className={` border-b-2 ${
                pathName === "/popular"
                  ? "border-red-500 text-red-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              {tr("Popular")}
            </Link>
            <Link
              href="/categories"
              className={` border-b-2 ${
                pathName === "/categories"
                  ? "border-red-500 text-red-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              {tr("Category")}
            </Link>
            <Link
              href="/products"
              className={` border-b-2 ${
                pathName === "/products"
                  ? "border-red-500 text-red-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              {tr("Accessories")}
            </Link>
            <Link
              href={"/contact"}
              className={` border-b-2 ${
                pathName === `/contact`
                  ? "border-red-500 text-red-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              {tr("Help")}
            </Link>
          </div>
          <div className="hidden sm:ml-6 lg:flex sm:items-center sm:space-x-3">
            <ProductSearch />
            <div
              ref={closeNotification}
              className="relative cursor-pointer ml-4"
            >
              <IoMdNotificationsOutline
                className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300 "
                onClick={() => setShowNotification(!showNotification)}
              />
              <span className="absolute -top-4 -right-3 inline-flex items-center w-5 h-5  justify-center text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                {notifications?.length}
              </span>
              {showNotification && (
                <div className="absolute top-8 right-3 text-xs font-semibold rounded-md shadow-md bg-gray-100 w-[18rem] min-h-[15rem] overflow-hidden ">
                  <div className="w-full py-2 bg-red-600 text-white flex items-center justify-between px-2">
                    <h3 className="text-lg font-medium text-white flex items-center gap-1">
                      <IoMdNotifications className="h-6 w-6 text-white animate-pulse " />
                      {tr("Notifications")}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3 px-3 py-2">
                    {notifications?.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          router.push(
                            `/profile/${auth?.user?._id}?tab=notifications`
                          )
                        }
                        className="flex flex-col gap-2 py-[.4rem] px-3 rounded-md hover:bg-gray-100 border hover:border-red-500 group "
                      >
                        <div className="flex flex-col gap-2 rounded-sm group-hover:text-red-600  cursor-pointer transition-all duration-300">
                          <span className="text-sm font-medium">
                            {notification?.subject}
                          </span>
                          <p className="text-xs text-gray-500">
                            {notification?.message}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 ">
                          <span className="text-[10px]">
                            {notification?.createdAt
                              ? formatDistanceToNow(
                                  new Date(notification?.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )
                              : tr("Just now")}
                          </span>
                          {notification?.read ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={() => router.push("/cart")}
              className="relative cursor-pointer ml-4"
            >
              <FaShoppingCart className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300" />
              <span className="absolute -top-4 -right-3 inline-flex items-center w-5 h-5  justify-center text-xs font-semibold bg-red-700 text-white rounded-full">
                {selectedProduct ? selectedProduct.length : 0}
              </span>
            </div>
            <div
              onClick={() =>
                router.push(`/profile/${auth?.user?._id}?tab=chat`)
              }
              className="relative cursor-pointer ml-4"
            >
              <MdSupportAgent className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300" />
            </div>

            {!auth?.user ? (
              <div className="">
                <button
                  onClick={() => router.push("/authentication")}
                  className="px-7 py-[.45rem] cursor-pointer bg-[#c6080a] hover:bg-red-800 transition-all duration-300 text-white rounded-[2rem]"
                >
                  {tr("Login")}
                </button>
              </div>
            ) : (
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  router.push(`/profile/${auth?.user?._id}?tab=profile`)
                }
              >
                <Image
                  src={auth?.user?.avatar || "/profile.png"}
                  alt={tr("Profile")}
                  width={70}
                  height={70}
                  className={`h-12 w-12 rounded-full ${
                    pathName === "/profile"
                      ? "border-red-500 border-2"
                      : "border"
                  }`}
                />
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer"
                onClick={() => setIsShow(!isShow)}
              >
                <IoSearch className="h-6 w-6 text-gray-900" />
              </div>
              <div ref={closeNotification} className="relative cursor-pointer ">
                <IoMdNotificationsOutline
                  className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300 "
                  onClick={() => setShowNotification(!showNotification)}
                />
                <span className="absolute -top-4 -right-3 inline-flex items-center w-5 h-5  justify-center text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                  {notifications?.length}
                </span>
                {showNotification && (
                  <div className="absolute top-11 -right-15 sm:right-3 z-[999] text-xs font-semibold rounded-md shadow-md bg-gray-100 w-[18rem] min-h-[15rem] overflow-hidden ">
                    <div className="w-full py-2 bg-red-600 text-white flex items-center justify-between px-2">
                      <h3 className="text-lg font-medium text-white flex items-center gap-1">
                        <IoMdNotifications className="h-6 w-6 text-white animate-pulse " />
                        {tr("Notifications")}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3 px-3 py-2">
                      {notifications?.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() =>
                            router.push(
                              `/profile/${auth?.user?._id}?tab=notifications`
                            )
                          }
                          className="flex flex-col gap-2 py-[.4rem] px-3 rounded-md hover:bg-gray-100 border"
                        >
                          <div className="flex flex-col gap-2 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300">
                            <span className="text-sm font-medium">
                              {notification?.subject}
                            </span>
                            <p className="text-xs text-gray-500">
                              {notification?.message}
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-2 ">
                            <span className="text-[10px]">
                              {notification?.createdAt
                                ? formatDistanceToNow(
                                    new Date(notification?.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : tr("Just now")}
                            </span>
                            {notification?.read ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                onClick={() => router.push("/cart")}
                className="relative cursor-pointer "
              >
                <FaShoppingCart className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300" />
                <span className="absolute -top-4 -right-3 inline-flex items-center w-5 h-5  justify-center text-xs font-semibold bg-red-700 text-white rounded-full">
                  {selectedProduct ? selectedProduct.length : 0}
                </span>
              </div>
              <div
                onClick={() =>
                  router.push(`/profile/${auth?.user?._id}?tab=chat`)
                }
                className="relative cursor-pointer"
              >
                <MdSupportAgent className="h-6 w-6 text-gray-900 hover:text-red-600 transition-all duration-300" />
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 outline-none"
            >
              <span className="sr-only">{tr("Open main menu")}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isShow && <MobileProductSearch isShow={isShow} />}

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {!auth?.user ? (
              <div className=" ml-3">
                <button
                  onClick={() => router.push("/authentication")}
                  className="px-7 py-[.45rem] cursor-pointer bg-[#c6080a] hover:bg-red-800 transition-all duration-300 text-white rounded-[2rem]"
                >
                  {tr("Login")}
                </button>
              </div>
            ) : (
              <div
                className="relative cursor-pointer ml-3 flex items-center gap-1"
                onClick={() =>
                  router.push(`/profile/${auth?.user?._id}?tab=profile`)
                }
              >
                <Image
                  src={auth?.user?.avatar || "/profile.png"}
                  alt={tr("Profile")}
                  width={70}
                  height={70}
                  className={`h-12 w-12 rounded-full ${
                    pathName === "/profile"
                      ? "border-red-500 border-2"
                      : "border"
                  }`}
                />
                <div className="flex flex-col gap-0">
                  <h3 className=" text-[16px] font-medium text-black">
                    {auth?.user?.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {auth?.user?.email}
                  </span>
                </div>
              </div>
            )}
            <Link
              href="/top-sale"
              className={`flex items-center gap-2 ${
                pathName === `/top-sale`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              {tr("Top Sale")}
            </Link>
            <Link
              href="/popular"
              className={`flex items-center gap-2 ${
                pathName === `/popular`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              {tr("Popular")}
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-2 ${
                pathName === `/categories`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              {tr("Category")}
            </Link>
            <Link
              href="/products"
              className={`flex items-center gap-2 ${
                pathName === `/products`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              {tr("Accessories")}
            </Link>
            <Link
              href={"/contact"}
              className={`flex items-center gap-2 ${
                pathName === `/contact`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              {tr("Help")}
            </Link>
            {auth?.user && (
              <button
                onClick={() => handleLogout()}
                className={`flex items-center gap-2  text-red-700 pl-3 pr-4 py-2 text-base font-medium`}
              >
                {tr("Logout")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
