"use client";
import { motion } from "framer-motion";

const STORIES = [
  { name: "Rakib Kabir", role: "Buyer", quote: "Found a barely-used laptop for half the retail price. Smooth checkout, exactly as described.", initials: "TR" },
  { name: "Imran Kabir", role: "Seller", quote: "Listed my old furniture and sold it within a week. The dashboard made tracking orders effortless.", initials: "IK" },
  { name: "Farzana Akter", role: "Buyer", quote: "Great way to shop sustainably without compromising on quality. Will definitely buy again.", initials: "FA" },
];

export default function SuccessStories() {
  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Success Stories</h2>
          <p className="text-zinc-400 text-sm mt-1">Real experiences from our community.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STORIES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#121214] border border-zinc-900 rounded-xl p-6"
            >
              <p className="text-zinc-300 text-sm leading-relaxed">"{s.quote}"</p>
              <div className="flex items-center gap-3 mt-5">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">{s.initials}</div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-zinc-500 text-xs">{s.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}