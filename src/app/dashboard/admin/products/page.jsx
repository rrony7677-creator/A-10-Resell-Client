"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllProductsAdmin } from "@/lib/actions/admin";
import { updateProduct, deleteProduct } from "@/lib/actions/products";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

const statusBadge = (status) => {
  const map = {
    pending_review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    available: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return map[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
};

export default function ManageProductsAdminPage() {
  const { session, isPending } = useRequireRole("admin");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await updateProduct(id, { status });
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
      toast.success(`Product ${status === "available" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    setBusyId(id);
    try {
      const res = await deleteProduct(id);
      if (res?.deletedCount > 0) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  if (isPending) return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Products</h1>
          <p className="text-zinc-400 text-sm mt-1">Review and moderate all listings.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading products...</div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-zinc-900">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.imageUrls?.[0] || "/placeholder-product.png"} alt={p.title} className="w-10 h-10 rounded-md object-cover bg-zinc-800" />
                      <span className="font-medium">{p.title}</span>
                    </td>
                    <td className="p-4 text-zinc-400">{p.sellerName || p.sellerId}</td>
                    <td className="p-4">${p.price}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${statusBadge(p.status)}`}>
                        {p.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === "pending_review" && (
                          <>
                            <button onClick={() => handleStatusChange(p._id, "available")} disabled={busyId === p._id} className="px-3 py-1.5 rounded-md bg-green-600/10 text-green-400 border border-green-600/20 hover:bg-green-600/20 text-xs font-medium disabled:opacity-50">Approve</button>
                            <button onClick={() => handleStatusChange(p._id, "rejected")} disabled={busyId === p._id} className="px-3 py-1.5 rounded-md bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 text-xs font-medium disabled:opacity-50">Reject</button>
                          </>
                        )}
                        <button onClick={() => handleDelete(p._id)} disabled={busyId === p._id} className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-medium disabled:opacity-50">Delete</button>
                      </div>
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