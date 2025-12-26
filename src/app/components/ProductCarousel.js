"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }) {
  useEffect(() => {
    // Wait for DOM to be ready and Swiper to initialize
    let handlePrevClick = null;
    let handleNextClick = null;
    let prevBtn = null;
    let nextBtn = null;

    const setupNavigation = () => {
      prevBtn = document.querySelector(".custom-prev");
      nextBtn = document.querySelector(".custom-next");
      const swiperPrev = document.querySelector(".swiper-button-prev");
      const swiperNext = document.querySelector(".swiper-button-next");

      if (!prevBtn || !nextBtn || !swiperPrev || !swiperNext) {
        return false;
      }

      handlePrevClick = () => {
        if (swiperPrev) {
          swiperPrev.click();
        }
      };

      handleNextClick = () => {
        if (swiperNext) {
          swiperNext.click();
        }
      };

      prevBtn.addEventListener("click", handlePrevClick);
      nextBtn.addEventListener("click", handleNextClick);

      return true;
    };

    // Use setTimeout to ensure Swiper is initialized
    const timeoutId = setTimeout(() => {
      setupNavigation();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (prevBtn && handlePrevClick) {
        prevBtn.removeEventListener("click", handlePrevClick);
      }
      if (nextBtn && handleNextClick) {
        nextBtn.removeEventListener("click", handleNextClick);
      }
    };
  }, []);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 24,
          },

          1636: {
            slidesPerView: 6,
            spaceBetween: 24,
          },
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={products.length > 3}
        className="w-full !pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product?._id} className="!h-auto">
            <div className="h-full">
              <ProductCard
                product={product}
                sale={true}
                tranding={true}
                isDesc={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className="custom-prev absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-red-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-xl border border-red-100 transition-all duration-300 z-20 cursor-pointer hover:scale-110"
        aria-label="Previous slide"
        suppressHydrationWarning
      >
        <span className="text-xl font-bold" aria-hidden="true">
          ❮
        </span>
      </button>
      <button
        className="custom-next absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-red-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-xl border border-red-100 transition-all duration-300 z-20 cursor-pointer hover:scale-110"
        aria-label="Next slide"
        suppressHydrationWarning
      >
        <span className="text-xl font-bold" aria-hidden="true">
          ❯
        </span>
      </button>
    </div>
  );
}
