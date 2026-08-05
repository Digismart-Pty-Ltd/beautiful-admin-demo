import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // make sure `storage` is exported from firebase.ts (see note below)

export type AdvertStatus = "pending" | "approved" | "rejected";

export interface Advertisement {
  id: string;
  orderNumber: string;
  businessName: string;
  slogan: string;
  logoUrl: string;
  websiteUrl: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  isMember: boolean;
  price: number;
  status: AdvertStatus;
  enabled: boolean;
  createdAt?: any;
}

export function generateAdOrderNumber() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ADV-${rand}`;
}

export function subscribeToAdvertisements(cb: (ads: Advertisement[]) => void) {
  const q = query(collection(db, "advertisements"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Advertisement[]),
    (err) => {
      console.error("advertisements onSnapshot error:", err);
      cb([]);
    },
  );
}

// Home page only cares about live, approved adverts — filtered client-side
// so we don't need a composite Firestore index.
export function subscribeToActiveAdvertisements(cb: (ads: Advertisement[]) => void) {
  return subscribeToAdvertisements((ads) =>
    cb(ads.filter((a) => a.status === "approved" && a.enabled)),
  );
}

export async function createAdvertisement(
  data: Omit<Advertisement, "id" | "createdAt" | "status" | "enabled">,
) {
  const docRef = await addDoc(collection(db, "advertisements"), {
    ...data,
    status: "pending",
    enabled: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdvertisement(id: string, data: Partial<Advertisement>) {
  await updateDoc(doc(db, "advertisements", id), data as any);
}

export async function deleteAdvertisement(id: string) {
  await deleteDoc(doc(db, "advertisements", id));
}

export async function uploadAdvertLogo(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const path = `advert-logos/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });
}