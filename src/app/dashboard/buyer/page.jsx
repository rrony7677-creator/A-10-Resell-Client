"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBuyerOrders } from "@/lib/actions/orders";
import { getWishlist } from "@/lib/actions/wishlist";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function BuyerDashboardOverview() {
  const { session, isPending } = useRequireRole("buyer");
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const [ordersData, wishlistData] = await Promise.all([
          getBuyerOrders(session.user.id),
          getWishlist(session.user.id),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchData();
  }, [session]);

  if (isPending || loading) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Here's a summary of your activity.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-zinc-500 text-xs">Total Orders</p>
            <p className="text-2xl font-semibold mt-1">{orders.length}</p>
          </div>
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-zinc-500 text-xs">Wishlist Items</p>
            <p className="text-2xl font-semibold mt-1">{wishlistCount}</p>
          </div>
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-zinc-500 text-xs">Pending Orders</p>
            <p className="text-2xl font-semibold mt-1">
              {orders.filter((o) => o.orderStatus === "pending").length}
            </p>
          </div>
        </div>

        <h2 className="font-medium mb-4">Recent Purchases</h2>
        {recentOrders.length === 0 ? (
          <div className="text-zinc-500 text-sm bg-[#121214] border border-zinc-900 rounded-xl p-6">
            No recent purchases.
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center gap-3 bg-[#121214] border border-zinc-900 rounded-xl p-4">
                <img
                  src={order.productImage || "/placeholder-product.png"}
                  alt={order.productTitle}
                  className="w-10 h-10 rounded-md object-cover bg-zinc-800"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{order.productTitle}</p>
                  <p className="text-xs text-zinc-500 capitalize">{order.orderStatus}</p>
                </div>
                <span className="text-blue-400 font-medium text-sm">${order.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* <div className="flex gap-3 mt-8">
          <Link href="/dashboard/buyer/my-orders" className="text-sm text-blue-400 hover:underline">View all orders →</Link>
        </div> */}
      </div>
    </div>
  );
}