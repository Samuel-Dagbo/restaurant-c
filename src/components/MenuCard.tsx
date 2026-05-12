"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { HiShoppingCart } from "react-icons/hi";

interface MenuCardProps {
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: { name: string; slug: string };
    featured?: boolean;
    spicyLevel?: number;
    preparationTime?: number;
  };
  index?: number;
}

export default function MenuCard({ item, index = 0 }: MenuCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-dark-card rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-6xl opacity-50">🍽</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
        {item.featured && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-dark-bg text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
        {item.spicyLevel && item.spicyLevel > 0 && (
          <span className="absolute top-3 right-3 flex gap-0.5">
            {Array.from({ length: item.spicyLevel }).map((_, i) => (
              <span key={i} className="text-red-500 text-sm">🌶</span>
            ))}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-semibold text-cream group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-primary">GH₵{item.price.toFixed(2)}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="block text-xs text-cream/40 line-through">
                GH₵{item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <p className="text-cream/50 text-sm leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          {item.preparationTime && (
            <span className="text-xs text-cream/40">
              ~{item.preparationTime} min
            </span>
          )}
          {item.category && (
            <span className="text-xs text-cream/40 bg-primary/10 px-2 py-1 rounded-full">
              {item.category.name}
            </span>
          )}
          <button
            onClick={() => addItem({ _id: item._id, name: item.name, price: item.price, image: item.image || "" })}
            className="p-2.5 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-dark-bg transition-all duration-300 ml-auto"
          >
            <HiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
