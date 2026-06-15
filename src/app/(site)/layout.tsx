import { getProfile } from "@/lib/profile";
import Nav from "@/components/layout/Nav";
import Grain from "@/components/layout/Grain";
import SiteEffects from "@/components/layout/SiteEffects";
import LightboxProvider from "@/components/lightbox/LightboxProvider";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile().catch(() => null);

  return (
    <LightboxProvider>
      <Grain />
      <SiteEffects />
      <Nav brand={profile?.fullName?.trim() || "Minh Hiếu"} />
      {children}
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: var(--cream); }
      `}</style>
    </LightboxProvider>
  );
}
