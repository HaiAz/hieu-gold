import { getProfile } from "@/lib/profile";
import { listProjects } from "@/lib/projects";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";

export const revalidate = 60;

export default async function Home() {
  const [profile, projects] = await Promise.all([
    getProfile().catch(() => null),
    listProjects().catch(() => []),
  ]);

  // Gallery: ảnh riêng do admin chọn (giữ đúng thứ tự), không lấy từ project.
  const galleryImages = profile?.galleryImages ?? [];

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} projects={projects} />
      <Works projects={projects} />
      <Gallery images={galleryImages} />
      <Contact profile={profile} />
    </>
  );
}
