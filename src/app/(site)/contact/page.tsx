import { getProfile } from "@/lib/profile";
import SocialLinks from "@/components/SocialLinks";

export const revalidate = 60;

export default async function ContactPage() {
  const profile = await getProfile().catch(() => null);

  return (
    <section className="ct-page">
      <div className="ct-inner">
        <span className="ct-eyebrow">Liên hệ</span>
        <h1 className="ct-title">
          Hãy cùng nhau <em>kể</em>
          <br />
          một câu chuyện.
        </h1>

        <div className="ct-grid">
          <div className="ct-block">
            <h2 className="ct-h2">Thông tin</h2>
            <dl className="ct-dl">
              <div>
                <dt>Họ tên</dt>
                <dd>{profile?.fullName || "Chưa cập nhật"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  {profile?.email ? (
                    <a className="ct-link" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  ) : (
                    "Chưa cập nhật"
                  )}
                </dd>
              </div>
              <div>
                <dt>Số điện thoại</dt>
                <dd>
                  {profile?.phone ? (
                    <a className="ct-link" href={`tel:${profile.phone}`}>
                      {profile.phone}
                    </a>
                  ) : (
                    "Chưa cập nhật"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="ct-block">
            <h2 className="ct-h2">Mạng xã hội</h2>
            <div className="ct-social">
              {profile?.social ? (
                <SocialLinks links={profile.social} />
              ) : (
                <p className="ct-muted">Chưa có liên kết.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ct-page {
          --pad-x: clamp(20px, 5vw, 72px);
          min-height: 100vh;
          background: var(--char);
          color: var(--cream);
          font-family: var(--pf-sans);
          padding: clamp(120px, 18vh, 200px) var(--pad-x) clamp(70px, 12vh, 140px);
        }
        .ct-inner { max-width: 1100px; margin: 0 auto; }
        .ct-eyebrow {
          font-size: 11px; letter-spacing: .32em; text-transform: uppercase;
          font-weight: 600; color: var(--gold); display: block; margin-bottom: 24px;
        }
        .ct-title {
          font-family: var(--serif); font-weight: 400; line-height: .98;
          font-size: clamp(40px, 8vw, 110px);
        }
        .ct-title em { font-style: italic; color: var(--gold); }

        .ct-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 5vw, 64px);
          margin-top: clamp(48px, 8vh, 96px);
        }
        @media (max-width: 680px) { .ct-grid { grid-template-columns: 1fr; } }
        .ct-h2 {
          font-family: var(--serif); font-weight: 500; font-size: 22px;
          padding-bottom: 16px; border-bottom: 1px solid var(--line-dark); margin-bottom: 20px;
        }
        .ct-dl { display: flex; flex-direction: column; gap: 18px; }
        .ct-dl dt {
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--muted-dark); margin-bottom: 4px;
        }
        .ct-dl dd { font-size: 17px; font-family: var(--serif); }
        .ct-link { border-bottom: 1px solid var(--gold); transition: color .3s; }
        .ct-link:hover { color: var(--gold-soft); }
        .ct-muted { color: var(--muted-dark); font-size: 14px; }

        /* SocialLinks override cho nền tối (badge xanh -> text gold) */
        .ct-social ul { display: flex; flex-wrap: wrap; gap: 20px; list-style: none; margin: 0; padding: 0; }
        .ct-social ul a {
          background: none !important; padding: 0 !important; border-radius: 0 !important;
          font-size: 14px; font-weight: 500; letter-spacing: .04em;
          color: var(--cream) !important; border-bottom: 1px solid transparent; transition: color .3s, border-color .3s;
        }
        .ct-social ul a:hover { color: var(--gold) !important; border-color: var(--gold); }
      `}</style>
    </section>
  );
}
