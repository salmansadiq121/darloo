"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useAuth } from "@/app/content/authContent";

// 🌍 Country Data
const countryList = [
  { code: "US", value: "USD", label: "English (United States)", symbol: "$" },
  { code: "DE", value: "EUR", label: "Germany (Deutschland)", symbol: "€" },
];

export default function CountrySelector() {
  const [country, setCountry] = useState(null);
  const { setCountry: setAuthCountry, setCountryCode } = useAuth();

  // Load previously selected country from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("country");
    if (saved) {
      const found = countryList.find((c) => c.value === saved);
      if (found) setCountry(found);
    } else {
      setCountry(countryList[0]);
      setAuthCountry(countryList[0]);
    }
  }, []);

  // Save selection
  const handleSelect = (selected) => {
    setCountry(selected);
    setCountryCode(selected.code);
    setAuthCountry(selected.value);
    localStorage.setItem("country", selected.value);
    localStorage.setItem("countryCode", selected.code);
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <span className="flex items-center justify-between w-full space-x-2">
              <div className="flex items-center">
                <ReactCountryFlag
                  countryCode={country?.code || "FR"}
                  svg
                  style={{ fontSize: "1.2em", borderRadius: "4px" }}
                />
                <span className="text-sm font-medium ml-1">
                  {country ? `${country.label}` : "Select country"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Select Your Country
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />

          {countryList.map((c) => (
            <DropdownMenuItem
              key={c.value}
              onClick={() => handleSelect(c)}
              className={`flex items-center justify-between py-3 px-3 rounded-xl transition-all duration-150 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                country?.code === c.code ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <ReactCountryFlag
                  countryCode={c.code}
                  svg
                  style={{ fontSize: "1.3em" }}
                />
                <span className="font-medium">{c.label}</span>
              </div>

              {country?.code === c.code && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
