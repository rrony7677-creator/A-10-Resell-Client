import React from "react";

const SELLERS = [
  { name: "Nusrat Jahan", rating: 4.9, sales: 152, initials: "NJ" },
  { name: "Rakib Hasan", rating: 4.8, sales: 121, initials: "RH" },
  { name: "Karim Uddin", rating: 4.7, sales: 98, initials: "KU" },
  { name: "Sumi Akter", rating: 4.9, sales: 87, initials: "SA" },
];

export default function TrustedSellersShowcase() {
  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Trusted Sellers</h2>
          <p className="text-zinc-400 text-sm mt-3">Top-rated sellers our buyers love coming back to.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SELLERS.map((seller) => (
            <div key={seller.name} className="bg-[#121214] border border-zinc-900 rounded-xl p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                {seller.initials}
              </div>
              <h3 className="font-medium mt-3">{seller.name}</h3>
              <p className="text-yellow-400 text-sm mt-1">★ {seller.rating}</p>
              <p className="text-zinc-500 text-xs mt-1">{seller.sales} sales</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}