"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Chọn vùng cắt dọc bằng cách kéo một khung crop (tỉ lệ = aspect) trên ảnh đầy đủ.
 * Vùng ngoài khung tối đi. Giá trị trả về là focusY 0–100 (%) — vị trí dọc của
 * tâm vùng crop, khớp với object-position: 50% {focusY}%.
 */
export default function HeroFocusPicker({
  src,
  aspect,
  value,
  onChange,
}: {
  src: string;
  aspect: number; // width / height của khung hero (vd 16/9)
  value: number; // focusY 0–100
  onChange: (focusY: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [boxW, setBoxW] = useState(0);
  const draggingRef = useRef(false);

  // Đo chiều rộng container để tính kích thước hiển thị. Đo lại khi ảnh load
  // (natural đổi) vì lúc mount stage có thể chưa có layout ổn định.
  useEffect(() => {
    const measure = () => setBoxW(wrapRef.current?.clientWidth ?? 0);
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [natural]);

  // Chiều cao ảnh hiển thị (full width theo tỉ lệ ảnh gốc).
  const dispH = natural && boxW ? (boxW * natural.h) / natural.w : 0;
  // Chiều cao khung crop = bề rộng / aspect.
  const cropH = boxW ? boxW / aspect : 0;
  // Khoảng kéo được của mép trên khung.
  const range = Math.max(0, dispH - cropH);
  // Vị trí mép trên khung theo focusY (focusY là tâm khung so với ảnh).
  const topPx = range * (value / 100);

  const setFromClientY = useCallback(
    (clientY: number) => {
      const el = wrapRef.current;
      if (!el || range <= 0) return;
      const rect = el.getBoundingClientRect();
      // tâm khung tại vị trí chuột, kẹp trong [cropH/2, dispH - cropH/2]
      let center = clientY - rect.top;
      const minC = cropH / 2;
      const maxC = dispH - cropH / 2;
      center = Math.max(minC, Math.min(maxC, center));
      const top = center - cropH / 2;
      onChange(Math.round((top / range) * 100));
    },
    [range, cropH, dispH, onChange]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingRef.current) setFromClientY(e.clientY);
    };
    const onUp = () => (draggingRef.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [setFromClientY]);

  const canDrag = range > 1;

  return (
    <div className="hfp">
      <div
        ref={wrapRef}
        className="hfp-stage"
        style={{ height: dispH || undefined }}
      >
        {/* ảnh đầy đủ */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="hfp-img"
          ref={(img) => {
            // Ảnh có thể đã cache (complete) trước khi onLoad gắn → đọc ngay.
            if (img && img.complete && img.naturalWidth) {
              setNatural((prev) =>
                prev && prev.w === img.naturalWidth ? prev : { w: img.naturalWidth, h: img.naturalHeight }
              );
            }
          }}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        {natural && canDrag ? (
          <>
            {/* phủ tối phần trên + dưới khung; phần giữa để ảnh sáng nguyên */}
            <div className="hfp-shade" style={{ top: 0, height: topPx }} />
            <div
              className="hfp-shade"
              style={{ top: topPx + cropH, bottom: 0 }}
            />
            <div
              className="hfp-window"
              style={{ top: topPx, height: cropH }}
              onMouseDown={(e) => {
                draggingRef.current = true;
                setFromClientY(e.clientY);
                e.preventDefault();
              }}
              onTouchStart={(e) => {
                draggingRef.current = true;
                setFromClientY(e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (draggingRef.current) setFromClientY(e.touches[0].clientY);
              }}
              onTouchEnd={() => (draggingRef.current = false)}
            >
              <span className="hfp-grip" />
            </div>
          </>
        ) : null}
      </div>
      <p className="adm-muted text-xs">
        {canDrag
          ? "Kéo khung sáng lên/xuống để chọn phần ảnh hiển thị."
          : "Ảnh đã vừa khung — không cần chỉnh vùng cắt."}
      </p>

      <style>{`
        .hfp { display: flex; flex-direction: column; gap: 8px; }
        .hfp-stage {
          position: relative;
          width: 100%;
          border-radius: 6px;
          overflow: hidden;
          background: var(--cream-2);
          user-select: none;
        }
        .hfp-img {
          display: block;
          width: 100%;
          height: auto;
        }
        .hfp-shade {
          position: absolute;
          left: 0;
          width: 100%;
          background: rgba(25, 21, 15, 0.58);
          pointer-events: none;
        }
        .hfp-window {
          position: absolute;
          left: 0;
          width: 100%;
          cursor: grab;
          border-top: 2px solid var(--gold);
          border-bottom: 2px solid var(--gold);
          box-shadow: inset 0 0 0 1px rgba(243, 237, 225, 0.4);
        }
        .hfp-window:active { cursor: grabbing; }
        .hfp-grip {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 5px;
          border-radius: 999px;
          background: var(--gold);
          box-shadow: 0 0 0 4px rgba(243, 237, 225, 0.5);
        }
      `}</style>
    </div>
  );
}
