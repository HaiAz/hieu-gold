"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listProjects } from "@/lib/projects";
import { getProfile } from "@/lib/profile";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [profileReady, setProfileReady] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [projects, profile] = await Promise.all([
          listProjects(),
          getProfile(),
        ]);
        setProjectCount(projects.length);
        setProfileReady(!!profile.fullName && !!profile.email);
      } catch {
        setProjectCount(0);
        setProfileReady(false);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link href="/admin/profile" className="adm-card block">
        <p className="adm-eyebrow">Thông tin cá nhân</p>
        <h2 className="adm-h2 mt-3">
          {profileReady === null
            ? "Đang tải..."
            : profileReady
              ? "Đã cập nhật"
              : "Chưa hoàn tất"}
        </h2>
        <p className="adm-muted mt-2 text-sm">
          Họ tên, email, số điện thoại, mạng xã hội.
        </p>
      </Link>

      <Link href="/admin/projects" className="adm-card block">
        <p className="adm-eyebrow">Số dự án</p>
        <h2 className="adm-h2 mt-3">
          {projectCount === null ? "Đang tải..." : projectCount}
        </h2>
        <p className="adm-muted mt-2 text-sm">
          Thêm, sửa, xoá dự án và quản lý ảnh.
        </p>
      </Link>
    </div>
  );
}
