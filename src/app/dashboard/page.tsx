"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { HiClipboardList, HiUser, HiArrowRight } from "react-icons/hi";

interface OrderSummary {
  _id: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
  createdAt: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

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
      <div className="bg-dark-bg min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <HiUser className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cream">Welcome, {user?.name?.split(" ")[0] || "Guest"}</h1>
                <p className="text-cream/50 text-sm">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeOrders.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-lg font-semibold text-cream mb-4">Active Orders</h2>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <motion.div
                        key={order._id}
                        variants={fadeUp}
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
                              {order.items.map((i) => i.name).join(", ")}
                            </p>
                            <p className="text-xs text-cream/40 mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-cream">Order History</h2>
                  <Link
                    href="/dashboard/orders"
                    className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1"
                  >
                    View All <HiArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : pastOrders.length === 0 && activeOrders.length === 0 ? (
                  <div className="text-center py-12 bg-dark-card rounded-xl border border-primary/10">
                    <HiClipboardList className="w-12 h-12 text-cream/20 mx-auto mb-3" />
                    <p className="text-cream/40">No orders yet</p>
                    <Link
                      href="/menu"
                      className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-dark-bg text-sm font-medium hover:bg-primary-light transition-all"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastOrders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="p-4 rounded-xl bg-dark-card border border-primary/10 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs text-cream/40">
                            #{order._id.slice(-6)} — {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <p className="text-sm text-cream/60 mt-1">
                            {order.items.map((i) => i.name).slice(0, 3).join(", ")}
                            {order.items.length > 3 && "..."}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-dark-card border border-primary/10"
              >
                <h3 className="text-sm font-semibold text-cream uppercase tracking-wider mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link
                    href="/menu"
                    className="block w-full py-2.5 px-4 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-all text-center"
                  >
                    Browse Menu
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block w-full py-2.5 px-4 rounded-lg border border-primary/20 text-cream/60 text-sm hover:border-primary/40 transition-all text-center"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full py-2.5 px-4 rounded-lg border border-primary/20 text-cream/60 text-sm hover:border-primary/40 transition-all text-center"
                  >
                    Contact Support
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
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
    <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${colors[status] || "bg-cream/10 text-cream/40"}`}>
      {status}
    </span>
  );
}
