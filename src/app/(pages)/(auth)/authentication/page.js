"use client";
import Login from "@/app/components/Auth/Login";
import Register from "@/app/components/Auth/Register";
import MainLayout from "@/app/components/Layout/Layout";
import React, { useState } from "react";

export default function Authentication() {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <MainLayout title="Ayoob - Authentication">
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute top-[-3rem] right-4 z-[1]">
          <div
            className="productGlow"
            style={{
              width: "400px",
              height: "400px",
              zIndex: "3",
              top: "-5%",
            }}
          ></div>
        </div>
        <div className="absolute bottom-8 -left-12 z-[1]">
          <div
            className="productGlow"
            style={{
              width: "400px",
              height: "400px",
              zIndex: "3",
              top: "-10%",
            }}
          ></div>
        </div>
        {/* ------------------------------tabs----------------------------- */}
        {activeTab === "login" ? (
          <Login setActive={setActiveTab} />
        ) : activeTab === "register" ? (
          <Register setActive={setActiveTab} />
        ) : (
          ""
        )}
      </div>
    </MainLayout>
  );
}
