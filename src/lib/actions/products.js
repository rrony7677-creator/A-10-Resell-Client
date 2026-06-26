// "use server"

// // Fallback to localhost:5000 if the environment variable isn't defined
// const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// export const createProduct = async (productData) => {
//     const res = await fetch(`${baseUrl}/api/products`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(productData),
//     });
//     return res.json();
// };

"use server";

import { getServerJwt } from "../utils/getServerJwt";

const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const createProduct = async (productData) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify(productData),
  });
  return res.json();
};

// status না দিলে seller এর সব product (pending, available, rejected — সবই) পাবেন
export const getSellerProducts = async (sellerId, status) => {
  const params = new URLSearchParams();
  if (sellerId) params.append("sellerId", sellerId);
  if (status) params.append("status", status);

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: "no-store",
  });
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });
  return res.json();
};

export const updateProduct = async (id, updatedData) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    method: "DELETE",
     headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
  });
  return res.json();
};

export const decrementProductStock = async (id, decrementBy) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/products/${id}/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ decrementBy }),
  });
  return res.json();
};

export const getPublicProducts = async ({
  search = "",
  category = "",
  condition = "",
  sort = "",
  page = 1,
  limit = 8,} = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (condition) params.append("condition", condition);
  if (sort) params.append("sort", sort);
  params.append("page", page);
  params.append("limit", limit);

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: "no-store",
  });
  return res.json();
};