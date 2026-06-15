"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [email, setEmail] = useState("hieugold@hieu-gold.com");
  const [password, setPassword] = useState("123456789aA@");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "admins"), limit(1)));
        setHasAdmin(!snap.empty);
      } catch {
        setHasAdmin(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let uid: string | undefined;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("auth/email-already-in-use")) {
          // User already exists — sign in to obtain uid then add admin doc
          const cred = await signInWithEmailAndPassword(auth, email, password);
          uid = cred.user.uid;
        } else {
          throw err;
        }
      }
      if (!uid) throw new Error("Không lấy được UID.");
      await setDoc(doc(db, "admins", uid), {
        uid,
        email,
        role: "admin",
        createdAt: Date.now(),
      });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo tài khoản thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="adm-muted container-page py-20 text-center">
        Đang kiểm tra...
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <section className="container-page flex min-h-screen items-center justify-center py-16">
        <div className="adm-card w-full max-w-md">
          <span className="adm-eyebrow">Minh Hiếu Studio</span>
          <h1 className="adm-title mt-2" style={{ fontSize: "30px" }}>
            Đã có tài khoản admin
          </h1>
          <p className="adm-muted mt-2 text-xs">
            Trang cài đặt khởi tạo chỉ dùng lần đầu tiên. Vui lòng đăng nhập.
          </p>
          <button
            onClick={() => router.replace("/login")}
            className="adm-btn mt-5 w-full"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page flex min-h-screen items-center justify-center py-16">
      <form onSubmit={onSubmit} className="adm-card w-full max-w-md space-y-5">
        <header>
          <span className="adm-eyebrow">Minh Hiếu Studio</span>
          <h1 className="adm-title mt-2" style={{ fontSize: "30px" }}>
            Tạo tài khoản super admin
          </h1>
          <p className="adm-muted mt-2 text-xs">
            Trang này chỉ hoạt động khi chưa có admin nào. Sau khi tạo, mở Firebase Console để bật phương thức Email/Password nếu chưa bật.
          </p>
        </header>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="email">
            Email đăng nhập
          </label>
          <input
            id="email"
            type="email"
            className="adm-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="adm-muted text-[11px]">
            Firebase Auth bắt buộc dùng email. Username &quot;hieugold&quot; được map sang email này.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            type="text"
            className="adm-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? <p className="adm-alert-err">{error}</p> : null}

        <button type="submit" className="adm-btn w-full" disabled={submitting}>
          {submitting ? "Đang tạo..." : "Tạo super admin"}
        </button>
      </form>
    </section>
  );
}
