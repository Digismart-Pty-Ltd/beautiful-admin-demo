import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

export const sendCheckinReminders = functions.pubsub.schedule("every 5 minutes").onRun(async () => {
  const db = admin.firestore();
  const now = Date.now();
  const windowStart = now + 30 * 60_000;
  const windowEnd = now + 35 * 60_000;

  const eventsSnap = await db.collection("events").get();

  const dueEvents = eventsSnap.docs.filter((d) => {
    const e = d.data();
    if (!e.date || !e.time) return false;
    const start = new Date(`${e.date}T${e.time}:00+02:00`).getTime();
    return start >= windowStart && start <= windowEnd;
  });

  if (dueEvents.length === 0) return null;

  for (const eventDoc of dueEvents) {
    const event = eventDoc.data();

    const regsSnap = await db
      .collection("eventRegistrations")
      .where("eventId", "==", eventDoc.id)
      .get();

    for (const regDoc of regsSnap.docs) {
      const reg = regDoc.data();
      if (reg.checkedInAt || reg.reminderSent || !reg.userId) continue;

      // Write a targeted notification doc — this shows in the bell / Notifications
      // page AND triggers onNotificationCreate to push it to the user's devices,
      // including when the app is closed or the phone is locked.
      await db.collection("notifications").add({
        title: "Time to check in! 🏃",
        body: `${event.title} starts in 30 minutes. Tap to check in.`,
        link: `/events?checkin=${eventDoc.id}`,
        audience: "all",
        userId: reg.userId,
        readBy: [],
        deletedBy: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await regDoc.ref.update({ reminderSent: true });
    }
  }

  return null;
});
