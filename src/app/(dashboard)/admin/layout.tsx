"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/profile", label: "Thông tin cá nhân" },
  { href: "/admin/home", label: "Trang chủ" },
  { href: "/admin/projects", label: "Quản lý dự án" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <AdminGuard>
      <div className="container-page py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="adm-eyebrow">Khu vực quản trị</span>
            <h1 className="adm-title mt-2">Trang quản trị</h1>
            <p className="adm-muted mt-2 text-xs">
              Đăng nhập:{" "}
              <span className="font-semibold" style={{ color: "var(--pf-ink)" }}>
                {user?.email}
              </span>
            </p>
          </div>
          <button onClick={handleLogout} className="adm-btn-outline">
            Đăng xuất
          </button>
        </header>

        <nav className="adm-divider mb-8 flex flex-wrap gap-1 border-b">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`adm-tab ${active ? "adm-tab-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </AdminGuard>
  );
}
