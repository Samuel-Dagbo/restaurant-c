"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";

interface OrderItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  specialInstructions?: string;
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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

  return (
    <AuthGuard>
      <div className="bg-dark-bg min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg border border-primary/20 text-cream/50 hover:text-primary hover:border-primary transition-all"
            >
              <HiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-cream">My Orders</h1>
              <p className="text-cream/50 text-sm">View all your order history</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-dark-card rounded-2xl border border-primary/10">
              <p className="text-cream/40 text-lg">No orders yet</p>
              <Link
                href="/menu"
                className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-dark-bg text-sm font-medium hover:bg-primary-light transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-dark-card border border-primary/10"
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
                    <div>
                      <span className="text-xs text-cream/40 uppercase tracking-wider">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <p className="text-xs text-cream/30 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} />
                      <PaymentBadge status={order.paymentStatus} />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-cream/60">
                          <span className="text-cream/40 mr-2">{item.quantity}x</span>
                          {item.name}
                          {item.note && <span className="text-cream/30 ml-2">({item.note})</span>}
                        </span>
                        <span className="text-cream font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="text-xs text-cream/30 italic mb-4">
                      Note: {order.specialInstructions}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <span className="text-xs text-cream/40">
                      Paid via {order.paymentMethod}
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
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
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${colors[status] || "bg-cream/10 text-cream/40"}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400/60",
    paid: "bg-green-500/10 text-green-400/60",
    refunded: "bg-red-500/10 text-red-400/60",
  };
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full mt-1 ${colors[status] || "bg-cream/10 text-cream/40"}`}>
      {status}
    </span>
  );
}
