"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Link dạng /#... để hoạt động cả ở trang chủ lẫn trang con (vd /projects).
const LINKS = [
  { href: "/#about", label: "Giới thiệu" },
  { href: "/#works", label: "Sản phẩm" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Liên hệ" },
];

export default function Nav({ brand = "Minh Hiếu" }: { brand?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/#top" className="brand">
        {brand}
      </Link>
      <div className="nav-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>

      <style>{`
        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 8000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px clamp(20px, 5vw, 72px);
          color: #fff;
          font-family: var(--pf-sans);
          /* Đầu trang: trong suốt + mix-blend cho chữ nổi trên hero. */
          mix-blend-mode: difference;
          background: rgba(243, 237, 225, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          border-bottom: 1px solid transparent;
          transition: padding .4s ease, background-color .4s ease,
            backdrop-filter .4s ease, border-color .4s ease,
            box-shadow .4s ease, color .4s ease;
        }
        .site-nav.scrolled {
          /* Cuộn xuống: bỏ mix-blend, nền cream mờ, chữ ink đọc rõ. */
          mix-blend-mode: normal;
          color: var(--pf-ink);
          background: rgba(243, 237, 225, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
          padding-top: 16px;
          padding-bottom: 16px;
          box-shadow: 0 1px 12px rgba(28, 24, 19, 0.06);
        }

        .site-nav .brand {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 500;
          white-space: nowrap;
        }
        .site-nav .nav-links {
          display: flex;
          gap: clamp(18px, 2.4vw, 38px);
          font-size: 12px;
          letter-spacing: .18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .site-nav .nav-links a {
          position: relative;
          opacity: .85;
          white-space: nowrap;
        }
        .site-nav.scrolled .nav-links a { opacity: 1; }
        .site-nav.scrolled .nav-links a:hover { color: var(--gold); }
        .site-nav .nav-links a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0;
          height: 1px;
          background: currentColor;
          transition: width .4s ease;
        }
        .site-nav .nav-links a:hover::after { width: 100%; }
        .site-nav .nav-links a:hover { opacity: 1; }

        @media (max-width: 680px) {
          .site-nav .nav-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
