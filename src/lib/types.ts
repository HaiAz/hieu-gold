export type SocialLinks = {
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  zalo?: string;
  instagram?: string;
};

export type Profile = {
  fullName: string;
  bio: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  heroImageUrl?: string; // ảnh banner Hero desktop (ngang, >768px)
  heroImageMobileUrl?: string; // ảnh banner Hero mobile (dọc, ≤768px)
  heroFocusY?: number; // vị trí cắt dọc desktop, 0=trên 50=giữa 100=dưới
  heroFocusYMobile?: number; // vị trí cắt dọc mobile
  galleryImages?: ProjectImage[]; // ảnh Gallery riêng, giữ đúng thứ tự đã chọn
  social: SocialLinks;
  updatedAt?: number;
};

export type ProjectImage = {
  url: string;
  path: string; // storage path, for deletion
  width?: number;
  height?: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  coverPath?: string;
  images: ProjectImage[];
  tags: string[];
  shotAt?: string; // ISO date string of shoot
  createdAt: number;
  updatedAt: number;
};

export type AdminRecord = {
  uid: string;
  email: string;
  role: "admin";
  createdAt: number;
};
