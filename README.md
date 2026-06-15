# HIEU.GOLD — Portfolio nhiếp ảnh

Next.js 16 + React 19 + Tailwind v4 + Firebase (Auth, Firestore) + Cloudinary (image hosting).

## Tính năng

- **Trang công khai**: giới thiệu bản thân, danh sách dự án, chi tiết dự án, liên hệ.
- **Trang quản trị `/admin`** chỉ admin có quyền truy cập:
  - Sửa thông tin cá nhân: họ tên, email, số điện thoại, social (Facebook, YouTube, TikTok, Zalo, Instagram), ảnh đại diện.
  - CRUD dự án (tiêu đề, mô tả, tags, ngày chụp, ảnh bìa, thư viện ảnh).
- **Lưu ảnh trên Cloudinary** (CDN miễn phí 25GB); URL được lưu trong Firestore (không dùng base64).
- **Phân quyền**: tài khoản có UID nằm trong collection `admins` mới được vào `/admin`.

## Cấu trúc thư mục

```
src/
  app/
    layout.tsx                  # Root layout + Header/Footer + AuthProvider
    page.tsx                    # Trang chủ (giới thiệu + dự án nổi bật)
    globals.css                 # Tailwind v4 + design tokens
    projects/
      page.tsx                  # Danh sách dự án (public)
      [id]/page.tsx             # Chi tiết dự án (public)
    contact/page.tsx            # Trang liên hệ
    login/page.tsx              # Đăng nhập admin
    setup/page.tsx              # Tạo super admin lần đầu
    admin/
      layout.tsx                # AdminGuard + nav admin
      page.tsx                  # Dashboard
      profile/page.tsx          # Sửa thông tin cá nhân
      projects/
        page.tsx                # Danh sách (admin)
        new/page.tsx
        [id]/page.tsx
  components/
    Header.tsx, Footer.tsx
    AdminGuard.tsx              # Client-side guard cho /admin
    SocialLinks.tsx
    ProjectForm.tsx             # Form dùng chung new + edit
  lib/
    firebase.ts                 # Firebase init (client)
    auth-context.tsx            # React context cho auth + isAdmin
    profile.ts                  # Đọc/ghi settings/profile
    projects.ts                 # CRUD projects + upload Storage
    types.ts
```

## Setup Firebase (bắt buộc)

Mở Firebase Console: https://console.firebase.google.com/project/hieu-gold

### 1. Bật Authentication
- **Authentication** → **Sign-in method** → bật **Email/Password**.

### 2. Bật Firestore
- **Firestore Database** → Create database → chọn region (vd. `asia-southeast1`).
- Vào tab **Rules**, dán nội dung sau và Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /settings/{doc} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /projects/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Bootstrap: cho phép user vừa đăng ký tự tạo record admin nếu chưa có admin nào.
    // Sau khi đã có admin, chỉ admin mới được sửa danh sách admin.
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update, delete: if isAdmin();
    }
  }
}
```

### 3. Cloudinary (thay cho Firebase Storage)

Project này dùng **signed upload**: client xin chữ ký từ Next.js API route (server-side, có check Firebase admin token), rồi mới upload lên Cloudinary. API secret KHÔNG bao giờ xuống browser.

#### 3.1 Đăng ký Cloudinary
1. https://cloudinary.com/users/register/free
2. Vào **Dashboard** → ghi nhớ **Cloud name** (dạng `dxxxxxxx`)
3. Sang **Settings ⚙️ → Security → API Keys** → copy `API Key` + `API Secret`

> **Lưu ý**: nếu trước đây bạn lỡ paste API secret vào nơi public, bấm **Regenerate** để tạo cặp mới.

#### 3.2 Service Account cho Firebase Admin

1. Mở https://console.firebase.google.com/project/hieu-gold/settings/serviceaccounts/adminsdk
2. Bấm **Generate new private key** → tải file JSON
3. Mở file JSON, copy 3 field: `project_id`, `client_email`, `private_key`
4. Dán vào `.env` (xem `.env.example`)

> `private_key` rất dài, có ký tự `\n`. **Giữ nguyên `\n`** (escape), bọc trong dấu nháy kép. Code tự thay `\n` thành newline thật khi đọc.

#### 3.3 Điền `.env`

```
FIREBASE_ADMIN_PROJECT_ID=hieu-gold
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@hieu-gold.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"

CLOUDINARY_CLOUD_NAME=dykrai5d1
CLOUDINARY_API_KEY=474555696614781
CLOUDINARY_API_SECRET=<secret_đã_rotate>
```

Restart dev server (`Ctrl+C` → `pnpm dev`) sau khi đổi env.

#### 3.4 Upload preset (KHÔNG cần nữa)

Với signed upload, không cần unsigned preset. Bạn có thể xoá `hieu-gold-unsigned` trên Cloudinary cho gọn.

#### Luồng signed upload

```
Browser (admin)
  │  1. POST /api/cloudinary/sign + Bearer <Firebase ID token>
  ▼
Next.js API route /api/cloudinary/sign
  │  - Verify ID token (firebase-admin)
  │  - Check uid có trong /admins/{uid}
  │  - Sign: SHA-1("folder=hieu-gold&timestamp=<now>" + API_SECRET)
  │  2. Trả { signature, timestamp, apiKey, cloudName, folder }
  ▼
Browser
  │  3. POST file + signed params → Cloudinary
  ▼
Cloudinary lưu ảnh, trả secure_url + public_id
```

> Ảnh không tự xoá khỏi Cloudinary khi xoá project (chưa làm route delete). Dọn thủ công trong Media Library nếu cần.

## Chạy local

```bash
pnpm install
pnpm dev
```

Mở http://localhost:3000.

`.env` đã được tạo sẵn với config Firebase của project `hieu-gold`. Nếu deploy nơi khác, copy `.env.example` → `.env` và điền.

## Tạo super admin (lần đầu)

1. Truy cập http://localhost:3000/setup
2. Form đã prefill:
   - Email: `hieugold@hieu-gold.com` (Firebase Auth bắt buộc email; đây là dạng email của username `hieugold`)
   - Mật khẩu: `123456789aA@`
3. Bấm **Tạo super admin** → tự động đăng nhập và chuyển vào `/admin`.

> Trang `/setup` sẽ khoá sau khi đã có admin. Để đổi mật khẩu, dùng Firebase Console → Authentication → Users.

## Sau khi setup

- `/admin/profile` — nhập họ tên, bio, email, SĐT, link social, ảnh đại diện.
- `/admin/projects/new` — thêm dự án + ảnh bìa + thư viện ảnh.

Ảnh được upload trực tiếp lên Firebase Storage; URL download lưu trong Firestore. `next/image` đã được cấu hình để optimize ảnh từ `firebasestorage.googleapis.com`.

## Ghi chú thiết kế

Toàn bộ design tokens (màu sắc, typography, spacing, shadow) theo file [`skills/design.md`](skills/design.md) — phong cách Behance-inspired: nền trắng, primary blue `#0057FF`, pill button, single sans-serif, max-width 1440px.

## Vì sao không lưu ảnh dạng base64?

- Firestore giới hạn **1 document = 1MB** → ảnh JPEG ~800KB sau base64 sẽ vượt giới hạn.
- Base64 lớn hơn binary ~33%, tốn băng thông, không có CDN, không optimize được bằng `next/image`.
- Cách chuẩn: lưu binary trên **Firebase Storage**, chỉ giữ `downloadURL` (chuỗi ngắn) trong Firestore — đó là cách project này đang dùng.
