import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Profile } from "./types";

const PROFILE_DOC = doc(db, "settings", "profile");

const EMPTY_PROFILE: Profile = {
  fullName: "",
  bio: "",
  email: "",
  phone: "",
  avatarUrl: "",
  heroImageUrl: "",
  heroImageMobileUrl: "",
  galleryImages: [],
  aboutStatement: "",
  aboutParagraphs: [],
  aboutStats: [],
  social: {},
};

export async function getProfile(): Promise<Profile> {
  const snap = await getDoc(PROFILE_DOC);
  if (!snap.exists()) return EMPTY_PROFILE;
  return { ...EMPTY_PROFILE, ...(snap.data() as Profile) };
}

export async function saveProfile(profile: Profile): Promise<void> {
  await setDoc(
    PROFILE_DOC,
    { ...profile, updatedAt: Date.now() },
    { merge: true }
  );
}
