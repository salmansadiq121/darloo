"use client";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { useAuth } from "@/app/content/authContent";

const Header = () => {
  const { search, setSearch } = useAuth();
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const closeNotification = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  return (
    <nav
      className={`sticky  top-0 z-50 bg-gray-50 backdrop-blur-md shadow-sm text-black transition-all duration-300  ${
        scrolled ? "border-b-2 border-red-600" : "border-b border-gray-300"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-[4.5rem]">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 cursor-pointer flex items-center"
            >
              {/* <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={50}
                className="h-[3.5rem] w-[5rem] "
                loading="lazy"
              /> */}
              <h1 className="text-2xl sm:text-4xl font-extrabold  font-serif text-[#c6080a] uppercase  relative shadow-custom">
                Ayoob
              </h1>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              href="/top-sale"
              className={` border-b-2 ${
                pathName === "/top-sale"
                  ? "border-orange-500 text-orange-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              Top Sale
            </Link>
            <Link
              href="/popular"
              className={` border-b-2 ${
                pathName === "/popular"
                  ? "border-orange-500 text-orange-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              Popular
            </Link>
            <Link
              href="/categories"
              className={` border-b-2 ${
                pathName === "/categories"
                  ? "border-orange-500 text-orange-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              Cateogry
            </Link>
            <Link
              href="/products"
              className={` border-b-2 ${
                pathName === "/products"
                  ? "border-orange-500 text-orange-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              Accessories
            </Link>
            <Link
              href="/user-manual"
              className={` border-b-2 ${
                pathName === "/user-manual"
                  ? "border-orange-500 text-orange-600 bg-gradient-to-b from-white via-red-500/10 to-red-500/30 "
                  : "border-transparent text-gray-950"
              }  inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              User Manual
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="relative min-w-[18rem]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search listings..."
                value={debouncedSearch}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border  border-gray-300 rounded-md leading-5  bg-gray-50 placeholder-gray-600 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div
              ref={closeNotification}
              className="relative cursor-pointer ml-4"
            >
              <IoMdNotificationsOutline
                className="h-6 w-6 text-gray-900 "
                onClick={() => setShowNotification(!showNotification)}
              />
              <span className="absolute -top-4 -right-3 inline-flex items-center px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                5
              </span>
              {showNotification && (
                <div className="absolute top-5 right-3 text-xs font-semibold rounded-md shadow-md bg-gray-100 w-[18rem] min-h-[15rem] overflow-hidden">
                  <div className="w-full py-2 bg-red-600 text-white flex items-center justify-between px-2">
                    <h3 className="text-lg font-medium text-white flex items-center gap-1">
                      <IoMdNotifications className="h-6 w-6 text-white animate-pulse " />
                      Notifications
                    </h3>
                  </div>
                </div>
              )}
            </div>
            <div className="relative cursor-pointer ml-4">
              <FaShoppingCart className="h-6 w-6 text-gray-900" />
              <span className="absolute -top-4 -right-3 inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-700 text-white rounded-full">
                5
              </span>
            </div>
            {/* Profile */}
            <div className="relative">
              <Image
                src="/profile.png"
                alt="Profile"
                width={70}
                height={70}
                className="h-12 w-12 rounded-full"
              />
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <div
              className="relative cursor-pointer mr-5"
              onClick={() => setIsShow(!isShow)}
            >
              <IoSearch className="h-6 w-6 text-gray-900" />
            </div>
            <div className="relative cursor-pointer mr-5">
              <IoMdNotificationsOutline className="h-6 w-6 text-gray-900" />
              <span className="absolute -top-4 -right-3 inline-flex items-center px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                5
              </span>
            </div>
            <div className="relative cursor-pointer mr-4">
              <FaShoppingCart className="h-6 w-6 text-gray-900" />
              <span className="absolute -top-4 -right-3 inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-700 text-white rounded-full">
                5
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isShow && (
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search listings..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300  leading-5 bg-white  placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
      )}

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/top-sale"
              className={`flex items-center gap-2 ${
                pathName === `/top-sale`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              Top Sale
            </Link>
            <Link
              href="/popular"
              className={`flex items-center gap-2 ${
                pathName === `/popular`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              Popular
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-2 ${
                pathName === `/categories`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              Category
            </Link>
            <Link
              href="/products"
              className={`flex items-center gap-2 ${
                pathName === `/products`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              Accessories
            </Link>
            <Link
              href="/user-manual"
              className={`flex items-center gap-2 ${
                pathName === `/user-manual`
                  ? "border-l-4 border-red-500 text-red-700 bg-gray-800"
                  : "text-gray-950  "
              }   pl-3 pr-4 py-2 text-base font-medium`}
            >
              User Manual
            </Link>
          </div>
          {/* <div className="pt-4 pb-3 ">
            <div className="flex items-center px-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300  rounded-md leading-5 bg-white  placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>
          </div> */}
        </div>
      )}
    </nav>
  );
};

export default Header;
