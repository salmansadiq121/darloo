"use client";

import { useEffect, useState } from "react";

export default function GlobalError({ error, reset }) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    console.error("Global error:", error);
    setIsAnimated(true);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #fef2f2, #ffffff, #fff7ed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.1)",
              overflow: "hidden",
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease",
            }}
          >
            {/* Top accent */}
            <div
              style={{
                height: "6px",
                background: "linear-gradient(to right, #dc2626, #f97316, #dc2626)",
              }}
            />

            <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
              {/* Icon */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 2rem",
                  background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>

              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: "0 0 0.75rem" }}>
                Something Went Wrong
              </h1>
              <p style={{ fontSize: "1rem", color: "#6b7280", margin: "0 0 2rem", lineHeight: 1.6 }}>
                A critical error occurred. Please try refreshing the page.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  onClick={() => reset()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "linear-gradient(to right, #dc2626, #ef4444)",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)",
                  }}
                >
                  Try Again
                </button>
                <a
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
