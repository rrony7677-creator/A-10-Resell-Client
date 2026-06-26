"use server";

import { getServerJwt } from "../utils/getServerJwt";

const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const getWishlist = async (buyerId) => {
  const res = await fetch(`${baseUrl}/api/wishlist?buyerId=${buyerId}`, { cache: "no-store" });
  return res.json();
};

export const addToWishlist = async (item) => {
  const token = await getServerJwt();
  const res = await fetch(`${baseUrl}/api/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const removeFromWishlist = async (buyerId, productId) => {
  const token = await getServerJwt();
  const res = await fetch(
    `${baseUrl}/api/wishlist?buyerId=${buyerId}&productId=${productId}`,
    { method: "DELETE",
       headers: { "Content-Type": "application/json",...(token ? { Authorization: `Bearer ${token}` } : {}), },
     },
    
  );
  return res.json();
};