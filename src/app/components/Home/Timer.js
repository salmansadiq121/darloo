"use client";

import { useEffect, useState } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetTime = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, color: "from-red-600 to-red-700" },
    { label: "Hours", value: timeLeft.hours, color: "from-red-500 to-red-600" },
    {
      label: "Minutes",
      value: timeLeft.minutes,
      color: "from-red-400 to-red-500",
    },
    {
      label: "Seconds",
      value: timeLeft.seconds,
      color: "from-red-300 to-red-400",
    },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="relative  rounded-2xl  bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 ">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-400/20 blur-3xl rounded-full scale-150"></div>

      {/* Timer Container */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
        <div className="flex items-center justify-center space-x-3 md:space-x-6">
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center group">
              {/* Time Display */}
              <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-2xl blur-sm scale-110"></div>

                {/* Main Container */}
                <div
                  className={`relative bg-gradient-to-br ${unit.color} w-15 h-15 md:w-19 md:h-19 flex items-center justify-center rounded-2xl shadow-2xl border border-red-400/20 group-hover:scale-105 transition-all duration-300`}
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>

                  {/* Number */}
                  <span className="relative text-lg sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    {String(unit.value).padStart(2, "0")}
                  </span>

                  {/* Pulse Animation */}
                  {unit.label === "Seconds" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/40 to-red-600/40 rounded-2xl animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Label */}
              <div className="mt-4 text-center">
                <span className="text-sm md:text-base text-gray-200 font-medium uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
