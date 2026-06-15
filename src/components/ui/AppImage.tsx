import Image, { type ImageProps } from "next/image";

/**
 * Wrapper mỏng quanh next/image với default an toàn để tránh hai cảnh báo
 * thường gặp:
 *
 *  - "fill + sizes 100vw nhưng ảnh không full-width" → buộc khai báo `sizes`
 *    (TypeScript bắt lỗi nếu quên ở ảnh fill), không mặc định 100vw.
 *  - "ảnh là LCP, thêm priority" → dùng prop `priority` cho ảnh above-the-fold;
 *    khi bật, tự thêm fetchPriority="high" để trình duyệt ưu tiên đúng.
 *
 * KHÔNG auto-bật priority cho mọi ảnh: nếu mọi ảnh đều priority thì trình duyệt
 * preload tất cả → chậm hơn. Chỉ ảnh đầu trang (1 ảnh) mới nên priority.
 */

type FillImage = Omit<ImageProps, "width" | "height"> & {
  fill: true;
  sizes: string; // bắt buộc khi fill
};
type SizedImage = Omit<ImageProps, "fill"> & {
  fill?: false;
};

export type AppImageProps = FillImage | SizedImage;

export default function AppImage(props: AppImageProps) {
  const { priority, ...rest } = props;
  return (
    <Image
      {...rest}
      priority={priority}
      // next/image bỏ qua fetchPriority khi không priority; set rõ cho ảnh LCP.
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
