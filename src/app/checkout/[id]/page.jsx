"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getProductById } from "@/lib/actions/products";
import { createCheckoutSession } from "@/lib/actions/payments";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session, isPending } = useRequireRole(); // role না দিলে শুধু login চেক হবে

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleProceedToPayment = async () => {
    if (!session || !product) return;
    setProcessing(true);
    try {
      const { url } = await createCheckoutSession({
        product,
        buyer: { id: session.user.id, name: session.user.name, email: session.user.email },
        quantity: 1,
      });
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to start payment");
        setProcessing(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setProcessing(false);
    }
  };

  if (isPending || loading) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-[#121214] border border-zinc-900 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Checkout</h1>

        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6 mb-6">
          <img
            src={product.imageUrls?.[0] || "/placeholder-product.png"}
            alt={product.title}
            className="w-20 h-20 rounded-lg object-cover bg-zinc-900"
          />
          <div className="flex-1">
            <h2 className="font-medium">{product.title}</h2>
            <p className="text-zinc-500 text-sm capitalize">{product.category} · {product.condition}</p>
          </div>
          <p className="font-semibold text-blue-400">${product.price}</p>
        </div>

        <div className="space-y-2 text-sm border-b border-zinc-800 pb-6 mb-6">
          <div className="flex justify-between text-zinc-400"><span>Quantity</span><span>1</span></div>
          <div className="flex justify-between text-zinc-400">
            <span>Delivery Info</span>
            <span className="text-zinc-300">{session?.user?.name}, {session?.user?.email}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2">
            <span>Total</span>
            <span className="text-blue-400">${product.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/products/${id}`)}
            className="flex-1 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg h-11 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToPayment}
            disabled={processing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg h-11 font-semibold transition-colors"
          >
            {processing ? "Redirecting..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}