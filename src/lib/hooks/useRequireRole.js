"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export function useRequireRole(requiredRole) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      toast.error("You don't have access to this page");
      router.push("/");
    }
  }, [isPending, session, requiredRole, router]);

  return { session, isPending };
}