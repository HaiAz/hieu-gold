"use client";

import { useEffect } from "react";
import AppImage from "@/components/ui/AppImage";
import type { LightboxImage } from "./LightboxProvider";

export default function Lightbox({
  images,
  index,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: LightboxImage[];
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  // Keyboard nav + body scroll-lock while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lb-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lb-open");
    };
  }, [isOpen, onClose, onNext, onPrev]);

  const current = images[index];

  return (
    <div
      className={`lb${isOpen ? " on" : ""}`}
      id="lb"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!isOpen}
    >
      <span className="lb-close" id="lbClose" onClick={onClose}>
        Đóng ✕
      </span>
      {images.length > 1 ? (
        <span className="lb-nav lb-prev" id="lbPrev" onClick={onPrev}>
          ‹
        </span>
      ) : null}
      {current ? (
        <AppImage
          className="lb-img film-img"
          id="lbImg"
          src={current.url}
          alt=""
          width={current.width || 1600}
          height={current.height || 1200}
          sizes="90vw"
        />
      ) : null}
      {images.length > 1 ? (
        <span className="lb-nav lb-next" id="lbNext" onClick={onNext}>
          ›
        </span>
      ) : null}

      <style>{`
        .lb {
          position: fixed;
          inset: 0;
          z-index: 9700;
          background: rgba(20,16,11,.94);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity .4s;
          padding: 5vh 5vw;
          cursor: auto;
          font-family: var(--pf-sans);
        }
        .lb.on { opacity: 1; pointer-events: auto; }
        .lb-img {
          max-width: 90vw;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          transform: scale(.94);
          transition: transform .5s cubic-bezier(.2,.8,.2,1);
          cursor: default;
        }
        .lb.on .lb-img { transform: scale(1); }
        .lb-close {
          position: absolute;
          top: 24px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--cream);
          font-size: 12px;
          letter-spacing: .2em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 10px 14px;
          border: 1px solid var(--line-dark);
          border-radius: 999px;
          transition: border-color .3s, color .3s, background-color .3s;
        }
        .lb-close:hover {
          border-color: var(--gold-soft);
          color: var(--gold-soft);
          background: rgba(243,237,225,.04);
        }
        .lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid var(--line-dark);
          color: var(--cream);
          font-size: 30px;
          font-family: var(--serif);
          cursor: pointer;
          background: rgba(20,16,11,.35);
          backdrop-filter: blur(2px);
          transition: border-color .3s, color .3s, background-color .3s;
        }
        .lb-nav:hover {
          border-color: var(--gold-soft);
          color: var(--gold-soft);
          background: rgba(243,237,225,.06);
        }
        .lb-prev { left: clamp(12px, 2.5vw, 40px); }
        .lb-next { right: clamp(12px, 2.5vw, 40px); }
        @media (max-width: 680px) {
          .lb-nav { width: 48px; height: 48px; font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
