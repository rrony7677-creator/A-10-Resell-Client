"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getBuyerPayments } from "@/lib/actions/payments";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function PaymentHistoryPage() {
  const { session, isPending } = useRequireRole("buyer");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const data = await getBuyerPayments(session.user.id);
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchPayments();
  }, [session]);

  if (isPending) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Payment History</h1>
          <p className="text-zinc-400 text-sm mt-1">All your past transactions.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 rounded-xl bg-[#121214]">
            <p className="text-zinc-400">No transactions yet.</p>
          </div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t border-zinc-900">
                    <td className="p-4 text-zinc-400 font-mono text-xs">{p.transactionId}</td>
                    <td className="p-4 text-blue-400 font-medium">${p.amount}</td>
                    <td className="p-4 capitalize">
                      <span className="text-xs px-2 py-1 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">
                      {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
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