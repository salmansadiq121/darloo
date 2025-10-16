"use client";
import MainLayout from "@/app/components/Layout/Layout";
import SupportSection from "@/app/components/Profile/SupportSection";
import { useAuth } from "@/app/content/authContent";
import React from "react";

export default function Contact() {
  const { countryCode } = useAuth();

  const isGerman = countryCode === "DE";

  return (
    <MainLayout title="Darloo - Contact Us">
      <div className="flex flex-col gap-4 min-h-screen w-fit z-10 relative py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          {isGerman ? "Kontaktieren Sie uns" : "Contact Us"}
        </h1>
        <SupportSection countryCode={countryCode} />
      </div>
    </MainLayout>
  );
}
