"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PopularCategories({ categories }) {
  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Popular Categories</h2>
          <p className="text-zinc-400 text-sm mt-1">Shop by what you need most.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="bg-[#121214] border border-zinc-900 hover:border-zinc-700 rounded-xl p-6 flex flex-col items-center text-center gap-2 transition-colors h-full"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <h3 className="font-medium text-sm">{cat.label}</h3>
                <p className="text-zinc-500 text-xs">{cat.count} items</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}