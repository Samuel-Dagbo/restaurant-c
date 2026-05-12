"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  HiHome, HiClipboardList, HiCube, HiMenu, HiX,
  HiUser, HiMail, HiLogout, HiShoppingCart
} from "react-icons/hi";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: any;
}

const userLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Overview", icon: HiHome },
  { href: "/dashboard/orders", label: "My Orders", icon: HiClipboardList },
  { href: "/menu", label: "Browse Menu", icon: HiShoppingCart },
  { href: "/contact", label: "Support", icon: HiMail },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Overview", icon: HiHome },
  { href: "/admin/menu", label: "Menu", icon: HiCube },
  { href: "/admin/orders", label: "Orders", icon: HiClipboardList },
];

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "admin";
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-dark-bg pt-20">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-24 left-4 z-30 lg:hidden p-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream/60 hover:text-primary shadow-lg"
      >
        <HiMenu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-20 bottom-0 w-64 bg-dark-card border-r border-primary/10 flex-col z-30">
        <SidebarContent links={links} session={session} isAdmin={isAdmin} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-dark-card border-r border-primary/10 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-primary/10">
                <span className="text-lg font-bold text-primary">Savory</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-cream/40 hover:text-cream">
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent links={links} session={session} isAdmin={isAdmin} pathname={pathname} close={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function SidebarContent({
  links, session, isAdmin, pathname, close,
}: {
  links: SidebarLink[];
  session: any;
  isAdmin: boolean;
  pathname: string;
  close?: () => void;
}) {
  return (
    <>
      <div className="p-5 border-b border-primary/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
            <HiUser className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-cream/40 truncate">{session?.user?.email}</p>
          </div>
        </div>
        {isAdmin && (
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-primary/20 text-primary">
            Admin Panel
          </span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-primary/15 text-primary font-medium border border-primary/20"
                  : "text-cream/50 hover:text-cream hover:bg-dark-bg/50 border border-transparent"
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-primary/10 shrink-0">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-cream/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <HiLogout className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}
