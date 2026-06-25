"use client";

import React, { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/actions/admin";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function AdminDashboardOverview() {
  const { session, isPending } = useRequireRole("admin");
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchStats();
  }, [session]);

  if (isPending || loading) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Platform overview at a glance.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-purple-400 text-xs">Total Users</p>
            <p className="text-2xl font-semibold mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-purple-400  text-xs">Total Products</p>
            <p className="text-2xl font-semibold mt-1">{stats.totalProducts}</p>
          </div>
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <p className="text-purple-400  text-xs">Total Orders</p>
            <p className="text-2xl font-semibold mt-1">{stats.totalOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}