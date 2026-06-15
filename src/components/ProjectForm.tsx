"use client";

import AppImage from "@/components/ui/AppImage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject, updateProject } from "@/lib/projects";
import ImagePicker from "@/components/ImagePicker";
import type { Project, ProjectImage } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  tags: string; // comma separated for UX
  shotAt: string;
  coverUrl?: string;
  coverPath?: string;
  images: ProjectImage[];
};

function toFormState(p?: Project | null): FormState {
  return {
    title: p?.title ?? "",
    description: p?.description ?? "",
    tags: p?.tags?.join(", ") ?? "",
    shotAt: p?.shotAt ?? "",
    coverUrl: p?.coverUrl,
    coverPath: p?.coverPath,
    images: p?.images ?? [],
  };
}

export default function ProjectForm({ initial }: { initial?: Project | null }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(toFormState(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function addImages(picked: { url: string; publicId: string }[]) {
    setState((s) => {
      const existing = new Set(s.images.map((i) => i.path));
      const toAdd = picked
        .filter((p) => !existing.has(p.publicId))
        .map((p) => ({ url: p.url, path: p.publicId }));
      return { ...s, images: [...s.images, ...toAdd] };
    });
  }

  function removeImage(img: ProjectImage) {
    if (!confirm("Xoá ảnh này khỏi dự án? (File gốc vẫn nằm trên Cloudinary)")) return;
    update("images", state.images.filter((i) => i.path !== img.path));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: state.title.trim(),
        description: state.description.trim(),
        tags: state.tags.split(",").map((t) => t.trim()).filter(Boolean),
        shotAt: state.shotAt || undefined,
        coverUrl: state.coverUrl,
        coverPath: state.coverPath,
        images: state.images,
      };
      if (initial) {
        await updateProject(initial.id, payload);
      } else {
        await createProject(payload);
      }
      router.replace("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="adm-card space-y-4">
        <h2 className="adm-h2">Thông tin dự án</h2>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="title">
            Tiêu đề
          </label>
          <input
            id="title"
            className="adm-input"
            value={state.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="adm-label" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            className="adm-input h-28"
            value={state.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="adm-label" htmlFor="tags">
              Tags (phân tách bằng dấu phẩy)
            </label>
            <input
              id="tags"
              className="adm-input"
              placeholder="chân dung, sự kiện, ngoại cảnh"
              value={state.tags}
              onChange={(e) => update("tags", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="adm-label" htmlFor="shotAt">
              Ngày chụp
            </label>
            <input
              id="shotAt"
              type="date"
              className="adm-input"
              value={state.shotAt}
              onChange={(e) => update("shotAt", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="adm-card space-y-4">
        <h2 className="adm-h2">Ảnh bìa</h2>
        <div className="grid gap-4 md:grid-cols-[280px_1fr] md:items-center">
          <div className="adm-thumb relative aspect-4/3 w-full">
            {state.coverUrl ? (
              <AppImage
                src={state.coverUrl}
                alt="Cover"
                fill
                sizes="280px"
                className="object-cover"
              />
            ) : (
              <div className="adm-muted flex h-full items-center justify-center text-xs">
                Chưa có ảnh bìa
              </div>
            )}
          </div>
          <div className="self-start">
            <ImagePicker
              triggerLabel="Chọn ảnh bìa"
              triggerClassName="adm-btn-outline cursor-pointer"
              onSelect={(imgs) => {
                if (imgs[0]) {
                  update("coverUrl", imgs[0].url);
                  update("coverPath", imgs[0].publicId);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="adm-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="adm-h2">Thư viện ảnh ({state.images.length})</h2>
          <ImagePicker
            triggerLabel="+ Thêm ảnh"
            triggerClassName="adm-btn-outline cursor-pointer"
            multiple
            onSelect={addImages}
          />
        </div>

        {state.images.length === 0 ? (
          <p className="adm-muted text-sm">Chưa có ảnh nào.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {state.images.map((img) => (
              <div
                key={img.path}
                className="adm-thumb group relative aspect-square"
              >
                <AppImage
                  src={img.url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="rounded-pill absolute right-2 top-2 px-2 py-1 text-[11px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "#a3402f" }}
                >
                  Xoá
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="adm-alert-err">{error}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.replace("/admin/projects")}
          className="adm-btn-outline"
        >
          Huỷ
        </button>
        <button type="submit" className="adm-btn" disabled={saving}>
          {saving ? "Đang lưu..." : initial ? "Lưu thay đổi" : "Tạo dự án"}
        </button>
      </div>
    </form>
  );
}
