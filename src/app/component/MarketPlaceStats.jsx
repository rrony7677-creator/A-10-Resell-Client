"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const end = value || 0;
    const steps = 50;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
}

export default function MarketplaceStats({ stats }) {
  const items = [
    { label: "Total Products", value: stats?.totalProducts ?? 0 },
    { label: "Total Sellers", value: stats?.totalSellers ?? 0 },
    { label: "Total Buyers", value: stats?.totalBuyers ?? 0 },
    { label: "Completed Orders", value: stats?.completedOrders ?? 0 },
  ];

  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Marketplace at a Glance</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="text-3xl font-bold text-blue-400"><Counter value={item.value} /></p>
              <p className="text-zinc-500 text-xs mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}