"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { motion } from "framer-motion";
import { HiClipboardList, HiUser, HiArrowRight, HiShoppingCart } from "react-icons/hi";

interface OrderSummary {
  _id: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
  createdAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const user = session?.user as { name?: string; email?: string } | undefined;
  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const pastOrders = orders.filter((o) => ["delivered", "cancelled"].includes(o.status));

  return (
    <AuthGuard>
      <DashboardSidebar>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <HiUser className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-cream">Welcome back, {user?.name?.split(" ")[0] || "Guest"}</h1>
                <p className="text-cream/50 text-sm">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Active Orders", value: activeOrders.length, icon: HiClipboardList, color: "text-yellow-400" },
              { label: "Past Orders", value: pastOrders.length, icon: HiClipboardList, color: "text-cream/60" },
              { label: "Total", value: orders.length, icon: HiShoppingCart, color: "text-primary" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-5 rounded-xl bg-dark-card border border-primary/10"
              >
                <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                <div className="text-2xl font-bold text-cream">{s.value}</div>
                <div className="text-xs text-cream/40 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Active Orders
              </h2>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-5 rounded-xl bg-dark-card border border-primary/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-cream/40 uppercase tracking-wider">
                        Order #{order._id.slice(-6)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-cream/60">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </p>
                        <p className="text-xs text-cream/40 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cream">Order History</h2>
              <Link href="/dashboard/orders" className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                View All <HiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pastOrders.length === 0 && activeOrders.length === 0 ? (
              <div className="text-center py-16 bg-dark-card rounded-xl border border-primary/10">
                <HiClipboardList className="w-16 h-16 text-cream/10 mx-auto mb-4" />
                <p className="text-cream/40">No orders yet</p>
                <p className="text-cream/30 text-sm mt-1">Start by exploring our menu</p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-primary text-dark-bg text-sm font-medium hover:bg-primary-light transition-all"
                >
                  Browse Menu <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {pastOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-4 rounded-xl bg-dark-card border border-primary/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-cream/40">#{order._id.slice(-6)} — {new Date(order.createdAt).toLocaleDateString()}</span>
                      <p className="text-sm text-cream/60 mt-1">
                        {order.items.map((i) => i.name).slice(0, 3).join(", ")}
                        {order.items.length > 3 && "..."}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-sm font-bold text-primary block">${order.total.toFixed(2)}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardSidebar>
    </AuthGuard>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    preparing: "bg-purple-500/20 text-purple-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-cream/10 text-cream/40",
    cancelled: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${colors[status] || "bg-cream/10 text-cream/40"}`}>
      {status}
    </span>
  );
}
