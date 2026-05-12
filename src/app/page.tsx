"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight, HiChevronDown, HiStar } from "react-icons/hi";

const heroTitle = "Where Every Flavor";
const heroHighlight = "Tells a Story";
const heroSubtitle = "Experience culinary excellence crafted with passion and the finest ingredients from around the world.";
const heroImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80";

const features = [
  { icon: "🌟", title: "Michelin Starred", desc: "Award-winning culinary excellence recognized globally" },
  { icon: "🌿", title: "Farm to Table", desc: "Fresh, organic ingredients sourced from local farms daily" },
  { icon: "🍷", title: "Premium Pairings", desc: "Expertly curated wine selection from finest vineyards" },
  { icon: "👨‍🍳", title: "Master Chefs", desc: "World-class chefs with decades of gastronomic expertise" },
];

const popularDishes = [
  { name: "Wagyu Beef Tartare", price: "$42", tag: "Signature", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80" },
  { name: "Lobster Thermidor", price: "$68", tag: "Premium", image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&q=80" },
  { name: "Truffle Risotto", price: "$36", tag: "Chef's Special", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80" },
];

const testimonials = [
  { name: "Sarah M.", role: "Food Critic", text: "An extraordinary culinary journey. Every dish was a masterpiece of flavor and presentation.", rating: 5 },
  { name: "James R.", role: "Regular Guest", text: "The ambiance, the service, the food - everything is perfection. My favorite restaurant in the city.", rating: 5 },
  { name: "Elena K.", role: "Wine Enthusiast", text: "Incredible wine pairing suggestions. The sommelier truly understands the art of complementing flavors.", rating: 5 },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "50+", label: "Awards Won" },
  { value: "200+", label: "Premium Dishes" },
  { value: "50K+", label: "Happy Guests" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  return (
    <div className="bg-dark-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/85 via-dark-bg/50 to-dark-bg/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 via-dark-bg/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full border border-primary/40 text-primary text-xs uppercase tracking-[0.3em] backdrop-blur-sm bg-dark-bg/30">
              Est. 2010
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-cream mb-4 leading-tight drop-shadow-lg">
              {heroTitle}{" "}
              <span className="text-primary">{heroHighlight}</span>
            </h1>
            <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
              {heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Explore Our Menu
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cream/30 text-cream/90 hover:bg-cream/10 hover:border-cream/50 transition-all duration-300 backdrop-blur-sm"
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <HiChevronDown className="w-6 h-6 text-primary/70 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-primary/10 bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-cream/40 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1920&q=80')] bg-cover bg-fixed bg-center opacity-5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Why Choose Us</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-cream mt-4">The Art of Fine Dining</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group p-8 rounded-2xl bg-dark-card/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-dark-card transition-all duration-500"
              >
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-lg font-semibold text-cream mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-cream/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-24 bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Must Try</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-cream mt-4">Popular Dishes</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {popularDishes.map((dish) => (
              <motion.div
                key={dish.name}
                variants={fadeUp}
                className="group relative rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500 h-96"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-primary/90 text-dark-bg text-xs font-semibold rounded-full backdrop-blur-sm">
                    {dish.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-cream drop-shadow">{dish.name}</h3>
                    <span className="text-lg font-bold text-primary drop-shadow">{dish.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary/30 text-cream/80 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              View Full Menu <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80')] bg-cover bg-fixed bg-center opacity-5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-cream mt-4">What Our Guests Say</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="p-8 rounded-2xl bg-dark-card/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 text-primary" />
                  ))}
                </div>
                <p className="text-cream/60 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-cream/60 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-cream font-medium text-sm">{t.name}</p>
                    <p className="text-cream/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 via-dark-bg/80 to-dark-bg/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-cream mb-6 drop-shadow-lg">
              Ready for an <span className="text-primary">Unforgettable</span> Meal?
            </h2>
            <p className="text-lg text-cream/80 mb-10 max-w-2xl mx-auto drop-shadow">
              Reserve your table now and embark on a culinary journey that will delight every sense.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-4 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Reserve a Table
              </Link>
              <Link
                href="/menu"
                className="px-10 py-4 rounded-full border border-cream/30 text-cream/90 hover:bg-cream/10 transition-all backdrop-blur-sm"
              >
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
