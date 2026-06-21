"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPaymentAndCreateOrder } from "@/lib/actions/payments";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }
    const verify = async () => {
      try {
        const res = await verifyPaymentAndCreateOrder(sessionId);
        if (res.success) {
          setOrder(res.order);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      }
    };
    verify();
  }, [sessionId]);

  if (status === "verifying") {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Verifying your payment...</div>;
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">Payment verification failed.</p>
        <button onClick={() => router.push("/products")} className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-11 font-medium">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#121214] border border-zinc-900 rounded-xl p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Payment Successful!</h1>
        <p className="text-zinc-400 text-sm mb-6">Your order has been placed.</p>

        <div className="text-left bg-[#1c1c1e] rounded-lg p-4 text-sm space-y-2 mb-6">
          <div className="flex justify-between"><span className="text-zinc-500">Product</span><span>{order?.productTitle}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Amount Paid</span><span className="text-blue-400 font-medium">${order?.price}</span></div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/products")} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg h-11 text-sm font-medium">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}