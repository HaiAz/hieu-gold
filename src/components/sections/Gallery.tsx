import type { ProjectImage } from "@/lib/types";
import GalleryImage from "./GalleryImage";

export default function Gallery({ images }: { images: ProjectImage[] }) {
  return (
    <section className="gallery pad" id="gallery" data-screen-label="Gallery">
      <div className="gal-head">
        <span className="eyebrow reveal">Tuyển tập hình ảnh</span>
        <h2 className="reveal-lines">
          <em>Gallery</em>
        </h2>
      </div>

      {images.length > 0 ? (
        <div className="masonry" id="masonry">
          {images.map((img, index) => (
            <GalleryImage
              key={img.path || img.url}
              image={img}
              all={images}
              index={index}
            />
          ))}
        </div>
      ) : null}

      <style>{`
        .gallery {
          --pad-x: clamp(20px, 5vw, 72px);
          position: relative;
          background: var(--cream);
          color: var(--pf-ink);
          font-family: var(--pf-sans);
          padding-left: var(--pad-x);
          padding-right: var(--pad-x);
          padding-top: clamp(90px, 14vh, 180px);
          padding-bottom: clamp(90px, 14vh, 180px);
        }
        .gallery img { display: block; max-width: 100%; }

        .gal-head {
          text-align: center;
          margin-bottom: clamp(48px, 8vh, 90px);
        }
        .gal-head .eyebrow {
          font-size: 11px;
          letter-spacing: .32em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--gold);
          display: block;
        }
        .gal-head h2 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(46px, 9vw, 140px);
          /* line-height rộng + padding để descender chữ 'y' (italic) không bị cắt */
          line-height: 1.1;
          padding-bottom: .12em;
        }
        .gal-head h2 em {
          font-style: italic;
          color: var(--gold);
          display: inline-block;
          padding: 0 .08em;
        }

        /* Masonry thật bằng CSS columns: ảnh giữ tỉ lệ gốc, xếp khít so le.
           Ảnh chảy theo cột (trên → dưới → sang cột kế). */
        .masonry {
          column-count: 4;
          column-gap: clamp(8px, 0.9vw, 14px);
          max-width: 1400px;
          margin: 0 auto;
        }
        .gimg {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: block;
          width: 100%;
          margin-bottom: clamp(8px, 0.9vw, 14px);
          break-inside: avoid;
          border-radius: 8px;
        }
        .gimg img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform .9s cubic-bezier(.2,.8,.2,1);
        }
        .gimg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(20,16,11,.5));
          opacity: 0;
          transition: opacity .5s;
        }
        .gimg:hover img { transform: scale(1.06); }
        .gimg:hover::after { opacity: 1; }

        /* Desktop 4 cột; tablet 3; mobile 2 (giữ masonry so le, không xuống 1 cột). */
        @media (max-width: 1100px) { .masonry { column-count: 3; } }
        @media (max-width: 760px)  { .masonry { column-count: 2; } }
      `}</style>
    </section>
  );
}
