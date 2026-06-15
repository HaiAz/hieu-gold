import type { Profile } from "@/lib/types";
import SocialLinks from "@/components/SocialLinks";

export default function Contact({ profile }: { profile: Profile | null }) {
  const email = profile?.email || "xinchao@minhhieu.studio";

  return (
    <footer className="contact pad" id="contact" data-screen-label="Liên hệ">
      <span className="eyebrow reveal">Liên hệ</span>
      <h2 className="reveal-lines">
        Hãy cùng nhau <em>kể</em>
        <br />
        một câu chuyện.
      </h2>
      <a href={`mailto:${email}`} className="mail reveal">
        {email} <span className="arr">↗</span>
      </a>
      <div className="foot">
        <span>© 2026 {profile?.fullName || "Minh Hiếu"} Studio — Hà Nội, Việt Nam</span>
        {profile?.social ? <SocialLinks links={profile.social} /> : null}
      </div>

      <style>{`
        .contact {
          --pad-x: clamp(20px, 5vw, 72px);
          position: relative;
          background: var(--char);
          color: var(--cream);
          font-family: var(--pf-sans);
          padding-left: var(--pad-x);
          padding-right: var(--pad-x);
          padding-top: clamp(90px, 14vh, 170px);
          padding-bottom: clamp(40px, 6vh, 64px);
        }
        .contact .eyebrow {
          display: block;
          margin-bottom: 28px;
          font-size: 11px;
          letter-spacing: .32em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--gold);
        }
        .contact h2 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(44px, 9vw, 150px);
          line-height: .92;
        }
        .contact h2 em { font-style: italic; color: var(--gold); }

        .contact .mail {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          margin-top: clamp(36px, 6vh, 72px);
          font-family: var(--serif);
          font-size: clamp(24px, 3.4vw, 44px);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 10px;
        }
        .contact .mail .arr { transition: transform .4s; }
        .contact .mail:hover .arr { transform: translate(8px, -8px); }

        .contact .foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: clamp(70px, 12vh, 150px);
          padding-top: 26px;
          border-top: 1px solid var(--line-dark);
          font-size: 12px;
          letter-spacing: .1em;
          color: var(--muted-dark);
        }
        /* Social links: override the Behance-blue badge to match the dark design */
        .contact .foot ul {
          display: flex;
          gap: 26px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .contact .foot ul a {
          background: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .1em;
          color: var(--muted-dark) !important;
          transition: color .3s;
        }
        .contact .foot ul a:hover { color: var(--gold) !important; }
      `}</style>
    </footer>
  );
}
