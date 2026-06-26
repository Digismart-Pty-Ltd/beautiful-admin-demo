import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Event } from "./demo-data";

const EVENTS_COL = "events";

// ── Convert an image file into a base64 data URL for Firestore storage ─────
// ── Convert an image file into a compressed base64 data URL ─────────────────
export async function uploadEventImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(10);

  // Step 1: read the raw file into an object URL so the browser can decode it
  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      onProgress?.(50);

      try {
        // Step 2: draw onto a canvas, capped at 1200px wide to stay well under
        // Firestore's 1 MB document limit (base64 of a 1200×800 JPEG ≈ 150–300 KB)
        const MAX_W = 1200;
        const MAX_H = 1200;
        let { width, height } = img;

        if (width > MAX_W) {
          height = Math.round((height * MAX_W) / width);
          width = MAX_W;
        }
        if (height > MAX_H) {
          width = Math.round((width * MAX_H) / height);
          height = MAX_H;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not available");

        // White background so transparent PNGs look correct as JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        onProgress?.(80);

        // Export as JPEG at 82% quality — good visual quality, small file size
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);

        onProgress?.(100);
        resolve(dataUrl);
      } catch (canvasErr) {
        // Canvas fallback — read raw and hope it's small enough
        console.error("Canvas compression failed, falling back:", canvasErr);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onProgress?.(100);
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read image file."));
          }
        };
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image. Try a different file."));
    };

    img.src = objectUrl;
  });
}

// ── Create event document in Firestore ───────────────────────────────────────
export async function createEventInFirestore(
  data: Omit<Event, "id" | "attendees">
): Promise<string> {
  const docRef = await addDoc(collection(db, EVENTS_COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Update event document in Firestore ───────────────────────────────────────
export async function updateEventInFirestore(
  id: string,
  data: Partial<Omit<Event, "id" | "attendees">>
) {
  await updateDoc(doc(db, EVENTS_COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Delete event document from Firestore ─────────────────────────────────────
export async function deleteEventFromFirestore(id: string) {
  await deleteDoc(doc(db, EVENTS_COL, id));
}

// ── Real-time listener — calls back with sorted events array ─────────────────
export function subscribeToEvents(
  callback: (events: Event[]) => void
): () => void {
  const q = query(collection(db, EVENTS_COL), orderBy("date", "asc"));
  return onSnapshot(q, (snap) => {
    const events: Event[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Event, "id">),
    }));
    callback(events);
  });
}