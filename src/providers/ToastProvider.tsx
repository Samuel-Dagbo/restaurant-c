"use client";

import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

export default function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1410",
            color: "#f5f0e1",
            border: "1px solid #c9a96e",
            borderRadius: "8px",
          },
          success: { iconTheme: { primary: "#c9a96e", secondary: "#1a1410" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#1a1410" } },
        }}
      />
      {children}
    </>
  );
}
