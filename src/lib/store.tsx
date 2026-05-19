import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  events as seedEvents,
  members as seedMembers,
  openRunners as seedOpenRunners,
  rewards as seedRewards,
  type Event,
  type Member,
  type Reward,
  type Tier,
} from "./demo-data";

const KEY = "whf:store:v1";

export type CurrentUser =
  | { kind: "member"; id: string }
  | { kind: "open"; id: string }
  | { kind: "admin" }
  | null;

export type Registration = {
  id: string;
  eventId: string;
  userId: string;        // member id, open id, or "guest:<name>"
  name: string;
  tier?: Tier;
  openRunner?: boolean;
  contact?: string;
  emergency?: string;
  acceptedAt: string;    // ISO
  checkedInAt?: string;  // ISO
};

export type Redemption = { id: string; rewardId: string; memberId: string; at: string };

type State = {
  events: Event[];
  members: Member[];
  openRunners: { id: string; name: string; email: string; lastRun: string }[];
  rewards: Reward[];
  registrations: Registration[];
  redemptions: Redemption[];
  currentUserId: string | null;
  currentUserKind: "member" | "open" | "admin" | null;
};

const initial: State = {
  events: seedEvents,
  members: seedMembers,
  openRunners: seedOpenRunners,
  rewards: seedRewards,
  registrations: seedEvents.flatMap((e) =>
    e.attendees.map((a, i) => ({
      id: `${e.id}-seed-${i}`,
      eventId: e.id,
      userId: a.openRunner ? `open:${a.name}` : `member:${a.name}`,
      name: a.name,
      tier: a.tier,
      openRunner: a.openRunner,
      acceptedAt: new Date().toISOString(),
    }))
  ),
  redemptions: [],
  currentUserId: null,
  currentUserKind: null,
};

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

function save(s: State) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function tierFor(races: number): Tier {
  if (races >= 36) return "Platinum";
  if (races >= 24) return "Gold";
  if (races >= 12) return "Silver";
  return "Bronze";
}

export function nextTierInfo(races: number) {
  const targets: Array<[Tier, number]> = [["Silver", 12], ["Gold", 24], ["Platinum", 36]];
  for (const [t, n] of targets) if (races < n) return { next: t, needed: n - races, target: n };
  return { next: "Platinum" as Tier, needed: 0, target: 36 };
}

type Ctx = {
  state: State;
  currentMember: Member | null;
  currentOpen: { id: string; name: string; email: string; lastRun: string } | null;
  currentUser: CurrentUser;
  // auth
  registerMember: (input: { name: string; email: string }) => Member;
  registerOpenRunner: (input: { name: string; email: string }) => { id: string; name: string; email: string; lastRun: string };
  loginByEmail: (email: string) => boolean;
  loginAdmin: () => void;
  logout: () => void;
  // events
  signUpForEvent: (eventId: string, fields: { name: string; contact: string; emergency: string }) => Registration | null;
  cancelSignup: (registrationId: string) => void;
  checkIn: (eventId: string) => Registration | null;
  attendeesFor: (eventId: string) => Registration[];
  myRegistrationFor: (eventId: string) => Registration | undefined;
  // rewards
  redeem: (rewardId: string) => void;
  myRedemptions: () => Redemption[];
  // admin
  createEvent: (e: Omit<Event, "id" | "attendees">) => void;
  updateEvent: (id: string, patch: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  createReward: (r: Omit<Reward, "id">) => void;
  updateReward: (id: string, patch: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) save(state); }, [state, hydrated]);

  const mutate = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const currentMember = useMemo(
    () => state.currentUserKind === "member" ? state.members.find((m) => m.id === state.currentUserId) ?? null : null,
    [state]
  );
  const currentOpen = useMemo(
    () => state.currentUserKind === "open" ? state.openRunners.find((o) => o.id === state.currentUserId) ?? null : null,
    [state]
  );
  const currentUser: CurrentUser =
    state.currentUserKind === "admin" ? { kind: "admin" } :
    currentMember ? { kind: "member", id: currentMember.id } :
    currentOpen ? { kind: "open", id: currentOpen.id } : null;

  const ctx: Ctx = {
    state,
    currentMember,
    currentOpen,
    currentUser,
    registerMember: ({ name, email }) => {
      const m: Member = {
        id: `m-${Date.now()}`,
        name, email,
        joined: new Date().toISOString().slice(0, 10),
        races: 0, tier: "Bronze", rewardsPending: 0,
      };
      mutate((s) => ({ ...s, members: [...s.members, m], currentUserId: m.id, currentUserKind: "member" }));
      return m;
    },
    registerOpenRunner: ({ name, email }) => {
      const o = { id: `o-${Date.now()}`, name, email, lastRun: new Date().toISOString().slice(0, 10) };
      mutate((s) => ({ ...s, openRunners: [...s.openRunners, o], currentUserId: o.id, currentUserKind: "open" }));
      return o;
    },
    loginByEmail: (email) => {
      const m = state.members.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (m) { mutate((s) => ({ ...s, currentUserId: m.id, currentUserKind: "member" })); return true; }
      const o = state.openRunners.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (o) { mutate((s) => ({ ...s, currentUserId: o.id, currentUserKind: "open" })); return true; }
      return false;
    },
    loginAdmin: () => mutate((s) => ({ ...s, currentUserKind: "admin", currentUserId: null })),
    logout: () => mutate((s) => ({ ...s, currentUserId: null, currentUserKind: null })),

    signUpForEvent: (eventId, fields) => {
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return null;
      const isMember = state.currentUserKind === "member";
      if (event.membersOnly && !isMember) return null;
      const userId = currentMember?.id ?? currentOpen?.id ?? `guest:${fields.name}`;
      // prevent duplicate
      if (state.registrations.find((r) => r.eventId === eventId && r.userId === userId)) return null;
      const reg: Registration = {
        id: `reg-${Date.now()}`,
        eventId,
        userId,
        name: currentMember?.name ?? currentOpen?.name ?? fields.name,
        tier: currentMember?.tier,
        openRunner: !currentMember,
        contact: fields.contact,
        emergency: fields.emergency,
        acceptedAt: new Date().toISOString(),
      };
      mutate((s) => ({ ...s, registrations: [...s.registrations, reg] }));
      return reg;
    },
    cancelSignup: (id) => mutate((s) => ({ ...s, registrations: s.registrations.filter((r) => r.id !== id) })),
    checkIn: (eventId) => {
      const uid = currentMember?.id ?? currentOpen?.id;
      if (!uid) return null;
      const reg = state.registrations.find((r) => r.eventId === eventId && r.userId === uid);
      if (!reg || reg.checkedInAt) return reg ?? null;
      const at = new Date().toISOString();
      let updatedReg = reg;
      mutate((s) => {
        const registrations = s.registrations.map((r) =>
          r.id === reg.id ? { ...r, checkedInAt: at } : r
        );
        updatedReg = registrations.find((r) => r.id === reg.id)!;
        let members = s.members;
        if (currentMember) {
          members = s.members.map((m) => {
            if (m.id !== currentMember.id) return m;
            const races = m.races + 1;
            return { ...m, races, tier: tierFor(races) };
          });
        }
        return { ...s, registrations, members };
      });
      return updatedReg;
    },
    attendeesFor: (eventId) => state.registrations.filter((r) => r.eventId === eventId),
    myRegistrationFor: (eventId) => {
      const uid = currentMember?.id ?? currentOpen?.id;
      if (!uid) return undefined;
      return state.registrations.find((r) => r.eventId === eventId && r.userId === uid);
    },

    redeem: (rewardId) => {
      if (!currentMember) return;
      mutate((s) => ({
        ...s,
        redemptions: [...s.redemptions, { id: `rd-${Date.now()}`, rewardId, memberId: currentMember.id, at: new Date().toISOString() }],
      }));
    },
    myRedemptions: () => currentMember ? state.redemptions.filter((r) => r.memberId === currentMember.id) : [],

    createEvent: (e) => mutate((s) => ({ ...s, events: [...s.events, { ...e, id: `evt-${Date.now()}`, attendees: [] }] })),
    updateEvent: (id, patch) => mutate((s) => ({ ...s, events: s.events.map((e) => e.id === id ? { ...e, ...patch } : e) })),
    deleteEvent: (id) => mutate((s) => ({ ...s, events: s.events.filter((e) => e.id !== id), registrations: s.registrations.filter((r) => r.eventId !== id) })),
    createReward: (r) => mutate((s) => ({ ...s, rewards: [...s.rewards, { ...r, id: `r-${Date.now()}` }] })),
    updateReward: (id, patch) => mutate((s) => ({ ...s, rewards: s.rewards.map((r) => r.id === id ? { ...r, ...patch } : r) })),
    deleteReward: (id) => mutate((s) => ({ ...s, rewards: s.rewards.filter((r) => r.id !== id) })),
  };

  return <StoreCtx.Provider value={ctx}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
