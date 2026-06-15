import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import ProjectGallery from "@/components/sections/ProjectGallery";

export const revalidate = 60;

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[id]">
) {
  const { id } = await props.params;
  const project = await getProject(id).catch(() => null);

  if (!project) notFound();

  return (
    <article className="pd-page">
      <div className="pd-inner">
        <Link href="/projects" className="pd-back">
          ← Quay lại danh sách
        </Link>

        <header className="pd-head">
          <h1 className="pd-title">{project.title}</h1>
          {project.description ? (
            <p className="pd-desc">{project.description}</p>
          ) : null}
          {project.tags?.length ? (
            <div className="pd-tags">
              {project.tags.map((t) => (
                <span key={t} className="pd-tag">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {project.shotAt ? (
            <p className="pd-date">
              Chụp ngày: {new Date(project.shotAt).toLocaleDateString("vi-VN")}
            </p>
          ) : null}
        </header>

        <ProjectGallery
          cover={
            project.coverUrl
              ? { url: project.coverUrl, width: 1600, height: 900 }
              : null
          }
          images={project.images}
          alt={project.title}
        />
      </div>

      <style>{`
        .pd-page {
          --pad-x: clamp(20px, 5vw, 72px);
          min-height: 100vh;
          background: var(--cream);
          color: var(--pf-ink);
          font-family: var(--pf-sans);
          padding: clamp(110px, 16vh, 180px) var(--pad-x) clamp(70px, 12vh, 140px);
        }
        .pd-inner { max-width: 1320px; margin: 0 auto; }
        .pd-back {
          display: inline-block; font-size: 13px; font-weight: 600;
          color: var(--pf-muted); margin-bottom: 28px; transition: color .3s;
        }
        .pd-back:hover { color: var(--gold); }
        .pd-head { margin-bottom: clamp(32px, 5vh, 56px); max-width: 760px; }
        .pd-title {
          font-family: var(--serif); font-weight: 500; line-height: 1.05;
          font-size: clamp(36px, 6vw, 80px);
        }
        .pd-desc { margin-top: 16px; font-size: 16px; line-height: 1.6; color: var(--pf-muted); }
        .pd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .pd-tag {
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--muted-dark); border: 1px solid var(--line); border-radius: 999px;
          padding: 4px 12px;
        }
        .pd-date { margin-top: 14px; font-size: 12px; color: var(--muted-dark); }

        .pd-cover {
          display: block;
          position: relative; width: 100%; aspect-ratio: 16 / 9;
          overflow: hidden; background: var(--cream-2);
          margin-bottom: clamp(14px, 2vw, 28px);
          border: 0; padding: 0; cursor: pointer; border-radius: 8px;
        }
        .pd-cover img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .9s cubic-bezier(.2,.8,.2,1);
        }
        .pd-cover:hover img { transform: scale(1.03); }

        /* Masonry thật (CSS columns) — đồng nhất với mục Gallery trang chủ. */
        .pd-masonry {
          column-count: 4;
          column-gap: clamp(8px, 0.9vw, 14px);
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 1100px) { .pd-masonry { column-count: 3; } }
        @media (max-width: 760px)  { .pd-masonry { column-count: 2; } }
        .pd-cell {
          display: block;
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--cream-2);
          border: 0; padding: 0; cursor: pointer;
          border-radius: 8px;
          margin-bottom: clamp(8px, 0.9vw, 14px);
          break-inside: avoid;
        }
        .pd-cell img {
          width: 100%; height: auto; display: block;
          transition: transform .9s cubic-bezier(.2,.8,.2,1);
        }
        .pd-cell:hover img { transform: scale(1.04); }
        .pd-empty { color: var(--pf-muted); font-size: 15px; }
      `}</style>
    </article>
  );
}
