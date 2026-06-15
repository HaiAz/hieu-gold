"use client";

import AppImage from "@/components/ui/AppImage";
import { useLightbox, type LightboxImage } from "@/components/lightbox/LightboxProvider";

export default function GalleryImage({
  image,
  all,
  index,
}: {
  image: LightboxImage;
  all: LightboxImage[];
  index: number;
}) {
  const { open } = useLightbox();
  return (
    <div className="gimg" onClick={() => open(all, index)}>
      <AppImage
        className="film-img"
        src={image.url}
        alt=""
        width={image.width || 800}
        height={image.height || 1000}
        sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw"
      />
    </div>
  );
}
