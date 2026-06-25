"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllOrdersAdmin } from "@/lib/actions/admin";
import { updateOrderStatus } from "@/lib/actions/orders";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

const statusBadge = (status) => {
  const map = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return map[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
};

export default function ManageOrdersAdminPage() {
  const { session, isPending } = useRequireRole("admin");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrdersAdmin();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchOrders();
  }, [session]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setBusyId(null);
    }
  };

  if (isPending) return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">Monitor all orders across the platform.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]"><p className="text-zinc-400">No orders yet.</p></div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Buyer</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Override Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-zinc-900">
                    <td className="p-4">{o.productTitle}</td>
                    <td className="p-4 text-zinc-400">{o.buyerInfo?.name}</td>
                    <td className="p-4 text-zinc-400">{o.sellerId}</td>
                    <td className="p-4">${o.price}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${statusBadge(o.orderStatus)}`}>{o.orderStatus}</span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={o.orderStatus}
                        disabled={busyId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2 py-1.5 outline-none"
                      >
                        {["pending", "accepted", "processing", "shipped", "delivered", "rejected", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}