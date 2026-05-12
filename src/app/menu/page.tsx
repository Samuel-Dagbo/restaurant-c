"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MenuCard from "@/components/MenuCard";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: { _id: string; name: string; slug: string };
  featured?: boolean;
  spicyLevel?: number;
  preparationTime?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch("/api/menu?type=categories"),
          fetch("/api/menu"),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category?.slug === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-dark-bg pt-20 min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 via-dark-bg/85 to-dark-bg/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Our Menu</span>
            <h1 className="text-4xl sm:text-6xl font-bold text-cream mt-4 mb-6">
              Culinary <span className="text-primary">Masterpieces</span>
            </h1>
            <p className="text-cream/50 max-w-2xl mx-auto">
              Explore our carefully curated menu, where each dish is a celebration of flavor and artistry.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="relative flex-1 w-full max-w-md">
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full px-5 py-3 rounded-full bg-dark-card border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-2 sm:pb-0">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-primary text-dark-bg font-semibold"
                    : "bg-dark-card border border-primary/20 text-cream/60 hover:border-primary/40"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat.slug
                      ? "bg-primary text-dark-bg font-semibold"
                      : "bg-dark-card border border-primary/20 text-cream/60 hover:border-primary/40"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cream/40 text-lg">No items found</p>
              <p className="text-cream/30 text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, i) => (
                <MenuCard key={item._id} item={item} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
