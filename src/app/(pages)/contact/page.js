import React from "react";
import MainLayout from "@/app/components/Layout/Layout";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";

export default function Contact() {
  return (
    <MainLayout title="Darloo - Contact Us">
      <ContactClient />
    </MainLayout>
  );
}
