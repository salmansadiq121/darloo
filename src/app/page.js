"use client";
import axios from "axios";
import Crousel from "./components/Home/Crousel";
import HeaderFilter from "./components/Home/HeaderFilter";
import MainLayout from "./components/Layout/Layout";
import { categoryUri } from "./utils/ServerURI";
import { useEffect, useState } from "react";
import { Style } from "./utils/CommonStyle";
import Categories from "./components/Home/Categories";
import SalesProducts from "./components/Home/SalesProducts";
import TrendingProducts from "./components/Home/TrendingProducts";
import AllProducts from "./components/Home/AllProducts";

export default function Home() {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //   Fetch All Categoryes
  const categories = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${categoryUri}/all/categories`);
      const categoriesData = data.categories;
      setCategoryData(categoriesData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    categories();
  }, []);
  return (
    <MainLayout>
      <div
        className={`w-full ${Style.container} min-h-screen bg-white text-black flex flex-col gap-4 z-[10] pb-6 `}
      >
        <HeaderFilter categoriesData={categoriesData} isLoading={isLoading} />
        <Crousel />
        <Categories categoriesData={categoriesData} isLoading={isLoading} />
        <SalesProducts />
        <TrendingProducts />
        <AllProducts />
      </div>
    </MainLayout>
  );
}
