import {
  collection, onSnapshot, addDoc, updateDoc,
  doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  audience: "all" | "members" | "open";
  minTier?: "Pink" | "Silver" | "Gold" | "Platinum";
  readBy: string[];
  link?: string;
};

export function subscribeToNotifications(
  callback: (notifs: Notification[]) => void
) {
  const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
        createdAt: d.data().createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
      }))
    );
  });
}

export async function createNotification(data: Omit<Notification, "id" | "createdAt" | "readBy">) {
  await addDoc(collection(db, "notifications"), {
    ...data,
    readBy: [],
    createdAt: serverTimestamp(),
  });
}

export async function markNotificationRead(notifId: string, userId: string, currentReadBy: string[]) {
  if (currentReadBy.includes(userId)) return;
  await updateDoc(doc(db, "notifications", notifId), {
    readBy: [...currentReadBy, userId],
  });
}