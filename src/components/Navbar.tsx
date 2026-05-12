"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiShoppingCart, HiUser, HiLogout } from "react-icons/hi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user as { name?: string; email?: string; role?: string; image?: string } | undefined;
  const isAdmin = user?.role === "admin";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark-bg/95 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-primary/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-bold text-primary group-hover:text-primary-light transition-colors">
              Savory
            </span>
            <span className="hidden sm:block text-2xl sm:text-3xl font-light text-cream/60">|</span>
            <span className="hidden sm:block text-sm uppercase tracking-[0.3em] text-cream/40">
              Restaurant
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/menu"
              className="relative p-2 text-cream/70 hover:text-primary transition-colors"
            >
              <HiShoppingCart className="w-6 h-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-dark-bg text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {mounted && session ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-cream/80 hover:bg-primary/10 hover:border-primary transition-all text-sm"
                >
                  <HiUser className="w-4 h-4" />
                  <span>{user?.name?.split(" ")[0] || "Dashboard"}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-cream/50 hover:text-red-400 transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : mounted ? (
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-primary text-dark-bg font-medium text-sm hover:bg-primary-light transition-all duration-300"
              >
                Sign In
              </Link>
            ) : null}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-cream/70 hover:text-primary"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-primary/10 bg-dark-bg/98 backdrop-blur-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-primary/10 pt-4 mt-4">
                {session ? (
                  <>
                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className="block text-sm text-cream/70 hover:text-primary py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block text-sm text-red-400 hover:text-red-300 py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm text-primary hover:text-primary-light py-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
