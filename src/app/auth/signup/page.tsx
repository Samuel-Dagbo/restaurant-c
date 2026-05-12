"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/auth/signin");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-dark-bg to-primary/5" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">Savory</Link>
          <h1 className="text-2xl font-bold text-cream mt-6">Create Account</h1>
          <p className="text-cream/50 text-sm mt-2">Join us for an exceptional dining experience</p>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-primary/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/30" />
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/30" />
                <input type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/30" />
                <input type="password" required value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Min. 8 characters"
                  minLength={8}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/30" />
                <input type="password" required value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Repeat password"
                />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-cream/40 mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:text-primary-light transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
