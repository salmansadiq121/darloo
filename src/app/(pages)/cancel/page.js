import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  XCircle,
  Home,
  ShoppingBag,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

export default function OrderCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950/20 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-32 left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Back button */}
        <div className="mb-8 animate-fade-in">
          <Button
            asChild
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="bg-zinc-900/50 backdrop-blur-xl border-red-600/20 shadow-2xl shadow-red-600/10 overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            {/* Icon with animation */}
            <div className="flex justify-center animate-bounce-in">
              <div className="relative">
                <div className="w-28 h-28 bg-red-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-red-600/40 animate-float">
                  <XCircle className="w-16 h-16 text-red-600" strokeWidth={2} />
                </div>
                <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl animate-pulse-glow" />
              </div>
            </div>

            {/* Content */}
            <div
              className="text-center space-y-4 animate-slide-up"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white text-balance">
                Order Cancelled
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto text-pretty">
                Your order has been successfully cancelled. No charges have been
                made to your account.
              </p>
            </div>

            {/* Info card */}
            <div
              className="bg-zinc-800/50 border border-red-600/20 rounded-xl p-6 space-y-3 animate-slide-up"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">What happens next?</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    If you were charged, the refund will be processed within 5-7
                    business days. You&apos;ll receive a confirmation email
                    shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Changed your mind?</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    You can always place a new order. Your cart items are still
                    saved for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up"
              style={{ animationDelay: "0.4s", opacity: 0 }}
            >
              <Button
                asChild
                size="lg"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-base font-semibold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 border-red-600/30 text-white hover:bg-red-600/10 hover:border-red-600 py-6 text-base font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </div>

            {/* Help section */}
            <div
              className="text-center pt-6 border-t border-zinc-800 animate-fade-in"
              style={{ animationDelay: "0.6s", opacity: 0 }}
            >
              <p className="text-sm text-zinc-500 mb-3">
                Need help with your cancellation?
              </p>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-500 hover:bg-red-600/10"
              >
                <Link href="/support">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Additional info */}
        <div
          className="mt-8 text-center animate-fade-in"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          <p className="text-sm text-zinc-500">
            Order ID:{" "}
            <span className="text-zinc-400 font-mono">
              #DRL-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
