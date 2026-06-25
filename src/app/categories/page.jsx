"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicProducts } from "@/lib/actions/products";

const CATEGORIES = [
  { id: "electronics", label: "Electronics", emoji: "💻" },
  { id: "furniture", label: "Furniture", emoji: "🛋️" },
  { id: "fashion", label: "Fashion & Apparel", emoji: "👕" },
  { id: "vehicles", label: "Vehicles", emoji: "🚗" },
];

export default function CategoriesPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map((c) => getPublicProducts({ category: c.id, limit: 1 }))
        );
        const map = {};
        CATEGORIES.forEach((c, i) => (map[c.id] = results[i]?.totalCount || 0));
        setCounts(map);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-10">
          <h1 className="text-2xl font-semibold tracking-tight">Browse by Category</h1>
          <p className="text-zinc-400 text-sm mt-1">Find exactly what you're looking for.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="bg-[#121214] border border-zinc-900 hover:border-zinc-700 rounded-xl p-6 flex flex-col items-center text-center gap-3 transition-colors"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <h3 className="font-medium">{cat.label}</h3>
              <p className="text-zinc-500 text-xs">{loading ? "..." : `${counts[cat.id] ?? 0} items`}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}