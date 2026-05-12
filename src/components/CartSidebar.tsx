"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { HiX, HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to place an order");
      router.push("/auth/signin");
      return;
    }
    setIsCheckingOut(true);
    try {
      await createOrder({
        items: items.map((i) => ({
          menuItem: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          note: i.note,
        })),
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        paymentMethod: "cash",
      });
      toast.success("Order placed successfully!");
      clearCart();
      setIsOpen(false);
      router.push("/dashboard/orders");
    } catch {
      toast.error("Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-dark-bg shadow-lg shadow-primary/30 hover:bg-primary-light transition-all flex items-center justify-center"
      >
        <span className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-dark-bg border-l border-primary/20 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                <h2 className="text-lg font-semibold text-cream">
                  Your Cart ({itemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-cream/50 hover:text-cream transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-cream/40">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 rounded-lg bg-dark-card border border-primary/10"
                    >
                      <div className="w-16 h-16 rounded-lg bg-cream/10 flex items-center justify-center overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary text-2xl">🍽</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-cream truncate">{item.name}</h4>
                        <p className="text-primary text-sm font-medium mt-1">
                          GH₵{item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 rounded border border-primary/20 text-cream/60 hover:text-primary hover:border-primary transition-colors"
                          >
                            <HiMinus className="w-3 h-3" />
                          </button>
                          <span className="text-cream text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 rounded border border-primary/20 text-cream/60 hover:text-primary hover:border-primary transition-colors"
                          >
                            <HiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-cream/30 hover:text-red-400 transition-colors self-start"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-primary/10 p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-cream/60">
                      <span>Subtotal</span>
                      <span>GH₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-cream/60">
                      <span>Tax (8%)</span>
                      <span>GH₵{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-cream pt-2 border-t border-primary/10">
                      <span>Total</span>
                      <span className="text-primary">GH₵{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3 rounded-full bg-primary text-dark-bg font-medium hover:bg-primary-light transition-all duration-300 disabled:opacity-50"
                  >
                    {isCheckingOut ? "Processing..." : "Place Order"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
