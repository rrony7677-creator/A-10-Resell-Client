"use server";

const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export const getPublicStats = async () => {
  const res = await fetch(`${baseUrl}/api/stats/public`, { cache: "no-store" });
  return res.json();
};