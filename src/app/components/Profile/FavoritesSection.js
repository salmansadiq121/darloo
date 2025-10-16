import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import axios from "axios";
import { productsURI } from "@/app/utils/ServerURI";
import ProductCard from "../ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesSection({ countryCode }) {
  const [favorites, setFavorites] = useState([]);
  const isGerman = countryCode === "DE";

  useEffect(() => {
    const fetchFavorites = async () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      console.log("favorites", favorites);

      try {
        let products = await Promise.all(
          favorites.map(async (fav) => {
            const { data } = await axios.get(
              `${productsURI}/product/detail/${fav}`
            );
            return data.product;
          })
        );

        setFavorites(products);
        // Do something with the products (e.g., update state)
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      }
    };

    fetchFavorites();
  }, []);

  const EmptyState = ({ onClearFilters }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center mt-10 py-12"
    >
      <Image
        src="/9960436.jpg?height=200&width=200"
        alt="No products found"
        width={200}
        height={200}
        className="w-64 h-64 opacity-50"
      />
      <h3 className="text-xl font-semibold mt-6 text-gray-700 text-center">
        {isGerman ? "Keine Favoriten gefunden" : "No favorites found"}
      </h3>
      <p className="text-gray-500 mt-2 text-center max-w-md mx-auto">
        {isGerman
          ? "Sie haben noch keine Produkte in Ihrem Favoriten-Bereich gespeichert."
          : "You haven't saved any products to your favorites yet."}
      </p>
    </motion.div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isGerman ? "Favoriten" : "Favorites"}</CardTitle>
        <CardDescription>
          {isGerman
            ? "Speichern Sie Ihre Lieblingsprodukte hier"
            : "Save your favorite products here"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites?.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                sale={true}
                tranding={true}
                isDesc={true}
              />
            ))}
          </div>
        ) : (
          <div className="">
            <EmptyState />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
