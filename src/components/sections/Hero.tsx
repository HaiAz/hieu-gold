import AppImage from "@/components/ui/AppImage";
import type { Profile } from "@/lib/types";

export default function Hero({ profile }: { profile: Profile | null }) {
  const fullName = profile?.fullName?.trim() || "Minh Hiếu";
  const parts = fullName.split(/\s+/);
  const firstLine = parts.length > 1 ? parts.slice(0, -1).join(" ") : fullName;
  const lastLine = parts.length > 1 ? parts.slice(-1).join(" ") : "";

  // Ảnh banner Hero: desktop (ngang) + mobile (dọc), fallback dần về avatar.
  const heroDesktop = profile?.heroImageUrl || profile?.avatarUrl || "";
  const heroMobile =
    profile?.heroImageMobileUrl || profile?.heroImageUrl || profile?.avatarUrl || "";

  // Vị trí cắt dọc (0–100%), mặc định 50% (giữa).
  const focusY = profile?.heroFocusY ?? 50;
  const focusYMobile = profile?.heroFocusYMobile ?? 50;
  const figureStyle = {
    "--hero-focus-desktop": `${focusY}%`,
    "--hero-focus-mobile": `${focusYMobile}%`,
  } as React.CSSProperties;

  return (
    <header className="hero pad" id="top" data-screen-label="Hero">
      <div className="hero-top">
        <div className="hero-meta reveal">
          <span className="eyebrow">Nhiếp ảnh gia · Film &amp; Chân dung</span>
          {profile?.bio ||
            "Kể chuyện bằng ánh sáng tự nhiên và sắc màu film ấm. Đặt tại Hà Nội — nhận dự án toàn quốc."}
        </div>
        <div className="hero-meta reveal" style={{ textAlign: "right" }}>
          <span className="eyebrow">Est. 2016</span>
          Chân dung · Cưới · Editorial · Du lịch
        </div>
      </div>

      <h1 id="heroTitle">
        <span className="ln">
          <span>{firstLine}</span>
        </span>
        {lastLine ? (
          <span className="ln">
            <span>
              <em>{lastLine}</em>
            </span>
          </span>
        ) : null}
      </h1>

      <div className="hero-figure clip-wrap" id="heroFig" style={figureStyle}>
        {heroDesktop ? (
          <AppImage
            className="film-img hero-img-desktop"
            id="heroImg"
            src={heroDesktop}
            alt="Tác phẩm tiêu biểu"
            fill
            sizes="(max-width: 768px) 0px, calc(100vw - 2 * clamp(20px, 5vw, 72px))"
            priority
          />
        ) : null}
        {heroMobile ? (
          <AppImage
            className="film-img hero-img-mobile"
            src={heroMobile}
            alt="Tác phẩm tiêu biểu"
            fill
            sizes="(max-width: 768px) calc(100vw - 2 * clamp(20px, 5vw, 72px)), 0px"
            priority
          />
        ) : null}
        <span className="cap">Some memories never fade ✨</span>
      </div>

      <div className="scroll-cue reveal">
        <span className="bar" />
        Cuộn để khám phá
      </div>

      <style>{`
        .hero {
          --pad-x: clamp(20px, 5vw, 72px);
          position: relative;
          background: var(--cream);
          color: var(--pf-ink);
          font-family: var(--pf-sans);
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
          height: 100svh;
          min-height: 560px;
          display: flex;
          flex-direction: column;
          padding-left: var(--pad-x);
          padding-right: var(--pad-x);
          padding-top: clamp(84px, 11vh, 116px);
          padding-bottom: clamp(20px, 3vh, 36px);
        }
        .hero ::selection { background: var(--gold); color: var(--cream); }

        .hero .eyebrow {
          font-size: 11px;
          letter-spacing: .32em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--gold);
        }
        .hero .film-img {
          filter: saturate(.82) contrast(1.06) sepia(.1) brightness(.99);
        }
        .hero .clip-wrap { overflow: hidden; }

        .hero-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: clamp(10px, 2vh, 22px);
        }
        .hero-meta {
          max-width: 340px;
          font-size: 15px;
          line-height: 1.55;
          color: var(--pf-muted);
        }
        .hero-meta .eyebrow { margin-bottom: 14px; display: block; }

        .hero h1 {
          font-family: var(--serif);
          font-weight: 500;
          /* Nới line-height để dấu thanh tiếng Việt không đè dòng trên. */
          line-height: 1.12;
          /* Co theo chiều rộng chữ dài nhất để tên dài không bị cắt mép.
             Giảm cỡ để nhường chỗ cho ảnh banner to hơn. */
          font-size: clamp(30px, min(7.5vw, 11vh), 96px);
          text-transform: uppercase;
          margin: 0;
          max-width: 100%;
        }
        .hero h1 .ln {
          display: block;
        }
        /* Cho phép xuống dòng + ngắt từ dài, không tràn khung. */
        .hero h1 .ln > span {
          display: block;
          overflow-wrap: anywhere;
          word-break: break-word;
          hyphens: auto;
        }
        .hero h1 em { font-style: italic; font-weight: 400; color: var(--gold); }

        .hero-figure {
          position: relative;
          width: 100%;
          /* Lấp phần chiều cao còn lại để hero vừa đúng 1 màn hình (100svh). */
          flex: 1 1 0;
          min-height: 120px;
          margin-top: clamp(16px, 2.6vh, 32px);
          overflow: hidden;
        }
        .hero-figure img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-figure .hero-img-desktop {
          object-position: 50% var(--hero-focus-desktop, 50%);
        }
        .hero-figure .hero-img-mobile {
          object-position: 50% var(--hero-focus-mobile, 50%);
        }
        /* >768px: ảnh ngang (desktop). ≤768px: ảnh dọc (mobile). */
        .hero-figure .hero-img-mobile { display: none; }
        @media (max-width: 768px) {
          .hero-figure .hero-img-desktop { display: none; }
          .hero-figure .hero-img-mobile { display: block; }
        }
        .hero-figure .cap {
          position: absolute;
          left: 24px;
          bottom: 20px;
          color: #f3ede1;
          font-size: 12px;
          letter-spacing: .18em;
          text-transform: uppercase;
          mix-blend-mode: difference;
          z-index: 1;
        }

        .scroll-cue {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: .26em;
          text-transform: uppercase;
          color: var(--pf-muted);
          margin-top: clamp(12px, 1.8vh, 20px);
        }
        .scroll-cue .bar {
          width: 54px;
          height: 1px;
          background: var(--pf-muted);
          position: relative;
          overflow: hidden;
        }
        .scroll-cue .bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-100%);
          animation: hero-slide 2.4s infinite;
        }
        @keyframes hero-slide {
          0% { transform: translateX(-100%); }
          60%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
}
