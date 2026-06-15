"use client";

import AppImage from "@/components/ui/AppImage";
import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/profile";
import ImagePicker from "@/components/ImagePicker";
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
  aboutStatement: "",
  aboutParagraphs: [],
  aboutStats: [],
  social: { facebook: "", youtube: "", tiktok: "", zalo: "", instagram: "" },
};

const MAX_STATS = 5;

export default function ProfileEditor() {
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
  function updateSocial(key: keyof Profile["social"], value: string) {
    setProfile((p) => ({ ...p, social: { ...p.social, [key]: value } }));
  }

  // ---- About: đoạn mô tả ----
  function updateParagraph(i: number, value: string) {
    setProfile((p) => {
      const arr = [...(p.aboutParagraphs ?? [])];
      arr[i] = value;
      return { ...p, aboutParagraphs: arr };
    });
  }
  function addParagraph() {
    setProfile((p) => ({
      ...p,
      aboutParagraphs: [...(p.aboutParagraphs ?? []), ""],
    }));
  }
  function removeParagraph(i: number) {
    setProfile((p) => ({
      ...p,
      aboutParagraphs: (p.aboutParagraphs ?? []).filter((_, j) => j !== i),
    }));
  }

  // ---- About: stats ----
  function updateStat(i: number, key: "n" | "l", value: string) {
    setProfile((p) => {
      const arr = [...(p.aboutStats ?? [])];
      arr[i] = { ...arr[i], [key]: value };
      return { ...p, aboutStats: arr };
    });
  }
  function addStat() {
    setProfile((p) => {
      const cur = p.aboutStats ?? [];
      if (cur.length >= MAX_STATS) return p;
      return { ...p, aboutStats: [...cur, { n: "", l: "" }] };
    });
  }
  function removeStat(i: number) {
    setProfile((p) => ({
      ...p,
      aboutStats: (p.aboutStats ?? []).filter((_, j) => j !== i),
    }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveProfile(profile);
      setMessage({ type: "ok", text: "Đã lưu thông tin." });
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

  return (
    <form onSubmit={onSave} className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-6">
      <div className="adm-card space-y-4">
        <p className="adm-label">Ảnh đại diện</p>
        <div className="adm-thumb relative aspect-square w-full">
          {profile.avatarUrl ? (
            <AppImage
              src={profile.avatarUrl}
              alt="Avatar"
              fill
              sizes="280px"
              className="object-cover"
            />
          ) : (
            <div className="adm-muted flex h-full items-center justify-center text-xs">
              Chưa có ảnh
            </div>
          )}
        </div>
        <ImagePicker
          triggerLabel="Chọn ảnh"
          onSelect={(imgs) => imgs[0] && update("avatarUrl", imgs[0].url)}
        />
      </div>
      </div>

      <div className="space-y-6">
        <div className="adm-card space-y-4">
          <h2 className="adm-h2">
            Thông tin cơ bản
          </h2>

          <Field label="Họ và tên" id="fullName">
            <input
              id="fullName"
              className="adm-input"
              value={profile.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
          </Field>

          <Field label="Giới thiệu ngắn" id="bio">
            <textarea
              id="bio"
              className="adm-input h-28"
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Một vài câu mô tả bản thân, phong cách chụp ảnh..."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Email" id="email">
              <input
                id="email"
                type="email"
                className="adm-input"
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </Field>
            <Field label="Số điện thoại" id="phone">
              <input
                id="phone"
                className="adm-input"
                value={profile.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="adm-card space-y-4">
          <h2 className="adm-h2">
            Mạng xã hội
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Facebook" id="facebook">
              <input
                id="facebook"
                className="adm-input"
                placeholder="https://facebook.com/..."
                value={profile.social.facebook ?? ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
              />
            </Field>
            <Field label="YouTube" id="youtube">
              <input
                id="youtube"
                className="adm-input"
                placeholder="https://youtube.com/@..."
                value={profile.social.youtube ?? ""}
                onChange={(e) => updateSocial("youtube", e.target.value)}
              />
            </Field>
            <Field label="TikTok" id="tiktok">
              <input
                id="tiktok"
                className="adm-input"
                placeholder="https://tiktok.com/@..."
                value={profile.social.tiktok ?? ""}
                onChange={(e) => updateSocial("tiktok", e.target.value)}
              />
            </Field>
            <Field label="Zalo" id="zalo">
              <input
                id="zalo"
                className="adm-input"
                placeholder="https://zalo.me/..."
                value={profile.social.zalo ?? ""}
                onChange={(e) => updateSocial("zalo", e.target.value)}
              />
            </Field>
            <Field label="Instagram" id="instagram">
              <input
                id="instagram"
                className="adm-input"
                placeholder="https://instagram.com/..."
                value={profile.social.instagram ?? ""}
                onChange={(e) => updateSocial("instagram", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="adm-card space-y-5">
          <h2 className="adm-h2">Phần “Giới thiệu” (trang chủ)</h2>

          <Field label="Câu giới thiệu lớn" id="aboutStatement">
            <textarea
              id="aboutStatement"
              className="adm-input h-24"
              placeholder="Tôi tìm những khoảnh khắc *thật* — ..."
              value={profile.aboutStatement ?? ""}
              onChange={(e) => update("aboutStatement", e.target.value)}
            />
            <p className="adm-muted text-[11px]">
              Đặt từ/cụm trong dấu sao <code>*như này*</code> để in nghiêng màu
              vàng (gold). Bỏ trống sẽ dùng câu mặc định.
            </p>
          </Field>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="adm-label">Đoạn mô tả</span>
              <button
                type="button"
                className="adm-link text-xs"
                onClick={addParagraph}
              >
                + Thêm đoạn
              </button>
            </div>
            {(profile.aboutParagraphs ?? []).length === 0 ? (
              <p className="adm-muted text-xs">
                Chưa có đoạn nào — sẽ dùng 2 đoạn mặc định. Thêm đoạn để tự viết.
              </p>
            ) : (
              (profile.aboutParagraphs ?? []).map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    className="adm-input h-20"
                    placeholder={`Đoạn ${i + 1}...`}
                    value={para}
                    onChange={(e) => updateParagraph(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="adm-btn-danger shrink-0 text-xs"
                    title="Xoá đoạn"
                  >
                    Xoá
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="adm-label">
                Số liệu thống kê ({(profile.aboutStats ?? []).length}/{MAX_STATS})
              </span>
              <button
                type="button"
                className="adm-link text-xs"
                onClick={addStat}
                disabled={(profile.aboutStats ?? []).length >= MAX_STATS}
                style={
                  (profile.aboutStats ?? []).length >= MAX_STATS
                    ? { opacity: 0.4, cursor: "not-allowed" }
                    : undefined
                }
              >
                + Thêm số liệu
              </button>
            </div>
            {(profile.aboutStats ?? []).length === 0 ? (
              <p className="adm-muted text-xs">
                Chưa có số liệu — sẽ dùng bộ mặc định (Dự án / Khách hàng / Năm KN
                / Giải thưởng).
              </p>
            ) : (
              (profile.aboutStats ?? []).map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="adm-input"
                    style={{ maxWidth: 110 }}
                    placeholder="240"
                    value={s.n}
                    onChange={(e) => updateStat(i, "n", e.target.value)}
                  />
                  <input
                    className="adm-input"
                    placeholder="Dự án hoàn thành"
                    value={s.l}
                    onChange={(e) => updateStat(i, "l", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="adm-btn-danger shrink-0 text-xs"
                    title="Xoá"
                  >
                    Xoá
                  </button>
                </div>
              ))
            )}
          </div>
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
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="adm-label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
