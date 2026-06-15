import Link from "next/link";
import type { Project } from "@/lib/types";

function yearOf(p: Project): string {
  const src = p.shotAt || (p.createdAt ? new Date(p.createdAt).toISOString() : "");
  return src ? src.slice(0, 4) : "";
}

export default function Works({ projects }: { projects: Project[] }) {
  return (
    <section className="works pad" id="works" data-screen-label="Sản phẩm đã làm">
      <div className="sec-head">
        <h2 className="reveal">Sản phẩm đã làm</h2>
        <p className="sub reveal">
          Tuyển chọn những dự án thương mại &amp; cá nhân tiêu biểu, 2019 — 2026.
        </p>
      </div>

      <div id="workList">
        {projects.map((p, i) => (
          <Link
            className="work"
            href={`/projects/${p.id}`}
            key={p.id}
            data-preview={p.coverUrl || p.images?.[0]?.url || ""}
          >
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="title">{p.title}</span>
            <span className="meta">
              <span className="cat">{p.tags?.[0] || "Photography"}</span>
              <span className="yr">{yearOf(p)}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Ảnh preview theo con trỏ — render rỗng, animation thêm sau */}
      <div id="workPreview" />

      <style>{`
        .works {
          --pad-x: clamp(20px, 5vw, 72px);
          position: relative;
          background: var(--char);
          color: var(--cream);
          font-family: var(--pf-sans);
          overflow: hidden;
          padding-left: var(--pad-x);
          padding-right: var(--pad-x);
          padding-top: clamp(90px, 14vh, 180px);
          padding-bottom: clamp(70px, 10vh, 140px);
        }

        .works .sec-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid var(--line-dark);
          padding-bottom: 22px;
          margin-bottom: 8px;
          gap: 20px;
        }
        .works .sec-head h2 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(34px, 5vw, 68px);
          line-height: 1;
        }
        .works .sec-head .sub {
          font-size: 13px;
          color: var(--muted-dark);
          max-width: 300px;
          text-align: right;
        }

        .work {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: clamp(16px, 3vw, 48px);
          align-items: center;
          padding: clamp(22px, 3.4vh, 40px) 0;
          border-bottom: 1px solid var(--line-dark);
          position: relative;
          color: inherit;
        }
        .work .idx {
          font-family: var(--serif);
          font-size: 18px;
          color: var(--gold);
          font-style: italic;
        }
        .work .title {
          font-family: var(--serif);
          font-size: clamp(28px, 4.4vw, 58px);
          font-weight: 400;
          line-height: 1;
          transition: transform .5s cubic-bezier(.2,.8,.2,1), color .4s;
        }
        .work .meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          text-align: right;
        }
        .work .cat {
          font-size: 11px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--muted-dark);
        }
        .work .yr {
          font-family: var(--serif);
          font-style: italic;
          font-size: 18px;
          color: var(--cream);
        }
        .work:hover .title {
          transform: translateX(22px);
          color: var(--gold-soft);
        }

        #workPreview {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 350px;
          pointer-events: none;
          z-index: 7000;
          opacity: 0;
          transition: opacity .45s ease;
          will-change: transform;
          overflow: hidden;
        }
        #workPreview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.12);
          transition: transform .6s cubic-bezier(.2,.8,.2,1);
        }
        #workPreview.on { opacity: 1; }
        #workPreview.on img { transform: scale(1); }

        @media (max-width: 680px) {
          .work {
            grid-template-columns: 38px 1fr;
            row-gap: 8px;
          }
          .work .meta {
            grid-column: 2;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
