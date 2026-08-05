import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onNotificationCreate = functions.firestore
  .document("notifications/{id}")
  .onCreate(async (snap) => {
    const n = snap.data();
    const tokens: string[] = [];

    if (n.userId) {
      // Personal / targeted notification (e.g. event check-in reminder)
      const userSnap = await admin.firestore().collection("users").doc(n.userId).get();
      const u = userSnap.data();
      if (Array.isArray(u?.fcmTokens)) tokens.push(...u!.fcmTokens);
    } else {
      // Broadcast notification — audience/tier based, as before
      const usersSnap = await admin.firestore().collection("users").get();
      usersSnap.forEach((d) => {
        const u = d.data();
        const role = u.role === "member" ? "members" : "open";
        if (n.audience !== "all" && n.audience !== role) return;
        if (n.minTier && u.tier !== n.minTier) return;
        if (Array.isArray(u.fcmTokens)) tokens.push(...u.fcmTokens);
      });
    }

    if (tokens.length === 0) return;

    const res = await admin.messaging().sendEachForMulticast({
      tokens,
      data: {
        title: n.title,
        body: n.body,
        link: n.link ?? "/notifications",
      },
    });

    res.responses.forEach((r, i) => {
      if (!r.success) console.log("Failed token:", tokens[i], r.error?.message);
    });
  });

export { sendCheckinReminders } from "./reminders";
