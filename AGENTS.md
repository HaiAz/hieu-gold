<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hình ảnh: dùng `AppImage`, không dùng `next/image` trực tiếp

Mọi ảnh phải dùng `@/components/ui/AppImage` (wrapper quanh `next/image`) thay vì import `next/image` trực tiếp. Lý do: tránh lặp lại 2 cảnh báo của next/image.

- **`fill` thì BẮT BUỘC có `sizes`** — TypeScript sẽ báo lỗi nếu thiếu. Đặt `sizes` khớp bề rộng hiển thị thật (vd thumbnail `"280px"`, lưới 3 cột `"(max-width: 860px) 50vw, 33vw"`), KHÔNG mặc định `"100vw"` cho ảnh không full-width.
- **`priority`**: chỉ bật cho ảnh above-the-fold (ảnh lớn hiển thị ngay khi vào trang — thường 1 ảnh/trang, vd ảnh hero, ảnh cover trang chi tiết). AppImage tự thêm `fetchPriority="high"` khi `priority`. KHÔNG bật priority cho mọi ảnh (preload tất cả → chậm + sai). Ảnh trong lưới/lightbox/lazy KHÔNG đặt priority.
