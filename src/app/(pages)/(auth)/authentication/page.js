"use client";
import Login from "@/app/components/Auth/Login";
import Register from "@/app/components/Auth/Register";
import ResetPassword from "@/app/components/Auth/ResetPassword";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function Authentication() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("@darloo")) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Darloo - Authentication</title>
      </Helmet>
      {activeTab === "login" ? (
        <Login setActive={setActiveTab} />
      ) : activeTab === "register" ? (
        <Register setActive={setActiveTab} />
      ) : (
        <ResetPassword setActive={setActiveTab} />
      )}
    </>
  );
}
