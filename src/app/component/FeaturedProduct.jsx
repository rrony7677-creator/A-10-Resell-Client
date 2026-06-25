"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturedProductsSection({ products }) {
  if (!products?.length) return null;

  return (
    <section className="bg-[#0d0d0e] py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-zinc-400 text-sm mt-1">Freshly listed, just for you.</p>
          </div>
          <Link href="/products" className="text-sm text-blue-400 hover:underline">View all →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 8).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/products/${product._id}`}
                className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col h-full"
              >
                <div className="aspect-square bg-zinc-900">
                  <img src={product.imageUrls?.[0] || "/placeholder-product.png"} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col gap-1 flex-1">
                  <span className="text-[10px] w-fit px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 capitalize">
                    {product.condition}
                  </span>
                  <h3 className="font-medium text-sm mt-1 line-clamp-1">{product.title}</h3>
                  <span className="text-blue-400 font-semibold mt-auto pt-2">${product.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}