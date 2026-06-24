"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function WishlistPage() {
  const { session, isPending } = useRequireRole("buyer");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await getWishlist(session.user.id);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchWishlist();
  }, [session]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      const res = await removeFromWishlist(session.user.id, productId);
      if (res?.deletedCount > 0) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
        toast.success("Removed from wishlist");
      } else {
        toast.error("Failed to remove");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
          <p className="text-zinc-400 text-sm mt-1">Products you've saved for later.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading wishlist...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]">
            <p className="text-zinc-400">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <div key={item._id} className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden flex flex-col">
                <Link href={`/products/${item.productId}`} className="aspect-square bg-zinc-900 block">
                  <img src={item.image || "/placeholder-product.png"} alt={item.title} className="w-full h-full object-cover" />
                </Link>
                <div className="p-4 flex flex-col gap-1 flex-1">
                  <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-zinc-500 text-xs capitalize">{item.category}</p>
                  <span className="text-blue-400 font-semibold mt-1">${item.price}</span>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="mt-auto pt-3 text-xs text-red-400 hover:text-red-300 disabled:opacity-50 text-left"
                  >
                    Remove from wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}