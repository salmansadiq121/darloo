"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { bannersUri } from "@/app/utils/ServerURI";
import axios from "axios";

export default function Crousel() {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Banner Data
  const fetchBannerData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${bannersUri}/list`);
      setBannerData(data.banners);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    document.querySelector(".custom-prev").addEventListener("click", () => {
      document.querySelector(".swiper-button-prev").click();
    });
    document.querySelector(".custom-next").addEventListener("click", () => {
      document.querySelector(".swiper-button-next").click();
    });
  }, []);
  return (
    <div className="w-full max-h-[400px] py-4 px-0 z-[10]">
      {isLoading ? (
        <div className="animate-pulse flex justify-center items-center bg-gray-300/70 h-[220px] sm:h-[400px] rounded-lg p-6">
          <div className=" bg-gray-500/70 rounded-lg animate-pulse w-full h-full"></div>
        </div>
      ) : (
        <div className="w-full relative ">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full"
          >
            {bannerData.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative flex flex-col  md:flex-row bg-green-900 text-white overflow-hidden items-center justify-between rounded-lg">
                  <Image
                    src={banner.image}
                    alt="Banner Image"
                    width={1000}
                    height={400}
                    className=" w-full h-[220px] sm:h-[400px] object-fill"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Buttons */}
          <button
            className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 text-red-600 w-[2rem] h-[2.2rem] flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
            style={{
              clipPath:
                " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            ❮
          </button>
          <button
            className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 w-[2rem] h-[2.2rem] text-red-600  flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
            style={{
              clipPath:
                " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
