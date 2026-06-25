import React from "react";

const STATS = [
  { value: "12,400+", label: "Items given a second life", emoji: "♻️" },
  { value: "8.2 Tons", label: "Estimated waste avoided", emoji: "🌍" },
  { value: "3,100+", label: "Sellers earning from unused items", emoji: "💰" },
];

export default function SustainabilityImpact() {
  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Every Resale Counts</h2>
        <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto">
          Buying second-hand keeps usable items out of landfills and reduces the demand for new
          manufacturing — small choices, real impact.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#121214] border border-zinc-900 rounded-xl p-6">
              <span className="text-3xl">{s.emoji}</span>
              <p className="text-2xl font-semibold text-green-400 mt-3">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}