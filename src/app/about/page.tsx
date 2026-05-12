"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

const timeline = [
  { year: "2010", title: "The Beginning", desc: "Savory Restaurant opened its doors with a vision to redefine fine dining." },
  { year: "2013", title: "First Michelin Star", desc: "Recognized for exceptional cuisine and service excellence." },
  { year: "2017", title: "Expansion", desc: "Opened our second location and launched the chef's table experience." },
  { year: "2020", title: "Innovation", desc: "Embraced farm-to-table movement with our own organic garden." },
  { year: "2024", title: "Global Recognition", desc: "Named among the world's top 50 restaurants." },
];

const team = [
  { name: "Chef Marco Rossi", role: "Executive Chef", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80" },
  { name: "Sofia Chen", role: "Head Pastry Chef", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80" },
  { name: "James Mitchell", role: "Sommelier", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80" },
];

const values = [
  { icon: "🎨", title: "Craftsmanship", desc: "Every dish is a work of art, meticulously prepared with precision and passion." },
  { icon: "🌱", title: "Sustainability", desc: "We source locally and practice sustainable cooking to protect our planet." },
  { icon: "🤝", title: "Hospitality", desc: "Our guests are family. We create unforgettable experiences through genuine care." },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <div className="bg-dark-bg pt-20">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=80"
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/95 via-dark-bg/80 to-dark-bg/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Our Story</span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-cream mt-4 mb-6 drop-shadow-lg">
              Crafting Culinary<span className="text-primary"> Excellence</span>
            </h1>
            <p className="text-lg text-cream/80 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Since 2010, Savory has been dedicated to the art of fine dining. Our journey is
              defined by a relentless pursuit of perfection, from sourcing the finest ingredients
              to creating dishes that delight the senses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story + Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm uppercase tracking-[0.3em]">Our Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-cream mt-4 mb-6">
                Where Passion Meets <span className="text-primary">Perfection</span>
              </h2>
              <p className="text-cream/60 leading-relaxed mb-4">
                At Savory, we believe that dining is more than just eating — it's an experience
                that engages all the senses. Our chefs pour their hearts into every plate,
                combining traditional techniques with innovative flavors.
              </p>
              <p className="text-cream/60 leading-relaxed mb-6">
                From our hand-picked organic produce to our carefully aged wines, every element
                is chosen to create a harmonious symphony of taste, texture, and aroma.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300"
              >
                Explore Our Menu <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                alt="Our kitchen"
                className="rounded-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary/30 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-dark-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-cream">Our Journey</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-primary/20" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {timeline.map((item) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  className="relative pl-20"
                >
                  <div className="absolute left-4 top-1 w-9 h-9 rounded-full bg-dark-bg border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-primary text-sm font-bold">{item.year}</span>
                  <h3 className="text-xl font-semibold text-cream mt-1">{item.title}</h3>
                  <p className="text-cream/50 text-sm mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Our Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream mt-4">What Drives Us</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="p-8 rounded-2xl bg-dark-card border border-primary/10 hover:border-primary/30 transition-all duration-500 text-center"
              >
                <span className="text-5xl block mb-6">{v.icon}</span>
                <h3 className="text-xl font-semibold text-cream mb-3">{v.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em]">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream mt-4">Meet the Masters</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="group text-center"
              >
                <div className="relative w-56 h-56 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-cream">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark-bg/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-cream mb-4">Ready to Experience Savory?</h2>
            <p className="text-cream/60 mb-8">Book your table and discover why we are a destination for food lovers.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-dark-bg font-semibold hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Reserve Now <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
