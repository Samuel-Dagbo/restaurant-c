"use client";

import { useState, useEffect } from "react";
import AdminGuard from "@/components/AdminGuard";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: { name: string; quantity: number; price: number; note?: string }[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  specialInstructions?: string;
  createdAt: string;
}

const statuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "refunded"];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { toast.success("Status updated"); fetchOrders(); }
      else toast.error("Failed to update");
    } catch { toast.error("Failed to update"); }
  }

  async function updatePayment(orderId: string, paymentStatus: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) { toast.success("Payment status updated"); fetchOrders(); }
      else toast.error("Failed to update");
    } catch { toast.error("Failed to update"); }
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <AdminGuard>
      <div className="bg-dark-bg min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-cream">Order Management</h1>
              <p className="text-cream/50 text-sm mt-1">{orders.length} total orders</p>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["all", ...statuses].map((s) => (
                <button key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                    filterStatus === s
                      ? "bg-primary text-dark-bg font-semibold"
                      : "bg-dark-card border border-primary/20 text-cream/50 hover:border-primary/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cream/40">No orders found</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-dark-card border border-primary/10"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-primary/10">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-cream">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <StatusSelect value={order.status} onChange={(v) => updateStatus(order._id, v)} options={statuses} />
                      </div>
                      <p className="text-xs text-cream/40 mt-1">
                        {order.user?.name || "Unknown"} — {order.user?.email}
                      </p>
                      <p className="text-xs text-cream/30">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">${order.total.toFixed(2)}</div>
                      <PaymentSelect value={order.paymentStatus} onChange={(v) => updatePayment(order._id, v)} options={paymentStatuses} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-cream/60">
                          <span className="text-cream/30 mr-2">{item.quantity}x</span>
                          {item.name}
                          {item.note && <span className="text-cream/30 ml-2">({item.note})</span>}
                        </span>
                        <span className="text-cream">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="text-xs text-cream/30 italic mt-3 pt-3 border-t border-primary/10">
                      Note: {order.specialInstructions}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

function StatusSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const colors: Record<string, string> = {
    pending: "border-yellow-500/30 text-yellow-400",
    confirmed: "border-blue-500/30 text-blue-400",
    preparing: "border-purple-500/30 text-purple-400",
    ready: "border-green-500/30 text-green-400",
    delivered: "border-cream/20 text-cream/40",
    cancelled: "border-red-500/30 text-red-400",
  };
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs px-2.5 py-1 rounded-full border bg-transparent outline-none cursor-pointer ${colors[value] || "border-primary/20 text-cream/60"}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-dark-bg">{opt}</option>
      ))}
    </select>
  );
}

function PaymentSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const colors: Record<string, string> = {
    pending: "text-yellow-400/60",
    paid: "text-green-400/60",
    refunded: "text-red-400/60",
  };
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs mt-1 bg-transparent outline-none cursor-pointer ${colors[value] || "text-cream/40"}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-dark-bg">{opt}</option>
      ))}
    </select>
  );
}
