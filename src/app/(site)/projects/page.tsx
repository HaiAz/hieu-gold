import AppImage from "@/components/ui/AppImage";
import Link from "next/link";
import { listProjects } from "@/lib/projects";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await listProjects().catch(() => []);

  return (
    <section className="proj-page">
      <div className="proj-inner">
        <header className="proj-head">
          <span className="proj-eyebrow">Tuyển tập dự án</span>
          <h1 className="proj-title">
            Sản phẩm <em>đã làm</em>
          </h1>
          <p className="proj-sub">
            Tổng hợp các bộ ảnh và dự án nhiếp ảnh đã thực hiện.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="proj-empty">Chưa có dự án nào.</p>
        ) : (
          <div className="proj-grid">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="proj-card">
                <div className="proj-cover">
                  {p.coverUrl ? (
                    <AppImage
                      className="film-img"
                      src={p.coverUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="proj-noimg">Chưa có ảnh bìa</div>
                  )}
                </div>
                <div className="proj-meta">
                  <h3 className="proj-name">{p.title}</h3>
                  <p className="proj-desc">{p.description}</p>
                  {p.tags?.length ? (
                    <div className="proj-tags">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="proj-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .proj-page {
          --pad-x: clamp(20px, 5vw, 72px);
          min-height: 100vh;
          background: var(--cream);
          color: var(--pf-ink);
          font-family: var(--pf-sans);
          padding: clamp(110px, 16vh, 180px) var(--pad-x) clamp(70px, 12vh, 140px);
        }
        .proj-inner { max-width: 1320px; margin: 0 auto; }
        .proj-head { margin-bottom: clamp(40px, 7vh, 80px); }
        .proj-eyebrow {
          font-size: 11px; letter-spacing: .32em; text-transform: uppercase;
          font-weight: 600; color: var(--gold); display: block; margin-bottom: 16px;
        }
        .proj-title {
          font-family: var(--serif); font-weight: 500; line-height: 1.04;
          font-size: clamp(40px, 7vw, 92px);
        }
        .proj-title em { font-style: italic; color: var(--gold); }
        .proj-sub {
          margin-top: 16px; font-size: 15px; color: var(--pf-muted); max-width: 480px;
        }
        .proj-empty { color: var(--pf-muted); font-size: 15px; }

        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 3vw, 44px);
        }
        @media (max-width: 1024px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 620px) { .proj-grid { grid-template-columns: 1fr; } }

        .proj-cover {
          position: relative; width: 100%; aspect-ratio: 4 / 3;
          overflow: hidden; background: var(--cream-2);
        }
        .proj-cover img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .9s cubic-bezier(.2,.8,.2,1);
        }
        .proj-card:hover .proj-cover img { transform: scale(1.05); }
        .proj-noimg {
          display: flex; height: 100%; align-items: center; justify-content: center;
          font-size: 12px; color: var(--muted-dark);
        }
        .proj-meta { padding-top: 18px; }
        .proj-name {
          font-family: var(--serif); font-weight: 500; font-size: 22px; line-height: 1.2;
          transition: color .3s;
        }
        .proj-card:hover .proj-name { color: var(--gold); }
        .proj-desc {
          margin-top: 6px; font-size: 14px; color: var(--pf-muted);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .proj-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .proj-tag {
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--muted-dark); border: 1px solid var(--line); border-radius: 999px;
          padding: 4px 12px;
        }
      `}</style>
    </section>
  );
}
