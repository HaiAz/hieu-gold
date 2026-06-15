"use client";

import AppImage from "@/components/ui/AppImage";
import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/profile";
import ImagePicker from "@/components/ImagePicker";
import HeroFocusPicker from "@/components/HeroFocusPicker";
import type { Profile } from "@/lib/types";

const EMPTY: Profile = {
  fullName: "",
  bio: "",
  email: "",
  phone: "",
  avatarUrl: "",
  heroImageUrl: "",
  heroImageMobileUrl: "",
  heroFocusY: 50,
  heroFocusYMobile: 50,
  galleryImages: [],
  social: {},
};

export default function HomeContentEditor() {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProfile();
        setProfile({ ...EMPTY, ...p, social: { ...EMPTY.social, ...p.social } });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  // ---- Gallery (giữ đúng thứ tự đã chọn) ----
  function addGalleryImages(picked: { url: string; publicId: string }[]) {
    setProfile((p) => {
      const cur = p.galleryImages ?? [];
      const existing = new Set(cur.map((i) => i.path));
      const toAdd = picked
        .filter((x) => !existing.has(x.publicId))
        .map((x) => ({ url: x.url, path: x.publicId }));
      return { ...p, galleryImages: [...cur, ...toAdd] };
    });
  }
  function removeGalleryImage(path: string) {
    setProfile((p) => ({
      ...p,
      galleryImages: (p.galleryImages ?? []).filter((i) => i.path !== path),
    }));
  }
  function moveGalleryImage(index: number, dir: -1 | 1) {
    setProfile((p) => {
      const arr = [...(p.galleryImages ?? [])];
      const j = index + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[index], arr[j]] = [arr[j], arr[index]];
      return { ...p, galleryImages: arr };
    });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveProfile(profile);
      setMessage({ type: "ok", text: "Đã lưu nội dung trang chủ." });
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Lưu thất bại.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="adm-muted text-sm">Đang tải...</p>;

  const gallery = profile.galleryImages ?? [];

  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Banner */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="adm-card space-y-4">
          <p className="adm-label">Ảnh banner — Desktop (ngang)</p>
          <p className="adm-muted text-xs">
            Hiển thị ở đầu trang chủ trên màn hình &gt; 768px. Nên dùng ảnh ngang.
          </p>
          {profile.heroImageUrl ? (
            <HeroFocusPicker
              src={profile.heroImageUrl}
              aspect={2.9}
              value={profile.heroFocusY ?? 50}
              onChange={(y) => update("heroFocusY", y)}
            />
          ) : (
            <div
              className="adm-thumb adm-muted flex w-full items-center justify-center px-3 text-center text-xs"
              style={{ aspectRatio: "2.9" }}
            >
              Chưa có ảnh banner (sẽ dùng tạm ảnh đại diện)
            </div>
          )}
          <ImagePicker
            triggerLabel="Chọn ảnh desktop"
            onSelect={(imgs) => imgs[0] && update("heroImageUrl", imgs[0].url)}
          />
          {profile.heroImageUrl ? (
            <button
              type="button"
              onClick={() => update("heroImageUrl", "")}
              className="adm-btn-danger text-xs"
            >
              Xoá ảnh desktop
            </button>
          ) : null}
        </div>

        <div className="adm-card space-y-4">
          <p className="adm-label">Ảnh banner — Mobile (dọc)</p>
          <p className="adm-muted text-xs">
            Hiển thị trên màn hình ≤ 768px. Nên dùng ảnh dọc. Bỏ trống sẽ dùng ảnh desktop.
          </p>
          {profile.heroImageMobileUrl ? (
            <HeroFocusPicker
              src={profile.heroImageMobileUrl}
              aspect={3 / 4}
              value={profile.heroFocusYMobile ?? 50}
              onChange={(y) => update("heroFocusYMobile", y)}
            />
          ) : (
            <div
              className="adm-thumb adm-muted flex w-full items-center justify-center px-3 text-center text-xs"
              style={{ aspectRatio: "3 / 4" }}
            >
              Chưa có ảnh mobile (sẽ dùng tạm ảnh desktop)
            </div>
          )}
          <ImagePicker
            triggerLabel="Chọn ảnh mobile"
            onSelect={(imgs) => imgs[0] && update("heroImageMobileUrl", imgs[0].url)}
          />
          {profile.heroImageMobileUrl ? (
            <button
              type="button"
              onClick={() => update("heroImageMobileUrl", "")}
              className="adm-btn-danger text-xs"
            >
              Xoá ảnh mobile
            </button>
          ) : null}
        </div>
      </div>

      {/* Gallery */}
      <div className="adm-card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="adm-h2">Thư viện Gallery</h2>
          <ImagePicker
            triggerLabel="+ Thêm ảnh Gallery"
            triggerClassName="adm-btn-outline cursor-pointer"
            multiple
            onSelect={addGalleryImages}
          />
        </div>
        <p className="adm-muted text-xs">
          Ảnh hiển thị ở mục Gallery trang chủ, theo đúng thứ tự bên dưới. Dùng mũi
          tên để sắp xếp.
        </p>

        {gallery.length === 0 ? (
          <p className="adm-muted text-sm">Chưa có ảnh nào trong Gallery.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((img, i) => (
              <div key={img.path} className="adm-thumb group relative aspect-square">
                <AppImage
                  src={img.url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <span
                  className="absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ background: "var(--gold)", color: "var(--cream)" }}
                >
                  {i + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, -1)}
                      disabled={i === 0}
                      className="gal-move"
                      title="Lùi trước"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, 1)}
                      disabled={i === gallery.length - 1}
                      className="gal-move"
                      title="Đẩy sau"
                    >
                      ›
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.path)}
                    className="gal-move"
                    title="Xoá"
                    style={{ background: "#a3402f" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? (
        <p className={message.type === "ok" ? "adm-alert-ok" : "adm-alert-err"}>
          {message.text}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button type="submit" className="adm-btn" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
