"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import React, { useState } from "react";

export default function Profile() {
  const { auth } = useAuth();
  const [addressDetails, setAddressDetails] = useState({
    pincode: "",
    city: "",
    state: "",
    country: "",
    address: "",
  });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountHolder: "",
    ifscCode: "",
  });
  return (
    <MainLayout title="Ayoob - Profile">
      <div className="w-full min-h-screen py-4 sm:py-6 px-4 sm:px-8">
        Profile
      </div>
    </MainLayout>
  );
}
