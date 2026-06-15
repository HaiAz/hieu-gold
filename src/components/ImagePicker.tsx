"use client";

import AppImage from "@/components/ui/AppImage";
import { useCallback, useEffect, useState } from "react";
import {
  listImages,
  uploadFile,
  type CloudinaryAsset,
  type CloudinaryFolder,
} from "@/lib/cloudinary";

const ROOT = "hieu-gold";
type Tab = "upload" | "library";

export type PickedImage = { url: string; publicId: string };

export default function ImagePicker({
  triggerLabel = "Chọn ảnh",
  triggerClassName = "adm-btn-outline w-full cursor-pointer",
  multiple = false,
  onSelect,
}: {
  triggerLabel?: string;
  triggerClassName?: string;
  /** Cho phép chọn nhiều ảnh từ thư viện / upload nhiều file. */
  multiple?: boolean;
  /** Trả về danh sách ảnh đã chọn (luôn là mảng, kể cả 1 ảnh). */
  onSelect: (images: PickedImage[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("library");

  // upload state
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // library state
  const [assets, setAssets] = useState<CloudinaryAsset[] | null>(null);
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [curFolder, setCurFolder] = useState<string>(ROOT);
  const [loadingLib, setLoadingLib] = useState(false);
  const [libError, setLibError] = useState<string | null>(null);
  // map publicId -> PickedImage để giữ cả url lẫn publicId khi chọn nhiều
  const [picked, setPicked] = useState<Map<string, PickedImage>>(new Map());
  // tạo folder mới
  const [newFolder, setNewFolder] = useState("");

  const loadLibrary = useCallback(async (folder: string) => {
    setLoadingLib(true);
    setLibError(null);
    try {
      const res = await listImages(folder);
      setAssets(res.images);
      setFolders(res.folders);
      setCurFolder(res.folder);
    } catch (err) {
      setLibError(err instanceof Error ? err.message : "Tải thư viện thất bại.");
      setAssets([]);
    } finally {
      setLoadingLib(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "library" && assets === null && !loadingLib) {
      loadLibrary(curFolder);
    }
  }, [open, tab, assets, loadingLib, loadLibrary, curFolder]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setPicked(new Map());
    setProgress(0);
    setNewFolder("");
  }

  // Folder đích để upload: nếu đang nhập tên folder mới thì ghép vào folder hiện tại.
  function uploadTarget(): string {
    const sub = newFolder.trim().replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
    return sub ? `${curFolder}/${sub}` : curFolder;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const target = uploadTarget();
    setUploading(true);
    setProgress(0);
    try {
      const out: PickedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const r = await uploadFile(
          files[i],
          (p) => setProgress(Math.round(p)),
          target
        );
        out.push({ url: r.url, publicId: r.publicId });
        if (!multiple) break;
      }
      onSelect(out);
      // refresh library so ảnh mới upload xuất hiện ở tab thư viện
      setAssets(null);
      close();
    } catch (err) {
      setLibError(err instanceof Error ? err.message : "Upload thất bại.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function openFolder(path: string) {
    setAssets(null);
    setPicked(new Map());
    loadLibrary(path);
  }

  // Folder cha (để nút "lên một cấp"); null nếu đang ở ROOT.
  const parentFolder =
    curFolder === ROOT ? null : curFolder.split("/").slice(0, -1).join("/") || ROOT;

  function toggle(a: CloudinaryAsset) {
    if (!multiple) {
      onSelect([{ url: a.url, publicId: a.publicId }]);
      close();
      return;
    }
    setPicked((prev) => {
      const next = new Map(prev);
      if (next.has(a.publicId)) next.delete(a.publicId);
      else next.set(a.publicId, { url: a.url, publicId: a.publicId });
      return next;
    });
  }

  function confirmMulti() {
    if (picked.size === 0) return;
    onSelect(Array.from(picked.values()));
    close();
  }

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="ip-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="ip-modal" role="dialog" aria-modal="true">
            <div className="ip-head">
              <div className="ip-tabs">
                <button
                  type="button"
                  className={`ip-tab ${tab === "library" ? "ip-tab-on" : ""}`}
                  onClick={() => setTab("library")}
                >
                  Thư viện Cloudinary
                </button>
                <button
                  type="button"
                  className={`ip-tab ${tab === "upload" ? "ip-tab-on" : ""}`}
                  onClick={() => setTab("upload")}
                >
                  Tải ảnh mới
                </button>
              </div>
              <button type="button" className="ip-close" onClick={close}>
                Đóng ✕
              </button>
            </div>

            <div className="ip-body">
              {tab === "library" ? (
                <div className="space-y-4">
                  {/* thanh folder: breadcrumb + lên cấp */}
                  <div className="ip-folderbar">
                    <span className="ip-crumb">📁 {curFolder}</span>
                    {parentFolder ? (
                      <button
                        type="button"
                        className="ip-folderbtn"
                        onClick={() => openFolder(parentFolder)}
                      >
                        ↑ Lên cấp
                      </button>
                    ) : null}
                  </div>

                  {loadingLib ? (
                    <p className="adm-muted text-sm">Đang tải thư viện...</p>
                  ) : libError ? (
                    <div className="space-y-3">
                      <p className="adm-alert-err">{libError}</p>
                      <button
                        type="button"
                        className="adm-btn-outline"
                        onClick={() => loadLibrary(curFolder)}
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* subfolders */}
                      {folders.length > 0 ? (
                        <div className="ip-folders">
                          {folders.map((f) => (
                            <button
                              type="button"
                              key={f.path}
                              className="ip-folder"
                              onClick={() => openFolder(f.path)}
                            >
                              📁 {f.name}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {/* ảnh */}
                      {assets && assets.length > 0 ? (
                        <div className="ip-grid">
                          {assets.map((a) => (
                            <button
                              type="button"
                              key={a.publicId}
                              className={`ip-cell ${picked.has(a.publicId) ? "ip-cell-on" : ""}`}
                              onClick={() => toggle(a)}
                            >
                              <AppImage
                                src={a.url}
                                alt=""
                                fill
                                sizes="160px"
                                className="object-cover"
                              />
                              {picked.has(a.publicId) ? (
                                <span className="ip-check">✓</span>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      ) : folders.length === 0 ? (
                        <p className="adm-muted text-sm">
                          Folder này chưa có ảnh. Hãy mở folder con hoặc tải ảnh mới.
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="adm-label">Tải vào folder</label>
                    <div className="ip-crumb">📁 {curFolder}</div>
                    <p className="adm-muted text-[11px]">
                      Chọn folder ở tab “Thư viện Cloudinary”, hoặc nhập tên bên dưới để tạo folder con mới.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="adm-label" htmlFor="ip-newfolder">
                      Tạo folder con mới (tuỳ chọn)
                    </label>
                    <input
                      id="ip-newfolder"
                      className="adm-input"
                      placeholder="vd: wedding, event-2026..."
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      disabled={uploading}
                    />
                    {newFolder.trim() ? (
                      <p className="adm-muted text-[11px]">
                        Ảnh sẽ vào: <strong>{uploadTarget()}</strong>
                      </p>
                    ) : null}
                  </div>

                  <label className="adm-btn-outline inline-flex cursor-pointer">
                    {uploading
                      ? `Đang tải lên... ${progress}%`
                      : multiple
                        ? "Chọn ảnh từ máy (có thể nhiều)"
                        : "Chọn ảnh từ máy"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple={multiple}
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                  {uploading ? (
                    <div className="adm-progress-track">
                      <div
                        className="adm-progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {multiple && tab === "library" ? (
              <div className="ip-foot">
                <span className="adm-muted text-xs">Đã chọn {picked.size}</span>
                <button
                  type="button"
                  className="adm-btn"
                  onClick={confirmMulti}
                  disabled={picked.size === 0}
                >
                  Thêm ảnh đã chọn
                </button>
              </div>
            ) : null}
          </div>

          <style>{`
            .ip-overlay {
              position: fixed; inset: 0; z-index: 9800;
              background: rgba(20,16,11,.6);
              display: flex; align-items: center; justify-content: center;
              padding: 4vh 4vw;
            }
            .ip-modal {
              background: var(--cream);
              border: 1px solid var(--line);
              border-radius: 12px;
              width: 100%; max-width: 880px;
              max-height: 88vh;
              display: flex; flex-direction: column;
              overflow: hidden;
              font-family: var(--pf-sans);
            }
            .ip-head {
              display: flex; align-items: center; justify-content: space-between;
              gap: 16px; padding: 16px 20px;
              border-bottom: 1px solid var(--line);
            }
            .ip-tabs { display: flex; gap: 6px; }
            .ip-tab {
              padding: 8px 14px; border-radius: 999px;
              font-size: 13px; font-weight: 600; color: var(--pf-muted);
              cursor: pointer; border: 1px solid transparent;
            }
            .ip-tab-on {
              color: var(--gold); border-color: var(--gold);
              background: rgba(194,147,76,.08);
            }
            .ip-close {
              font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
              color: var(--pf-muted); cursor: pointer; white-space: nowrap;
            }
            .ip-close:hover { color: var(--gold); }
            .ip-body { padding: 20px; overflow: auto; }
            .ip-folderbar {
              display: flex; align-items: center; justify-content: space-between;
              gap: 12px; flex-wrap: wrap;
            }
            .ip-crumb {
              font-size: 13px; font-weight: 600; color: var(--pf-ink);
              word-break: break-all;
            }
            .ip-folderbtn {
              font-size: 12px; font-weight: 600; color: var(--gold);
              cursor: pointer; padding: 4px 10px; border-radius: 999px;
              border: 1px solid var(--line); white-space: nowrap;
            }
            .ip-folderbtn:hover { border-color: var(--gold); }
            .ip-folders {
              display: flex; flex-wrap: wrap; gap: 8px;
            }
            .ip-folder {
              font-size: 13px; font-weight: 500; color: var(--pf-ink);
              cursor: pointer; padding: 8px 14px; border-radius: 8px;
              border: 1px solid var(--line); background: #fffdf8;
              transition: border-color .2s, color .2s;
            }
            .ip-folder:hover { border-color: var(--gold); color: var(--gold); }
            .ip-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
              gap: 12px;
            }
            .ip-cell {
              position: relative; aspect-ratio: 1; cursor: pointer;
              border-radius: 6px; overflow: hidden;
              border: 2px solid transparent; background: var(--cream-2);
              padding: 0;
            }
            .ip-cell:hover { border-color: var(--gold-soft); }
            .ip-cell-on { border-color: var(--gold); }
            .ip-check {
              position: absolute; top: 6px; right: 6px;
              width: 24px; height: 24px; border-radius: 50%;
              background: var(--gold); color: var(--cream);
              display: flex; align-items: center; justify-content: center;
              font-size: 13px; font-weight: 700;
            }
            .ip-foot {
              display: flex; align-items: center; justify-content: space-between;
              gap: 16px; padding: 14px 20px; border-top: 1px solid var(--line);
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
