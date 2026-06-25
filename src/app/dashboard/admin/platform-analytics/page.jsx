"use client";

import React from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

const userGrowthData = [
  { month: "Jan", users: 20 }, { month: "Feb", users: 35 }, { month: "Mar", users: 50 },
  { month: "Apr", users: 80 }, { month: "May", users: 110 }, { month: "Jun", users: 150 },
];
const monthlyOrdersData = [
  { month: "Jan", orders: 5 }, { month: "Feb", orders: 12 }, { month: "Mar", orders: 18 },
  { month: "Apr", orders: 25 }, { month: "May", orders: 30 }, { month: "Jun", orders: 42 },
];
const categoryData = [
  { name: "Electronics", value: 45 }, { name: "Furniture", value: 25 },
  { name: "Fashion", value: 20 }, { name: "Vehicles", value: 10 },
];
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#22c55e"];

export default function PlatformAnalyticsPage() {
  const { isPending } = useRequireRole("admin");
  if (isPending) return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Platform Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Growth, orders, and category insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4 text-zinc-300">User Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1c1c1e", border: "1px solid #27272a" }} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4 text-zinc-300">Monthly Orders</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1c1c1e", border: "1px solid #27272a" }} />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 lg:col-span-2">
            <h2 className="text-sm font-medium mb-4 text-zinc-300">Top Categories</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {categoryData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1c1c1e", border: "1px solid #27272a" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}