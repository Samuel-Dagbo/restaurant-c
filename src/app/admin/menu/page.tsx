"use client";

import { useState, useEffect } from "react";
import AdminGuard from "@/components/AdminGuard";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX } from "react-icons/hi";
import toast from "react-hot-toast";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: { _id: string; name: string };
  featured: boolean;
  isAvailable: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", image: "", featured: false, isAvailable: true,
  });
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [showCatForm, setShowCatForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/menu?type=categories"),
      ]);
      if (menuRes.ok) setItems(await menuRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch {} finally { setLoading(false); }
  }

  function resetForm() {
    setForm({ name: "", description: "", price: "", category: "", image: "", featured: false, isAvailable: true });
    setEditing(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        image: form.image || undefined,
        featured: form.featured,
        isAvailable: form.isAvailable,
      };
      const res = editing
        ? await fetch(`/api/menu/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editing ? "Item updated" : "Item created");
        resetForm(); setShowForm(false); fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
      }
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Item deleted"); fetchData(); }
      else toast.error("Failed to delete");
    } catch { toast.error("Failed to delete"); }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...catForm, type: "category", isActive: true, order: categories.length, description: "" }),
      });
      if (res.ok) { toast.success("Category created"); setCatForm({ name: "", slug: "" }); setShowCatForm(false); fetchData(); }
      else toast.error("Failed to create category");
    } catch { toast.error("Failed to create category"); }
  }

  return (
    <AdminGuard>
      <div className="bg-dark-bg min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-cream">Menu Management</h1>
              <p className="text-cream/50 text-sm mt-1">{items.length} items across {categories.length} categories</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCatForm(true)}
                className="px-4 py-2.5 rounded-full border border-primary/20 text-cream/60 hover:border-primary/40 transition-all text-sm"
              >
                + Category
              </button>
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="px-5 py-2.5 rounded-full bg-primary text-dark-bg font-medium hover:bg-primary-light transition-all text-sm flex items-center gap-2"
              >
                <HiPlus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-dark-card border border-primary/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-cream font-medium truncate">{item.name}</h3>
                      <p className="text-xs text-cream/40 mt-0.5">{item.category?.name}</p>
                    </div>
                    <span className="text-primary font-bold shrink-0 ml-4">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-cream/40 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center gap-2">
                    {item.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">Featured</span>}
                    {!item.isAvailable && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Unavailable</span>}
                    <div className="ml-auto flex gap-1">
                      <button onClick={() => { setForm({
                        name: item.name, description: item.description,
                        price: item.price.toString(), category: typeof item.category === 'object' ? item.category._id : item.category,
                        image: item.image || "", featured: item.featured, isAvailable: item.isAvailable,
                      }); setEditing(item); setShowForm(true); }}
                        className="p-1.5 rounded-lg border border-primary/20 text-cream/40 hover:text-primary hover:border-primary transition-all">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-400 transition-all">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {showForm && (
              <>
                <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowForm(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="w-full max-w-lg bg-dark-bg rounded-2xl border border-primary/20 p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-cream">{editing ? "Edit Item" : "Add Item"}</h2>
                      <button onClick={() => { setShowForm(false); resetForm(); }} className="text-cream/40 hover:text-cream">
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs text-cream/60 mb-1">Name</label>
                          <input type="text" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-cream/60 mb-1">Description</label>
                          <textarea required rows={3} value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-cream/60 mb-1">Price ($)</label>
                          <input type="number" step="0.01" required value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-cream/60 mb-1">Category</label>
                          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                          >
                            <option value="">Select...</option>
                            {categories.map((c) => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-cream/60 mb-1">Image URL</label>
                          <input type="url" value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                            placeholder="https://res.cloudinary.com/..."
                          />
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={form.featured}
                              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                              className="rounded border-primary/30 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-cream/60">Featured</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={form.isAvailable}
                              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                              className="rounded border-primary/30 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-cream/60">Available</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" disabled={saving}
                        className="w-full py-3 rounded-full bg-primary text-dark-bg font-medium hover:bg-primary-light transition-all disabled:opacity-50"
                      >
                        {saving ? "Saving..." : editing ? "Update Item" : "Create Item"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              </>
            )}

            {showCatForm && (
              <>
                <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowCatForm(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="w-full max-w-md bg-dark-bg rounded-2xl border border-primary/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-cream">New Category</h2>
                      <button onClick={() => setShowCatForm(false)} className="text-cream/40 hover:text-cream">
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleCreateCategory} className="space-y-4">
                      <div>
                        <label className="block text-xs text-cream/60 mb-1">Name</label>
                        <input type="text" required value={catForm.name}
                          onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                          className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-cream/60 mb-1">Slug</label>
                        <input type="text" required value={catForm.slug}
                          onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-primary/20 text-cream text-sm focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <button type="submit"
                        className="w-full py-3 rounded-full bg-primary text-dark-bg font-medium hover:bg-primary-light transition-all"
                      >
                        Create Category
                      </button>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminGuard>
  );
}
