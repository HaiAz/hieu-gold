import AppImage from "@/components/ui/AppImage";
import type { Profile, Project } from "@/lib/types";

type Stat = { n: string; l: string };

export default function About({
  profile,
  projects,
}: {
  profile: Profile | null;
  projects: Project[];
}) {
  const stats: Stat[] = [
    { n: String(projects.length || 240), l: "Dự án hoàn thành" },
    { n: "58", l: "Khách hàng thương hiệu" },
    { n: "10", l: "Năm kinh nghiệm" },
    { n: "14", l: "Giải thưởng & vinh danh" },
  ];

  return (
    <section className="about pad" id="about" data-screen-label="Giới thiệu">
      <div className="about-grid">
        <p className="about-statement reveal-lines">
          Tôi tìm những khoảnh khắc <em>thật</em> — ánh sáng cuối ngày, một ánh
          nhìn không dàn dựng, hơi ấm của màu film — và giữ chúng lại mãi mãi.
        </p>
        <div className="about-side">
          <p className="reveal">
            Hơn một thập kỷ đứng sau ống kính, tôi theo đuổi một thẩm mỹ giản dị:
            tự nhiên, ấm áp, và giàu cảm xúc. Mỗi khung hình là một câu chuyện
            được kể chậm rãi.
          </p>
          <p className="reveal">
            Từ chân dung studio đến phóng sự cưới và những chuyến đi xa, tôi tin
            rằng bức ảnh đẹp nhất là bức khiến bạn nhớ lại cảm giác của chính
            khoảnh khắc đó.
          </p>
          {profile?.avatarUrl ? (
            <AppImage
              className="portrait film-img reveal"
              src={profile.avatarUrl}
              alt={profile.fullName || "Chân dung"}
              width={600}
              height={800}
            />
          ) : null}
        </div>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat reveal" key={s.l}>
            <div className="n" data-count={s.n}>
              {s.n}
            </div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>

      <style>{`
        .about {
          --pad-x: clamp(20px, 5vw, 72px);
          position: relative;
          background: var(--cream);
          color: var(--pf-ink);
          font-family: var(--pf-sans);
          /* Vừa trong 1 khung hình (trừ nav ~72px). */
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: var(--pad-x);
          padding-right: var(--pad-x);
          padding-top: clamp(88px, 11vh, 124px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
        .about img { display: block; max-width: 100%; }

        .about-grid {
          display: grid;
          grid-template-columns: 1.3fr .7fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: center;
        }
        .about-statement {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(24px, 3.2vw, 44px);
          line-height: 1.14;
        }
        .about-statement em { font-style: italic; color: var(--gold); }

        .about-side p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--pf-muted);
          margin-bottom: 14px;
        }
        .about-side .portrait {
          /* Ảnh dọc, tỉ lệ 3/4, cao theo viewport để giữ dáng đứng; căn giữa cột. */
          height: clamp(300px, 46vh, 480px);
          width: auto;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          margin-top: 18px;
          margin-left: auto;
          margin-right: auto;
        }

        .about .stats {
          display: flex;
          gap: clamp(28px, 5vw, 72px);
          margin-top: clamp(36px, 6vh, 64px);
          flex-wrap: wrap;
        }
        .about .stat .n {
          font-family: var(--serif);
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1;
          font-weight: 500;
        }
        .about .stat .l {
          font-size: 12px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--pf-muted);
          margin-top: 8px;
        }

        @media (max-width: 760px) {
          .about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
