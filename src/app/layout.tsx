import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import ToastProvider from "@/providers/ToastProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

export const metadata: Metadata = {
  title: "Savory Restaurant | Premium Fine Dining",
  description: "Experience exceptional culinary artistry at Savory Restaurant. Award-winning fine dining with farm-to-table ingredients, master chefs, and an unforgettable ambiance.",
  keywords: "restaurant, fine dining, gourmet, culinary, Savory, premium dining",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg text-cream antialiased font-sans">
        <SessionProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartSidebar />
            </ToastProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
