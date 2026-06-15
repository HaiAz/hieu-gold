"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/login?error=forbidden");
    }
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="container-page py-20 text-center text-muted">
        Đang tải...
      </div>
    );
  }
  if (!user || !isAdmin) {
    return (
      <div className="container-page py-20 text-center text-muted">
        Đang chuyển hướng...
      </div>
    );
  }
  return <>{children}</>;
}
