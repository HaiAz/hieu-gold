"use client";

import AppImage from "@/components/ui/AppImage";
import { useLightbox, type LightboxImage } from "@/components/lightbox/LightboxProvider";

/**
 * Lưới ảnh chi tiết dự án (masonry) — click để phóng to qua Lightbox.
 * Cover + images gộp chung 1 danh sách để điều hướng prev/next liền mạch.
 */
export default function ProjectGallery({
  cover,
  images,
  alt,
}: {
  cover?: LightboxImage | null;
  images: LightboxImage[];
  alt: string;
}) {
  const { open } = useLightbox();
  // Danh sách dùng cho lightbox: cover (nếu có) đứng đầu, rồi tới các ảnh.
  const all: LightboxImage[] = cover ? [cover, ...images] : images;

  return (
    <>
      {cover ? (
        <button
          type="button"
          className="pd-cover"
          onClick={() => open(all, 0)}
          aria-label="Phóng to ảnh bìa"
        >
          <AppImage
            className="film-img"
            src={cover.url}
            alt={alt}
            fill
            sizes="(max-width: 1400px) 100vw, 1400px"
            priority
          />
        </button>
      ) : null}

      {images.length > 0 ? (
        <div className="pd-masonry">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.url}
              className="pd-cell"
              onClick={() => open(all, cover ? i + 1 : i)}
              aria-label="Phóng to ảnh"
            >
              <AppImage
                className="film-img"
                src={img.url}
                alt={alt}
                width={img.width || 800}
                height={img.height || 1000}
                sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="pd-empty">Chưa có ảnh trong dự án này.</p>
      )}
    </>
  );
}
