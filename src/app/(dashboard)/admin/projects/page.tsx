"use client";

import AppImage from "@/components/ui/AppImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteProject, listProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";

export default function AdminProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await listProjects();
        if (!cancelled) setProjects(items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function reload() {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }

  async function onDelete(p: Project) {
    if (!confirm(`Xoá dự án "${p.title}"? Hành động này không hoàn tác được.`)) return;
    setDeleting(p.id);
    try {
      await deleteProject(p);
      await reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xoá thất bại.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="adm-h2">Danh sách dự án</h2>
        <Link href="/admin/projects/new" className="adm-btn">
          + Thêm dự án
        </Link>
      </div>

      {loading ? (
        <p className="adm-muted text-sm">Đang tải...</p>
      ) : projects.length === 0 ? (
        <div className="adm-card text-center">
          <p className="adm-muted text-sm">Chưa có dự án nào.</p>
          <Link href="/admin/projects/new" className="adm-btn mt-4">
            Tạo dự án đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="adm-card adm-proj-card overflow-hidden p-0!">
              <Link href={`/admin/projects/${p.id}`} className="block">
                <div className="adm-thumb adm-proj-cover relative aspect-4/3 w-full rounded-none! border-0">
                  {p.coverUrl ? (
                    <AppImage
                      src={p.coverUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="adm-muted flex h-full items-center justify-center text-xs">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-4 pb-2">
                  <h3
                    className="adm-proj-title text-base font-semibold"
                    style={{ color: "var(--pf-ink)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="adm-muted line-clamp-2 text-xs">{p.description}</p>
                </div>
              </Link>
              <div className="flex items-center justify-between px-4 pb-4 text-xs">
                <span className="adm-muted">{p.images.length} ảnh</span>
                <button
                  onClick={() => onDelete(p)}
                  disabled={deleting === p.id}
                  className="adm-btn-danger"
                >
                  {deleting === p.id ? "Đang xoá..." : "Xoá"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
