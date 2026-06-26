"use server";

import { headers } from "next/headers";

const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export const getServerJwt = async () => {
  try {
    const incomingHeaders = await headers();
    const cookie = incomingHeaders.get("cookie") || "";

    const res = await fetch(`${siteUrl}/api/auth/token`, { headers: { cookie } });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.token || null;
  } catch (err) {
    console.error("getServerJwt error:", err.message);
    return null;
  }
};