import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToNotifications,
  markNotificationRead,
  type Notification,
} from "@/lib/notificationService";
import { doc, onSnapshot as fsOnSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const tierRank: Record<string, number> = { Pink: 0, Silver: 1, Gold: 2, Platinum: 3 };

export default function NotificationsPage() {
  const { currentMember, currentOpen, state } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allNotifs, setAllNotifs] = useState<Notification[]>([]);
  const [notifsLoaded, setNotifsLoaded] = useState(false);
  const [liveTier, setLiveTier] = useState<string | null>(null);
  const [tierLoaded, setTierLoaded] = useState(false);

  const authEmail = user?.email ?? undefined;
  const authMember = authEmail
    ? state.members.find((m) => m.email.toLowerCase() === authEmail.toLowerCase())
    : null;
  const effectiveMember = currentMember ?? authMember;
  const uid = user?.uid ?? effectiveMember?.id ?? currentOpen?.id ?? null;
  const role = effectiveMember ? "members" : currentOpen ? "open" : null;

  useEffect(() => {
    document.title = "Notifications · Waven Harper Fitness";
  }, []);

  // Load live tier from Firestore
  useEffect(() => {
    if (!uid || !effectiveMember) {
      setTierLoaded(true); // not a member, no tier needed
      return;
    }
    const unsub = fsOnSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) setLiveTier((snap.data() as any).tier ?? null);
      setTierLoaded(true);
    });
    return () => unsub();
  }, [uid]);

  // Subscribe to notifications
  useEffect(() => {
    const unsub = subscribeToNotifications((all) => {
      setAllNotifs(all);
      setNotifsLoaded(true);
    });
    return () => unsub();
  }, []);

  // Derive visible notifications only when both are loaded
  const loading = !notifsLoaded || !tierLoaded;

  const notifs = loading ? [] : allNotifs.filter((n) => {
    if (n.audience !== "all" && n.audience !== role) return false;
    if (role !== "members") return true;
if (n.minTier) {
      if (!liveTier) return false;
      return liveTier === n.minTier;
    }
    return true;
  });

  const unreadIds = uid
    ? new Set(notifs.filter((n) => !n.readBy.includes(uid)).map((n) => n.id))
    : new Set<string>();

  useEffect(() => {
    if ("setAppBadge" in navigator) {
      if (unreadIds.size > 0) {
        (navigator as any).setAppBadge(unreadIds.size);
      } else {
        (navigator as any).clearAppBadge();
      }
    }
  }, [unreadIds.size]);

  async function handleClick(n: Notification) {
    if (uid && unreadIds.has(n.id)) {
      await markNotificationRead(n.id, uid, n.readBy);
    }
    if (n.link) navigate(n.link);
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto max-w-md md:max-w-2xl px-5 md:px-8 pt-14 pb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Updates</div>
        <h1 className="mt-2 display text-4xl md:text-6xl">Notifications.</h1>
{!loading && notifs.length > 0 && (
  <div className="flex items-center justify-between mt-3">
    <p className="text-sm text-muted-foreground">
      {unreadIds.size > 0
        ? `${unreadIds.size} unread · ${notifs.length} total`
        : `${notifs.length} notification${notifs.length !== 1 ? "s" : ""} · all read`}
    </p>
    <button
      onClick={async () => {
        if (!confirm("Clear all your notifications?")) return;
        try {
          const { deleteDoc, doc: fsDoc } = await import("firebase/firestore");
          await Promise.all(notifs.map((n) => deleteDoc(fsDoc(db, "notifications", n.id))));
        } catch {
          // non-blocking
        }
      }}
      className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
    >
      Clear all
    </button>
  </div>
)}
      </section>

      <section className="mx-auto max-w-md md:max-w-2xl px-5 md:px-8 pb-20">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                <div className="h-3 w-1/3 rounded bg-secondary/60 mb-3" />
                <div className="h-4 w-2/3 rounded bg-secondary/60 mb-2" />
                <div className="h-3 w-1/2 rounded bg-secondary/40" />
              </div>
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Bell className="text-muted-foreground" size={22} />
            </div>
            <div className="display text-xl mb-2">All quiet here</div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              You'll see event updates and reward unlocks here when they arrive.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
{notifs.map((n) => {
  const isUnread = uid ? unreadIds.has(n.id) : false;
  const isClickable = Boolean(n.link);
  return (
    <div
      key={n.id}
      className={`
        group relative rounded-2xl border bg-card p-5 transition-all
        ${isUnread ? "border-primary/30 bg-primary/5" : "border-border"}
        ${isClickable ? "cursor-pointer hover:border-primary/50 active:scale-[0.99]" : ""}
      `}
    >
      {isUnread && (
        <span className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary" />
      )}
      {/* Delete button — top right, shown on hover */}
      <button
        onClick={async (ev) => {
          ev.stopPropagation();
          if (!confirm("Remove this notification?")) return;
          try {
            const { deleteDoc, doc: fsDoc } = await import("firebase/firestore");
            await deleteDoc(fsDoc(db, "notifications", n.id));
          } catch {
            // non-blocking
          }
        }}
        className={`absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all ${isUnread ? "right-8" : ""}`}
        aria-label="Delete notification"
      >
        <X size={14} />
      </button>

      <div
        onClick={() => isClickable && handleClick(n)}
        className="w-full"
      >
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          {new Date(n.createdAt).toLocaleDateString("en-ZA", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
          {n.minTier && <span className="ml-2 opacity-60">· {n.minTier}+</span>}
        </div>
        <div className={`display text-lg leading-snug ${isUnread ? "text-foreground" : "text-foreground/80"}`}>
          {n.title}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
        {isClickable && (
          <div className="mt-3 text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Tap to view →
          </div>
        )}
      </div>
    </div>
  );
})}
          </div>
        )}
      </section>
    </div>
  );
}