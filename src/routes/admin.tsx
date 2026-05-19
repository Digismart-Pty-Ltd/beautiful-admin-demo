import { createFileRoute, Link } from "@tanstack/react-router";
import { events, members, openRunners, rewards } from "@/lib/demo-data";
import { useState } from "react";
import { BarChart3, Calendar, Gift, LogOut, Users, Shield, Plus, Download } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin · Waven Harper Fitness" }, { name: "robots", content: "noindex" }] }),
});

type Tab = "overview" | "events" | "members" | "rewards";

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
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
        <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
          <LogOut size={14} /> Exit admin
        </Link>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-border px-6 md:px-10 py-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Admin</div>
            <h1 className="display text-3xl capitalize">{tab}</h1>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-primary"><Download size={13} /> Export</button>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground"><Plus size={13} /> New</button>
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

function Overview() {
  const totalSignups = events.reduce((a, e) => a + e.attendees.length, 0);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Members" value={members.length} sub="+2 this month" />
        <Stat label="Open Runners" value={openRunners.length} sub="Last 30 days" />
        <Stat label="Upcoming events" value={events.length} />
        <Stat label="Total sign-ups" value={totalSignups} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent sign-ups">
          <ul className="divide-y divide-border">
            {events.flatMap((e) => e.attendees.slice(0, 2).map((a) => ({ ...a, evt: e.title }))).slice(0, 6).map((a, i) => (
              <li key={i} className="flex items-center justify-between py-3 text-sm">
                <span>{a.name} <span className="text-muted-foreground">→ {a.evt}</span></span>
                <span className={`text-[10px] uppercase tracking-widest ${a.openRunner ? "text-muted-foreground" : "text-primary"}`}>{a.openRunner ? "Open" : a.tier}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Tier distribution">
          <div className="space-y-3 pt-2">
            {(["Bronze", "Silver", "Gold", "Platinum"] as const).map((t) => {
              const count = members.filter((m) => m.tier === t).length;
              const pct = (count / members.length) * 100;
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="display text-lg mb-3">{title}</div>
      {children}
    </div>
  );
}

function EventsAdmin() {
  return (
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
          {events.map((e) => (
            <tr key={e.id} className="hover:bg-secondary/30">
              <td className="p-4 font-medium">{e.title}</td>
              <td className="p-4 text-muted-foreground">{new Date(e.date).toDateString()}</td>
              <td className="p-4">{e.membersOnly ? <span className="text-primary text-xs uppercase tracking-widest">Members</span> : <span className="text-muted-foreground text-xs uppercase tracking-widest">Open</span>}</td>
              <td className="p-4">{e.attendees.length}</td>
              <td className="p-4 text-right"><button className="text-xs uppercase tracking-widest text-primary hover:underline">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MembersAdmin() {
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
            <th className="text-left p-4">Pending rewards</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-secondary/30">
              <td className="p-4 font-medium">{m.name}</td>
              <td className="p-4 text-muted-foreground">{m.email}</td>
              <td className="p-4 text-muted-foreground">{m.joined}</td>
              <td className="p-4">{m.races}</td>
              <td className="p-4"><span className="text-primary text-xs uppercase tracking-widest">{m.tier}</span></td>
              <td className="p-4">{m.rewardsPending}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-border bg-secondary/30 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
        Open runners: {openRunners.map((o) => o.name).join(" · ")}
      </div>
    </div>
  );
}

function RewardsAdmin() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rewards.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-primary">{r.tier}</div>
              <div className="display text-xl mt-1">{r.title}</div>
            </div>
            <button className="text-xs uppercase tracking-widest text-primary hover:underline">Edit</button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
          <div className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">Redeem within {r.expiresInDays} days</div>
        </div>
      ))}
    </div>
  );
}
