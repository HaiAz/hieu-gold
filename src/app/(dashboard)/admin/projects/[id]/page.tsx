"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { getProject } from "@/lib/projects";
import type { Project } from "@/lib/types";

export default function EditProjectPage(
  props: PageProps<"/admin/projects/[id]">
) {
  const { id } = use(props.params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await getProject(id);
      if (!p) {
        router.replace("/admin/projects");
        return;
      }
      setProject(p);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading || !project) return <p className="adm-muted text-sm">Đang tải...</p>;

  return (
    <div>
      <h2 className="adm-h2 mb-6">Sửa dự án</h2>
      <ProjectForm initial={project} />
    </div>
  );
}
