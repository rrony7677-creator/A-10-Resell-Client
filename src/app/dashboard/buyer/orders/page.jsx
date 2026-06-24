"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getBuyerOrders, updateOrderStatus } from "@/lib/actions/orders";
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

const CANCELLABLE = ["pending", "accepted", "processing"];

export default function MyOrdersPage() {
  const { session, isPending } = useRequireRole("buyer");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await getBuyerOrders(session.user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchOrders();
  }, [session]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;
    setCancellingId(id);
    try {
      const res = await updateOrderStatus(id, "cancelled");
      if (res?.modifiedCount > 0 || res?.acknowledged) {
        toast.success("Order cancelled");
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: "cancelled" } : o)));
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setCancellingId(null);
    }
  };

  if (isPending) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">Track and manage your purchases.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]">
            <p className="text-zinc-400">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Qty</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-zinc-900">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={order.productImage || "/placeholder-product.png"}
                        alt={order.productTitle}
                        className="w-10 h-10 rounded-md object-cover bg-zinc-800"
                      />
                      <span className="font-medium">{order.productTitle}</span>
                    </td>
                    <td className="p-4">${order.price}</td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4 capitalize">{order.paymentStatus}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${statusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {CANCELLABLE.includes(order.orderStatus) ? (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancellingId === order._id}
                          className="px-3 py-1.5 rounded-md bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 text-xs font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-zinc-500 text-xs">No action</span>
                      )}
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