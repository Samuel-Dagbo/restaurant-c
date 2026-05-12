"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiLocationMarker, HiPhone, HiMail, HiClock } from "react-icons/hi";

const footerLinks = {
  navigate: [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  support: [
    { href: "#", label: "FAQs" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Careers" },
  ],
};

const contactInfo = [
  { icon: HiLocationMarker, text: "123 Gourmet Street, New York, NY 10001" },
  { icon: HiPhone, text: "+1 (555) 123-4567" },
  { icon: HiMail, text: "hello@savoryrestaurant.com" },
  { icon: HiClock, text: "Mon-Sun: 11 AM - 11 PM" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-primary mb-4">Savory</h3>
            <p className="text-cream/50 text-sm leading-relaxed mb-6">
              Experience the finest culinary delights crafted with passion and
              premium ingredients. Every dish tells a story of excellence.
            </p>
            <div className="flex gap-3">
              {["FB", "IG", "TW", "YT"].map((s) => (
                <span
                  key={s}
                  className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-xs text-cream/50 hover:bg-primary hover:text-dark-bg hover:border-primary transition-all duration-300 cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-cream font-semibold text-sm uppercase tracking-[0.2em] mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigate.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/50 hover:text-primary text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-cream font-semibold text-sm uppercase tracking-[0.2em] mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/50 hover:text-primary text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-cream font-semibold text-sm uppercase tracking-[0.2em] mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-cream/50 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-primary/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Savory Restaurant. All rights reserved.
          </p>
          <p className="text-cream/30 text-xs">
            Crafted with passion for exceptional dining experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
