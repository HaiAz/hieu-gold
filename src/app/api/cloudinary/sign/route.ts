import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const ROOT = "hieu-gold";

/** Chuẩn hoá folder: luôn nằm dưới ROOT, chỉ cho phép chữ/số/-/_/ và '/'. */
function safeFolder(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) return ROOT;
  let f = input.trim().replace(/^\/+|\/+$/g, "");
  // bỏ tiền tố ROOT nếu client đã gửi kèm
  if (f === ROOT) return ROOT;
  if (f.startsWith(ROOT + "/")) f = f.slice(ROOT.length + 1);
  // mỗi segment chỉ giữ ký tự an toàn
  const segs = f
    .split("/")
    .map((s) => s.replace(/[^a-zA-Z0-9-_ ]/g, "").trim())
    .filter(Boolean);
  return segs.length ? `${ROOT}/${segs.join("/")}` : ROOT;
}

export async function POST(req: Request) {
  // 1. Lấy ID token từ header
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json(
      { error: "Thiếu Authorization header." },
      { status: 401 }
    );
  }

  // 2. Verify ID token với Firebase Admin
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

  // 3. Kiểm tra UID có nằm trong collection admins không
  const adminDoc = await adminDb.doc(`admins/${uid}`).get();
  if (!adminDoc.exists) {
    return NextResponse.json(
      { error: "Tài khoản không có quyền admin." },
      { status: 403 }
    );
  }

  // 4. Sinh signature
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Server thiếu Cloudinary secrets. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong .env.",
      },
      { status: 500 }
    );
  }

  // Folder đích (mặc định ROOT, hoặc folder con do client chọn/tạo).
  const body = await req.json().catch(() => ({}));
  const folder = safeFolder((body as { folder?: string }).folder);

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature: SHA-1 của các param được sort alphabet, nối api_secret cuối.
  // Params được ký phải khớp 100% với những gì client gửi lên Cloudinary.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
