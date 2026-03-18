"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Headphones } from "lucide-react";

export default function Error({ error, reset }) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    console.error("Application error:", error);
    setIsAnimated(true);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #dc2626 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className={`max-w-lg w-full relative z-10 transition-all duration-700 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-100/50 border border-red-100/50 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-400 to-red-600" />

          <div className="p-8 sm:p-10">
            {/* Error icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                    <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Ping effect */}
                <div className="absolute inset-0 w-24 h-24 bg-red-400 rounded-full animate-ping opacity-20" />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
                We hit an unexpected error. Don&apos;t worry — your data is safe. Let&apos;s get you back on track.
              </p>
            </div>

            {/* Error details (collapsible) */}
            {error?.message && (
              <div className="mb-8 bg-red-50/80 border border-red-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-red-600/80 font-mono break-all leading-relaxed">
                    {error.message}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-red-200/50 hover:shadow-red-300/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Headphones className="w-4 h-4" />
              <span>Need help?</span>
              <Link href="/contact" className="text-red-500 hover:text-red-600 font-medium hover:underline transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Error code badge */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-gray-400 tracking-wider">ERROR 500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
