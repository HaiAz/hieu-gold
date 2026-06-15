"use client";

import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    /* ---------- scroll progress bar ---------- */
    const progress = document.getElementById("siteProgress");
    const onScroll = () => {
      if (!progress) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progress.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* ---------- reveal on scroll ---------- */
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-lines")
    );
    if (reduce) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      revealEls.forEach((el) => el.classList.add("reveal-init"));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ---------- count-up stats ---------- */
    const counters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count]")
    );
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          countIO.unobserve(el);
          const target = parseInt(el.dataset.count || "0", 10);
          if (reduce || !target) {
            el.textContent = String(target);
            return;
          }
          const dur = 1400;
          let start = 0;
          const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countIO.observe(el));
    cleanups.push(() => countIO.disconnect());

    /* ---------- custom cursor (hover-capable pointers only) ---------- */
    const canHover = window.matchMedia("(hover: hover)").matches;
    const cursor = document.getElementById("siteCursor");
    if (canHover && cursor && !reduce) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let cx = x;
      let cy = y;
      let raf = 0;
      const move = (e: MouseEvent) => {
        x = e.clientX;
        y = e.clientY;
      };
      const loop = () => {
        cx += (x - cx) * 0.18;
        cy += (y - cy) * 0.18;
        cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
      };
      const enterLink = () => cursor.classList.add("dot");
      const leaveLink = () => cursor.classList.remove("dot");
      const enterView = () => cursor.classList.add("view");
      const leaveView = () => cursor.classList.remove("view");
      window.addEventListener("mousemove", move, { passive: true });
      raf = requestAnimationFrame(loop);
      const links = Array.from(
        document.querySelectorAll<HTMLElement>("a, button")
      );
      links.forEach((el) => {
        el.addEventListener("mouseenter", enterLink);
        el.addEventListener("mouseleave", leaveLink);
      });
      const gimgs = Array.from(document.querySelectorAll<HTMLElement>(".gimg"));
      gimgs.forEach((el) => {
        el.addEventListener("mouseenter", enterView);
        el.addEventListener("mouseleave", leaveView);
      });
      document.body.classList.add("has-cursor");
      cleanups.push(() => {
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(raf);
        links.forEach((el) => {
          el.removeEventListener("mouseenter", enterLink);
          el.removeEventListener("mouseleave", leaveLink);
        });
        gimgs.forEach((el) => {
          el.removeEventListener("mouseenter", enterView);
          el.removeEventListener("mouseleave", leaveView);
        });
        document.body.classList.remove("has-cursor");
      });
    }

    /* ---------- works hover preview (follows cursor) ---------- */
    const preview = document.getElementById("workPreview");
    if (preview && canHover && !reduce) {
      const works = Array.from(document.querySelectorAll<HTMLElement>(".work"));
      let px = 0;
      let py = 0;
      let raf = 0;
      const onMove = (e: MouseEvent) => {
        px = e.clientX;
        py = e.clientY;
      };
      const loop = () => {
        preview.style.transform = `translate(${px + 24}px, ${py - 175}px)`;
        raf = requestAnimationFrame(loop);
      };
      const enter = (el: HTMLElement) => {
        const url = el.dataset.preview;
        if (!url) return;
        preview.innerHTML = `<img src="${url}" alt="" />`;
        preview.classList.add("on");
      };
      const leave = () => preview.classList.remove("on");
      works.forEach((el) => {
        el.addEventListener("mouseenter", () => enter(el));
        el.addEventListener("mouseleave", leave);
      });
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
      cleanups.push(() => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="progress" id="siteProgress" aria-hidden />
      <div className="cursor" id="siteCursor" aria-hidden>
        <span className="cursor-label">Xem</span>
      </div>

      <style>{`
        .progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: var(--gold);
          z-index: 9500;
        }
        .cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 26px;
          height: 26px;
          border: 1.5px solid var(--gold);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9600;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width .4s cubic-bezier(.2,.8,.2,1),
            height .4s cubic-bezier(.2,.8,.2,1),
            background-color .4s ease, border-color .4s ease, opacity .3s;
        }
        .cursor-label {
          opacity: 0;
          font-family: var(--pf-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--gold-soft);
          transition: opacity .3s;
        }
        .cursor.dot {
          width: 7px;
          height: 7px;
          background: var(--gold);
          border-color: var(--gold);
        }
        .cursor.view {
          width: 78px;
          height: 78px;
          background: rgba(25,21,15,.45);
          border-color: var(--gold-soft);
        }
        .cursor.view .cursor-label { opacity: 1; }

        @media (hover: hover) {
          body.has-cursor { cursor: none; }
          body.has-cursor a,
          body.has-cursor button,
          body.has-cursor .gimg { cursor: none; }
          body.has-cursor .cursor { opacity: 1; }
          body.lb-open.has-cursor { cursor: auto; }
          body.lb-open.has-cursor .cursor { opacity: 0; }
        }

        /* reveal animation */
        .reveal-init { opacity: 0; transform: translateY(28px); }
        .reveal-init.is-in {
          opacity: 1;
          transform: none;
          transition: opacity .9s cubic-bezier(.2,.8,.2,1),
            transform .9s cubic-bezier(.2,.8,.2,1);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-init { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
