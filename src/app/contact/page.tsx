"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiLocationMarker, HiPhone, HiMail, HiClock } from "react-icons/hi";
import toast from "react-hot-toast";

const contactInfo = [
  { icon: HiLocationMarker, title: "Address", text: "123 Gourmet Street\nNew York, NY 10001" },
  { icon: HiPhone, title: "Phone", text: "+1 (555) 123-4567" },
  { icon: HiMail, title: "Email", text: "hello@savoryrestaurant.com" },
  { icon: HiClock, title: "Hours", text: "Mon - Sun: 11 AM - 11 PM" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="bg-dark-bg pt-20">
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 via-dark-bg/85 to-dark-bg/70" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Get in Touch</span>
            <h1 className="text-4xl sm:text-6xl font-bold text-cream mt-4 mb-6">
              We'd Love to <span className="text-primary">Hear</span> From You
            </h1>
            <p className="text-lg text-cream/50 max-w-2xl mx-auto">
              Whether it's a reservation inquiry, a special event, or just to say hello — we're here for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {contactInfo.map((info) => (
                <motion.div
                  key={info.title}
                  variants={fadeUp}
                  className="flex items-start gap-4 p-6 rounded-xl bg-dark-card border border-primary/10"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-cream uppercase tracking-wider mb-1">{info.title}</h3>
                    <p className="text-cream/50 text-sm whitespace-pre-line">{info.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-dark-card border border-primary/10 space-y-6">
                <div>
                  <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Email</label>
                    <input type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Phone</label>
                    <input type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-cream/60 mb-2 uppercase tracking-wider">Message</label>
                  <textarea required rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-primary/20 text-cream placeholder-cream/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="h-80 relative overflow-hidden border-t border-primary/10 flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1470330625660-b59fc982e9ef?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-bg/70" />
        <div className="relative z-10 text-center">
          <HiLocationMarker className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-cream/60 text-lg font-medium">123 Gourmet Street, New York, NY 10001</p>
          <p className="text-cream/40 text-sm mt-2">Find us on the map</p>
        </div>
      </section>
    </div>
  );
}
