"use server";

const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const getSellerOrders = async (sellerId, status) => {
  const params = new URLSearchParams();
  if (sellerId) params.append("sellerId", sellerId);
  if (status) params.append("status", status);

  const res = await fetch(`${baseUrl}/api/orders?${params.toString()}`, {
    cache: "no-store",
  });
  return res.json();
};

export const getOrderById = async (id) => {
  const res = await fetch(`${baseUrl}/api/orders/${id}`, {
    cache: "no-store",
  });
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${baseUrl}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};