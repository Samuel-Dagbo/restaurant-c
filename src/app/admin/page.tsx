"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { motion } from "framer-motion";
import { HiCollection, HiClipboardList, HiArrowRight, HiCube } from "react-icons/hi";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalMenuItems: number;
  totalCategories: number;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0, pendingOrders: 0, totalMenuItems: 0, totalCategories: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, menuRes, catRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/menu"),
          fetch("/api/menu?type=categories"),
        ]);
        const orders = ordersRes.ok ? await ordersRes.json() : [];
        const menu = menuRes.ok ? await menuRes.json() : [];
        const cats = catRes.ok ? await catRes.json() : [];
        setStats({
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          pendingOrders: Array.isArray(orders) ? orders.filter((o: any) => o.status === "pending").length : 0,
          totalMenuItems: Array.isArray(menu) ? menu.length : 0,
          totalCategories: Array.isArray(cats) ? cats.length : 0,
        });
      } catch {}
    }
    fetchStats();
  }, []);

  return (
    <AdminGuard>
      <DashboardSidebar>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-cream">Admin Dashboard</h1>
            <p className="text-cream/50 text-sm mt-1">Manage your restaurant operations</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: "Total Orders", value: stats.totalOrders, icon: HiClipboardList },
              { label: "Pending", value: stats.pendingOrders, icon: HiClipboardList, accent: "text-yellow-400" },
              { label: "Menu Items", value: stats.totalMenuItems, icon: HiCube },
              { label: "Categories", value: stats.totalCategories, icon: HiCollection },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="p-5 rounded-xl bg-dark-card border border-primary/10">
                <stat.icon className={`w-6 h-6 ${stat.accent || "text-primary"} mb-2`} />
                <div className="text-2xl font-bold text-cream">{stat.value}</div>
                <div className="text-xs text-cream/40 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/menu">
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <HiCube className="w-8 h-8 text-primary mb-3" />
                <h2 className="text-lg font-semibold text-cream mb-1">Menu Management</h2>
                <p className="text-cream/50 text-sm mb-3">Add, edit, or remove menu items and categories</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm group-hover:gap-3 transition-all">
                  Manage Menu <HiArrowRight />
                </span>
              </motion.div>
            </Link>
            <Link href="/admin/orders">
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 group"
              >
                <HiClipboardList className="w-8 h-8 text-secondary-light mb-3" />
                <h2 className="text-lg font-semibold text-cream mb-1">Order Management</h2>
                <p className="text-cream/50 text-sm mb-3">View, update, and process customer orders</p>
                <span className="inline-flex items-center gap-2 text-secondary-light text-sm group-hover:gap-3 transition-all">
                  View Orders <HiArrowRight />
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </DashboardSidebar>
    </AdminGuard>
  );
}
