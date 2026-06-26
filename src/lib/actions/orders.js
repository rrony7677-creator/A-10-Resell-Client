"use server";

import { getServerJwt } from "../utils/getServerJwt";

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
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const createOrder = async (orderData) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getBuyerOrders = async (buyerId) => {
  const res = await fetch(`${baseUrl}/api/orders?buyerId=${buyerId}`, { cache: "no-store" });
  return res.json();
};

