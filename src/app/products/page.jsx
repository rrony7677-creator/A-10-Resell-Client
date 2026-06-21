"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getPublicProducts } from "@/lib/actions/products";
import { Button } from "@heroui/react";

const CATEGORIES = ["electronics", "furniture", "fashion", "vehicles"];
const CONDITIONS = ["used", "like-new", "refurbished"];
const LIMIT = 8;

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getPublicProducts({
        search,
        category,
        condition,
        sort,
        page,
        limit: LIMIT,
      });
      setProducts(data?.products || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, condition, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Browse Products
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Find great second-hand deals from trusted sellers.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 bg-[#1c1c1e] border border-zinc-800 rounded-lg h-11 px-3 text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600"
          />

          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="bg-[#1c1c1e] border border-zinc-800 rounded-lg h-11 px-3 text-sm outline-none focus:border-zinc-600"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={condition}
            onChange={(e) => {
              setPage(1);
              setCondition(e.target.value);
            }}
            className="bg-[#1c1c1e] border border-zinc-800 rounded-lg h-11 px-3 text-sm outline-none focus:border-zinc-600"
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="bg-[#1c1c1e] border border-zinc-800 rounded-lg h-11 px-3 text-sm outline-none focus:border-zinc-600 md:col-span-2"
          >
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg h-11 px-4 text-sm font-medium md:col-span-2"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]">
            <p className="text-zinc-400">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col"
                >
                  <div className="aspect-square bg-zinc-900">
                    <img
                      src={product.imageUrls?.[0] || "/placeholder-product.png"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <span className="text-[10px] w-fit px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 capitalize">
                      {product.condition}
                    </span>
                    <h3 className="font-medium text-sm mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-zinc-500 text-xs capitalize">
                      {product.category}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-blue-400 font-semibold">
                        ${product.price}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                  </div>
                  <Link href={`/products/${product._id}`}>
                    <Button className="w-full p-6 rounded">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-zinc-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
