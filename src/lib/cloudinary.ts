import { auth } from "./firebase";

export type UploadResult = {
  url: string;
  publicId: string;
};

export type CloudinaryAsset = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export type CloudinaryFolder = { name: string; path: string };

export type ListResult = {
  folder: string;
  images: CloudinaryAsset[];
  folders: CloudinaryFolder[];
};

/**
 * Liệt kê ảnh + subfolder trong một folder Cloudinary (mặc định hieu-gold).
 * Đi qua /api/cloudinary/list (server giữ API secret, verify admin).
 */
export async function listImages(folder?: string): Promise<ListResult> {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập admin để xem thư viện ảnh.");
  const idToken = await user.getIdToken();
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : "";
  const res = await fetch(`/api/cloudinary/list${qs}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Tải thư viện ảnh thất bại: HTTP ${res.status}`);
  }
  return (await res.json()) as ListResult;
}

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

async function fetchSignature(folder?: string): Promise<SignResponse> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Bạn cần đăng nhập admin để upload ảnh.");
  }
  const idToken = await user.getIdToken();
  const res = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folder: folder ?? "" }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error ?? `Xin chữ ký thất bại: HTTP ${res.status}`
    );
  }
  return (await res.json()) as SignResponse;
}

/**
 * Upload qua signed flow:
 *   1) Browser gọi /api/cloudinary/sign kèm Firebase ID token
 *   2) Server verify token, kiểm tra admin, trả về { signature, timestamp, apiKey, ... }
 *   3) Browser POST file + các param đã ký lên Cloudinary
 *
 * API_SECRET không bao giờ xuống browser.
 */
export function uploadFile(
  file: File,
  onProgress?: (percent: number) => void,
  folder?: string
): Promise<UploadResult> {
  return new Promise(async (resolve, reject) => {
    let sig: SignResponse;
    try {
      sig = await fetchSignature(folder);
    } catch (err) {
      reject(err);
      return;
    }

    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("signature", sig.signature);
    fd.append("folder", sig.folder);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.((e.loaded / e.total) * 100);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText) as {
            secure_url: string;
            public_id: string;
          };
          resolve({ url: res.secure_url, publicId: res.public_id });
        } catch (err) {
          reject(err);
        }
      } else {
        let message = `Cloudinary upload failed: HTTP ${xhr.status}`;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err?.error?.message) message = err.error.message;
        } catch {
          /* ignore */
        }
        console.error("[cloudinary] upload failed", {
          status: xhr.status,
          body: xhr.responseText,
        });
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Lỗi mạng khi upload lên Cloudinary."))
    );

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`
    );
    xhr.send(fd);
  });
}

/**
 * Cloudinary deletion cần API secret server-side. Tạm thời bỏ qua, ảnh
 * orphaned vẫn ở Cloudinary (25GB free). Dọn thủ công trong Media Library
 * nếu cần. Có thể thêm /api/cloudinary/delete tương tự sau.
 */
export async function deleteImage(publicId: string): Promise<void> {
  console.warn(
    "[cloudinary] deleteImage no-op — ảnh ở lại Cloudinary, xoá thủ công trong Media Library.",
    publicId
  );
}
