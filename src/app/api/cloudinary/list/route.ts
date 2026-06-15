import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ROOT = "hieu-gold";

function safeFolder(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) return ROOT;
  let f = input.trim().replace(/^\/+|\/+$/g, "");
  if (f === ROOT) return ROOT;
  if (f.startsWith(ROOT + "/")) f = f.slice(ROOT.length + 1);
  const segs = f
    .split("/")
    .map((s) => s.replace(/[^a-zA-Z0-9-_ ]/g, "").trim())
    .filter(Boolean);
  return segs.length ? `${ROOT}/${segs.join("/")}` : ROOT;
}

async function requireAdmin(req: Request): Promise<string | NextResponse> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json(
      { error: "Thiếu Authorization header." },
      { status: 401 }
    );
  }
  // Import động: firebase-admin throw ngay khi import nếu thiếu env, nên bọc
  // try/catch để trả message rõ ràng thay vì 500 body rỗng.
  let adminAuth, adminDb;
  try {
    ({ adminAuth, adminDb } = await import("@/lib/firebase-admin"));
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Server chưa cấu hình Firebase Admin: " +
          (err instanceof Error ? err.message : String(err)),
      },
      { status: 500 }
    );
  }
  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Token không hợp lệ: " +
          (err instanceof Error ? err.message : String(err)),
      },
      { status: 401 }
    );
  }
  const adminDoc = await adminDb.doc(`admins/${uid}`).get();
  if (!adminDoc.exists) {
    return NextResponse.json(
      { error: "Tài khoản không có quyền admin." },
      { status: 403 }
    );
  }
  return uid;
}

type CloudinaryResource = {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  created_at?: string;
};

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server thiếu Cloudinary secrets." },
      { status: 500 }
    );
  }

  const folder = safeFolder(new URL(req.url).searchParams.get("folder"));
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const base = `https://api.cloudinary.com/v1_1/${cloudName}`;
  const headers = { Authorization: `Basic ${auth}` };

  // Ảnh trong folder (dùng asset_folder để không lẫn ảnh ở folder con).
  const imagesUrl =
    `${base}/resources/by_asset_folder` +
    `?asset_folder=${encodeURIComponent(folder)}` +
    `&max_results=100`;
  // Danh sách subfolder của folder hiện tại.
  const foldersUrl = `${base}/folders/${encodeURIComponent(folder)}`;

  try {
    const [imgRes, folderRes] = await Promise.all([
      fetch(imagesUrl, { headers, cache: "no-store" }),
      fetch(foldersUrl, { headers, cache: "no-store" }),
    ]);

    if (!imgRes.ok) {
      const body = await imgRes.text();
      return NextResponse.json(
        { error: `Cloudinary list failed: HTTP ${imgRes.status} ${body}` },
        { status: 502 }
      );
    }
    const data = (await imgRes.json()) as { resources?: CloudinaryResource[] };
    const images = (data.resources ?? []).map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    }));

    // Subfolders (nếu API folders lỗi vẫn trả ảnh, folders rỗng).
    let folders: { name: string; path: string }[] = [];
    if (folderRes.ok) {
      const fdata = (await folderRes.json()) as {
        folders?: { name: string; path: string }[];
      };
      folders = (fdata.folders ?? []).map((f) => ({
        name: f.name,
        path: f.path,
      }));
    }

    return NextResponse.json({ folder, images, folders });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Lỗi gọi Cloudinary: " +
          (err instanceof Error ? err.message : String(err)),
      },
      { status: 502 }
    );
  }
}
