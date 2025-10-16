"use client";

import { categoryUri } from "@/app/utils/ServerURI";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Grid3X3, ArrowRight } from "lucide-react";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";

export default function Categories() {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [isLoadingSubCategory, setIsLoadingSubCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { countryCode } = useAuth();

  const isGerman = countryCode === "DE";

  // Fetch All Categories
  const fetchCategories = async () => {
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
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // Fetch Sub Categories
  const fetchSubCategories = async () => {
    if (!selectedCategoryId) return;

    setIsLoadingSubCategory(true);
    try {
      const { data } = await axios.get(
        `${categoryUri}/subcategory/${selectedCategoryId}`
      );
      setSubCategoryData(data.subCategories || []);
    } catch (error) {
      console.log(error);
      setSubCategoryData([]);
    } finally {
      setIsLoadingSubCategory(false);
    }
  };

  // Filter By Category
  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategoryName(category.name);
  };

  const handleSubCategoryClick = (id) => {
    router.push(`/products?subcategory=${id}`);
  };

  const handleViewAllProducts = () => {
    router.push(`/products`);
  };

  // Filter categories based on search
  const filteredCategories = categoriesData.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title={"Categories - Darloo Shop"}>
      <div className="min-h-screen bg-gray-50 py-6 ">
        <div className="max-w-7xl mx-auto px-4 z-10 relative">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isGerman ? "Kategorien" : "Categories"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isGerman
                ? "Durchsuchen Sie unsere Produktkategorien"
                : "Browse our product categories"}
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-red-600" />
              {isGerman ? "Alle Kategorien" : "All Categories"}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredCategories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className={`group bg-white rounded-lg p-4 cursor-pointer shadow-sm border transition-all duration-200 hover:shadow-md hover:border-red-300 hover:-translate-y-1 ${
                      selectedCategoryId === category._id
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`relative mb-2 ${
                          selectedCategoryId === category._id
                            ? "scale-110"
                            : "group-hover:scale-105"
                        } transition-transform duration-200`}
                      >
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {selectedCategoryId === category._id && (
                          <div className="absolute -inset-1 bg-red-500/40 rounded-lg blur opacity-25"></div>
                        )}
                      </div>
                      <p
                        className={`text-xs font-medium truncate w-full ${
                          selectedCategoryId === category._id
                            ? "text-red-700"
                            : "text-gray-700 group-hover:text-red-600"
                        }`}
                      >
                        {category.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategories */}
          {selectedCategoryId && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center  gap-4 justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {isGerman ? "Unterkategorien" : "Subcategories"}
                </h3>
                <button
                  onClick={() => handleViewAllProducts()}
                  className="text-sm text-red-600 hover:text-red-700  font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200"
                >
                  {isGerman ? "Alle  anzeigen" : "View All"}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {isLoadingSubCategory ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                        <div className="h-2 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : subCategoryData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {subCategoryData.map((subCategory) => (
                    <button
                      key={subCategory._id}
                      onClick={() => handleSubCategoryClick(subCategory._id)}
                      className="group bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg p-3 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
                    >
                      <div className="flex flex-col items-center text-center">
                        {subCategory.image ? (
                          <Image
                            src={subCategory.image || "/placeholder.svg"}
                            alt={subCategory.name}
                            width={52}
                            height={54}
                            className="w-12 h-12 object-cover rounded mb-2 group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mb-2 group-hover:bg-red-200 transition-colors duration-200">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-700 group-hover:text-red-700 truncate w-full transition-colors duration-200">
                          {subCategory.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Grid3X3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {isGerman
                      ? "Keine Unterkategorien verfügbar"
                      : "No subcategories available"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
