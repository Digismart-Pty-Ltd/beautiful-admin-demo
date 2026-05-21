import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart3, Calendar, Gift, LogOut, Users, Shield, Plus, Download, Trash2, Pencil, X, Check,
} from "lucide-react";
import type { Event, Reward, Tier } from "@/lib/demo-data";

type Tab = "overview" | "events" | "members" | "rewards";

export default function Admin() {
  const { currentUser, loginAdmin, logout } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  useEffect(() => { document.title = "Admin · Waven Harper Fitness"; }, []);

  if (currentUser?.kind !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center">
          <Shield className="mx-auto text-primary" />
          <h1 className="mt-4 display text-3xl">Admin control room</h1>
          <p className="mt-2 text-sm text-muted-foreground">For organisers only. This page is hidden from public navigation.</p>
          <button onClick={() => { loginAdmin(); toast.success("Admin mode enabled."); }}
            className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
            Enter admin
          </button>
          <Link to="/" className="mt-3 inline-block text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">← Back to site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-10">
          <Shield className="text-primary" size={20} />
          <div>
            <div className="display text-sm tracking-[0.2em]">WH · Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Control room</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "events", label: "Events", icon: Calendar },
            { id: "members", label: "Members", icon: Users },
            { id: "rewards", label: "Rewards", icon: Gift },
          ].map((n) => (
            <button key={n.id} onClick={() => setTab(n.id as Tab)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${tab === n.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
          <LogOut size={14} /> Exit admin
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-border px-6 md:px-10 py-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Admin</div>
            <h1 className="display text-3xl capitalize">{tab}</h1>
          </div>
        </header>
        <div className="p-6 md:p-10">
          {tab === "overview" && <Overview />}
          {tab === "events" && <EventsAdmin />}
          {tab === "members" && <MembersAdmin />}
          {tab === "rewards" && <RewardsAdmin />}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="mt-2 display text-4xl">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="display text-lg mb-3">{title}</div>
      {children}
    </div>
  );
}

function Overview() {
  const { state } = useStore();
  const totalSignups = state.registrations.length;
  const checkedIn = state.registrations.filter((r) => r.checkedInAt).length;
  const recent = [...state.registrations].slice(-6).reverse();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Members" value={state.members.length} />
        <Stat label="Open Runners" value={state.openRunners.length} />
        <Stat label="Upcoming events" value={state.events.length} />
        <Stat label="Total sign-ups" value={totalSignups} sub={`${checkedIn} checked in`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent sign-ups">
          {recent.length === 0 ? <p className="text-sm text-muted-foreground">No sign-ups yet.</p> : (
            <ul className="divide-y divide-border">
              {recent.map((r) => {
                const evt = state.events.find((e) => e.id === r.eventId);
                return (
                  <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                    <span>{r.name} <span className="text-muted-foreground">→ {evt?.title ?? "—"}</span></span>
                    <span className={`text-[10px] uppercase tracking-widest ${r.openRunner ? "text-muted-foreground" : "text-primary"}`}>
                      {r.openRunner ? "Open" : r.tier ?? "Member"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        <Panel title="Tier distribution">
          <div className="space-y-3 pt-2">
            {(["Bronze", "Silver", "Gold", "Platinum"] as const).map((t) => {
              const count = state.members.filter((m) => m.tier === t).length;
              const pct = state.members.length ? (count / state.members.length) * 100 : 0;
              return (
                <div key={t}>
                  <div className="flex justify-between text-xs"><span>{t}</span><span className="text-muted-foreground">{count}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function EventsAdmin() {
  const { state, createEvent, updateEvent, deleteEvent } = useStore();
  const [editing, setEditing] = useState<Event | null>(null);
  const [creating, setCreating] = useState(false);
  const blank: Omit<Event, "id" | "attendees"> = {
    title: "", date: new Date().toISOString().slice(0,10), time: "06:00",
    meetingPlace: "", afterRunPlace: "", description: "",
    image: state.events[0]?.image ?? "", membersOnly: false, distanceKm: 5,
  };

  function exportCSV() {
    const rows = [["Event","Date","Attendee","Type","CheckedIn"]];
    state.registrations.forEach((r) => {
      const e = state.events.find((x) => x.id === r.eventId);
      rows.push([e?.title ?? "", e?.date ?? "", r.name, r.openRunner ? "Open" : (r.tier ?? "Member"), r.checkedInAt ? "Yes" : "No"]);
    });
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "signups.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-primary"><Download size={13} /> Export CSV</button>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground"><Plus size={13} /> New event</button>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Event</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Sign-ups</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.events.map((e) => {
              const count = state.registrations.filter((r) => r.eventId === e.id).length;
              return (
                <tr key={e.id} className="hover:bg-secondary/30">
                  <td className="p-4 font-medium">{e.title}</td>
                  <td className="p-4 text-muted-foreground">{new Date(e.date).toDateString()}</td>
                  <td className="p-4">{e.membersOnly ? <span className="text-primary text-xs uppercase tracking-widest">Members</span> : <span className="text-muted-foreground text-xs uppercase tracking-widest">Open</span>}</td>
                  <td className="p-4">{count}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => setEditing(e)} className="rounded-md border border-border p-2 hover:border-primary"><Pencil size={13} /></button>
                    <button onClick={() => { if (confirm(`Delete ${e.title}?`)) { deleteEvent(e.id); toast.success("Event deleted."); } }} className="rounded-md border border-border p-2 hover:border-destructive hover:text-destructive"><Trash2 size={13} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <EventModal initial={editing ?? blank} title={editing ? "Edit event" : "New event"}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(data) => {
            if (editing) { updateEvent(editing.id, data); toast.success("Event updated."); }
            else { createEvent(data); toast.success("Event created."); }
            setEditing(null); setCreating(false);
          }} />
      )}
    </div>
  );
}

function EventModal({ initial, title, onClose, onSave }: {
  initial: Omit<Event, "id" | "attendees"> | Event; title: string;
  onClose: () => void; onSave: (data: Omit<Event, "id" | "attendees">) => void;
}) {
  const [f, setF] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4" onClick={onClose}>
      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <div className="display text-2xl">{title}</div>
        <form onSubmit={(ev) => { ev.preventDefault(); onSave(f as Omit<Event,"id"|"attendees">); }} className="mt-5 space-y-3">
          <In label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
          <div className="grid grid-cols-2 gap-3">
            <In label="Date" type="date" value={f.date} onChange={(v) => setF({ ...f, date: v })} />
            <In label="Time" type="time" value={f.time} onChange={(v) => setF({ ...f, time: v })} />
          </div>
          <In label="Meeting place" value={f.meetingPlace} onChange={(v) => setF({ ...f, meetingPlace: v })} />
          <In label="After-run place" value={f.afterRunPlace} onChange={(v) => setF({ ...f, afterRunPlace: v })} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</span>
            <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" rows={3} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <In label="Distance (km)" type="number" value={String(f.distanceKm)} onChange={(v) => setF({ ...f, distanceKm: Number(v) })} />
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={f.membersOnly} onChange={(e) => setF({ ...f, membersOnly: e.target.checked })} className="accent-primary" />
              <span className="text-xs uppercase tracking-widest">Members only</span>
            </label>
          </div>
          <In label="Image URL" value={f.image} onChange={(v) => setF({ ...f, image: v })} />
          <button className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground inline-flex items-center justify-center gap-2"><Check size={14}/> Save</button>
        </form>
      </div>
    </div>
  );
}

function In({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}

function MembersAdmin() {
  const { state } = useStore();
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Joined</th>
            <th className="text-left p-4">Races</th>
            <th className="text-left p-4">Tier</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {state.members.map((m) => (
            <tr key={m.id} className="hover:bg-secondary/30">
              <td className="p-4 font-medium">{m.name}</td>
              <td className="p-4 text-muted-foreground">{m.email}</td>
              <td className="p-4 text-muted-foreground">{m.joined}</td>
              <td className="p-4">{m.races}</td>
              <td className="p-4"><span className="text-primary text-xs uppercase tracking-widest">{m.tier}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-border bg-secondary/30 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
        Open runners ({state.openRunners.length}): {state.openRunners.map((o) => o.name).join(" · ") || "—"}
      </div>
    </div>
  );
}

function RewardsAdmin() {
  const { state, createReward, updateReward, deleteReward } = useStore();
  const [editing, setEditing] = useState<Reward | null>(null);
  const [creating, setCreating] = useState(false);
  const blank: Omit<Reward, "id"> = { tier: "Bronze", title: "", description: "", expiresInDays: 30 };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground"><Plus size={13} /> New reward</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {state.rewards.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary">{r.tier}</div>
                <div className="display text-xl mt-1">{r.title}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(r)} className="rounded-md border border-border p-2 hover:border-primary"><Pencil size={13} /></button>
                <button onClick={() => { if (confirm("Delete reward?")) { deleteReward(r.id); toast.success("Deleted."); } }} className="rounded-md border border-border p-2 hover:border-destructive hover:text-destructive"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">Redeem within {r.expiresInDays} days</div>
          </div>
        ))}
      </div>
      {(creating || editing) && (
        <RewardModal initial={editing ?? blank} title={editing ? "Edit reward" : "New reward"}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(data) => {
            if (editing) { updateReward(editing.id, data); toast.success("Reward updated."); }
            else { createReward(data); toast.success("Reward created."); }
            setEditing(null); setCreating(false);
          }} />
      )}
    </div>
  );
}

function RewardModal({ initial, title, onClose, onSave }: {
  initial: Omit<Reward, "id"> | Reward; title: string;
  onClose: () => void; onSave: (data: Omit<Reward, "id">) => void;
}) {
  const [f, setF] = useState(initial);
  const tiers: Array<Tier | "Special"> = ["Bronze","Silver","Gold","Platinum","Special"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <div className="display text-2xl">{title}</div>
        <form onSubmit={(ev) => { ev.preventDefault(); onSave(f as Omit<Reward,"id">); }} className="mt-5 space-y-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tier</span>
            <select value={f.tier} onChange={(e) => setF({ ...f, tier: e.target.value as any })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
              {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <In label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</span>
            <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" rows={3} />
          </label>
          <In label="Expires in (days)" type="number" value={String(f.expiresInDays)} onChange={(v) => setF({ ...f, expiresInDays: Number(v) })} />
          <button className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground inline-flex items-center justify-center gap-2"><Check size={14}/> Save</button>
        </form>
      </div>
    </div>
  );
}
