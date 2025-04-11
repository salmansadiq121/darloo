import Faqs from "@/app/components/Faqs";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";

export default function FAQPage() {
  return (
    <MainLayout title={"Ayoob - FAQ's"}>
      <div className="w-full min-h-[70vh] py-4 px-4">
        <Faqs />
      </div>
    </MainLayout>
  );
}
