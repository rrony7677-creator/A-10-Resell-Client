"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner({ stats }) {
  const quickStats = [
    { label: "Products Listed", value: stats?.totalProducts ?? 0 },
    { label: "Active Buyers", value: stats?.totalBuyers ?? 0 },
    { label: "Orders Completed", value: stats?.completedOrders ?? 0 },
  ];

  return (
    <section className="relative bg-[#0d0d0e] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent" />
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight"
        >
          Buy & Sell Pre-Owned, <span className="text-blue-400">The Smart Way</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 mt-4 max-w-xl mx-auto text-sm sm:text-base"
        >
          ResellHub connects buyers and sellers for a safer, faster second-hand marketplace experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/products" className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-12 leading-[48px] font-semibold transition-colors">
            Browse Products
          </Link>
          <Link href="/auth/signup" className="border border-zinc-700 hover:bg-zinc-900 rounded-lg px-6 h-12 leading-[48px] font-semibold transition-colors">
            Start Selling
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {quickStats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold text-blue-400">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}