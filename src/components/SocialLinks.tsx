import type { SocialLinks as Links } from "@/lib/types";

const LABELS: Record<keyof Links, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  zalo: "Zalo",
  instagram: "Instagram",
};

export default function SocialLinks({ links }: { links: Links }) {
  const entries = (Object.entries(links) as [keyof Links, string | undefined][])
    .filter(([, url]) => !!url);
  if (entries.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, url]) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="badge-primary hover:bg-brand-tint-hover"
          >
            {LABELS[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
