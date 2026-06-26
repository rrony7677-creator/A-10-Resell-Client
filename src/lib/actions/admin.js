"use server";

import { getServerJwt } from "../utils/getServerJwt";

const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const getAdminStats = async () => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/admin/stats`, {
    cache: "no-store",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return res.json();
};

export const getAllUsers = async () => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/admin/users`, {
    cache: "no-store",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return res.json();
};

export const updateUserStatus = async (id, status) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/admin/users/${id}`, { method: "DELETE",
     headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
   });
  return res.json();
};

export const getAllProductsAdmin = async (status = "") => {
  const params = new URLSearchParams();
  params.append("all", "true");
  if (status) params.append("status", status);
  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, { cache: "no-store" });
  return res.json();
};

export const getAllOrdersAdmin = async () => {
  const res = await fetch(`${baseUrl}/api/orders`, { cache: "no-store" });
  return res.json();
};