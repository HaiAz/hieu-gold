"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { signIn, user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("hieugold@hieu-gold.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    search.get("error") === "forbidden"
      ? "Tài khoản này không có quyền quản trị."
      : null
  );

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đăng nhập thất bại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-page flex min-h-screen items-center justify-center py-16">
      <form onSubmit={onSubmit} className="adm-card w-full max-w-md space-y-5">
        <header>
          <span className="adm-eyebrow">Minh Hiếu Studio</span>
          <h1 className="adm-title mt-2" style={{ fontSize: "30px" }}>
            Đăng nhập quản trị
          </h1>
          <p className="adm-muted mt-2 text-xs">
            Chỉ tài khoản admin mới có quyền truy cập.
          </p>
        </header>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="adm-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            className="adm-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <p className="adm-alert-err">{error}</p> : null}

        <button type="submit" className="adm-btn w-full" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="adm-muted text-center text-xs">
          Lần đầu cài đặt?{" "}
          <Link href="/setup" className="adm-link">
            Tạo tài khoản super admin
          </Link>
        </p>
      </form>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="adm-muted container-page py-20 text-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
