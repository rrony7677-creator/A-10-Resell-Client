import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white">
      <section className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Buy smarter. Sell easier.</h1>
        <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed">
          ResellHub is a community marketplace where people give their unused belongings a second
          life — helping buyers save money and sellers earn from things they no longer need.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pb-16">
        {[
          { title: "Our Mission", text: "Make second-hand shopping safe, simple, and trustworthy for everyone." },
          { title: "Why It Matters", text: "Every reused item is one less item in a landfill — small choices, real impact." },
          { title: "How We Help", text: "Verified listings, secure payments, and direct seller-buyer communication." },
        ].map((item) => (
          <div key={item.title} className="bg-[#121214] border border-zinc-900 rounded-xl p-6">
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-zinc-900 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Items Resold", value: "12K+" },
            { label: "Active Sellers", value: "3.4K+" },
            { label: "Happy Buyers", value: "9K+" },
            { label: "Cities Covered", value: "20+" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold text-blue-400">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-16 px-4">
        <h2 className="text-xl font-medium mb-3">Ready to get started?</h2>
        <Link href="/signUp" className="inline-block bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-11 leading-[44px] text-sm font-semibold">
          Join ResellHub
        </Link>
      </section>
    </div>
  );
}