"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ShoppingBag } from "lucide-react";
import MainLayout from "./components/Layout/Layout";

export default function NotFound() {
  return (
    <MainLayout title="Darloo - Not Found">
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950/20 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center space-y-8">
            {/* 404 Number with animation */}
            <div className="relative">
              <h1 className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-500 to-red-700 leading-none animate-bounce-in select-none">
                404
              </h1>
              <div className="absolute inset-0 text-[180px]font-black text-red-600/20 blur-2xl leading-none select-none">
                404
              </div>
            </div>

            {/* Floating icon */}
            <div className="flex justify-center -mt-12 mb-8 z-50">
              <div className="relative animate-float">
                <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-600/30">
                  <Search className="w-12 h-12 text-red-600" />
                </div>
                <div className="absolute inset-0 bg-red-600/30 rounded-full blur-xl animate-pulse-glow" />
              </div>
            </div>

            {/* Text content */}
            <div
              className="space-y-4 animate-slide-up"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white text-balance">
                Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto text-pretty">
                Oops! The page you&apos;re looking for seems to have wandered
                off. Let&apos;s get you back to shopping amazing products at
                Darloo.
              </p>
            </div>

            {/* Action buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up"
              style={{ animationDelay: "0.4s", opacity: 0 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-red-600/30 text-white hover:bg-red-600/10 hover:border-red-600 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Quick links */}
            <div
              className="pt-12 animate-fade-in"
              style={{ animationDelay: "0.6s", opacity: 0 }}
            >
              <p className="text-sm text-zinc-500 mb-4">Popular pages:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {["New Arrivals", "Best Sellers", "Sale", "Categories"].map(
                  (item, index) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-zinc-400 hover:text-red-600 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-red-600/10 border border-transparent hover:border-red-600/30"
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
