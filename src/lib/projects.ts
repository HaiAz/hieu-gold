import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteImage, uploadFile } from "./cloudinary";
import type { Project, ProjectImage } from "./types";

export { deleteImage };

const PROJECTS_COL = collection(db, "projects");

export async function listProjects(): Promise<Project[]> {
  const q = query(PROJECTS_COL, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Project, "id">) };
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(PROJECTS_COL, {
    ...data,
    createdAt: now,
    updatedAt: now,
    _serverCreatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "projects", id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteProject(project: Project): Promise<void> {
  // Cloudinary images không xoá tự động (cần API secret). Bỏ qua, xoá Firestore doc.
  await deleteDoc(doc(db, "projects", project.id));
}

export async function uploadProjectImage(
  _projectKey: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<ProjectImage> {
  const result = await uploadFile(file, onProgress);
  return { url: result.url, path: result.publicId };
}
