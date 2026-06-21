"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Pencil, TrashBin, Plus } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSellerProducts, deleteProduct } from "@/lib/actions/products";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function MyProductsPage() {
  // const [mockSeller] = useState({ id: "seller_9912" });

  const {session,isPending} = useRequireRole("seller")
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const fetchProducts = async () => {
    if(!session) return;
    setLoading(true);
    try {
      const data = await getSellerProducts(session?.user.id);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(session)
    fetchProducts();
  }, [session]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await deleteProduct(id);
      if (res?.deletedCount > 0) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/seller/my-product/edit/${id}`);
  };

  const statusBadge = (status) => {
    const map = {
      pending_review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      available: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  };

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              My Products
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage all the products you've listed on ReSell Hub.
            </p>
          </div>
          <Button
            onPress={() => router.push("/dashboard/seller/add-product")}
            className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg px-5 h-11 flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]">
            <p className="text-zinc-400">
              You haven't listed any products yet.
            </p>
          </div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-zinc-900">
                    <td className="p-4 flex items-center gap-3">
                      {/* <img
                        src={product.imageUrls?.[0] || "/placeholder-product.png"}
                        alt={product.title}
                        className="w-10 h-10 rounded-md object-cover bg-zinc-800"
                      /> */}
                      <span className="font-medium">{product.title}</span>
                    </td>
                    <td className="p-4 text-zinc-400 capitalize">
                      {product.category}
                    </td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.stockQuantity}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border capitalize ${statusBadge(
                          product.status,
                        )}`}
                      >
                        {product.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="p-2 rounded-md hover:bg-zinc-800 text-zinc-300"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 rounded-md hover:bg-red-950/40 text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <TrashBin size={16} />
                        </button>
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
