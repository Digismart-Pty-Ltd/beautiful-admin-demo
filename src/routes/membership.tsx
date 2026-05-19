import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { events, rewards, type Tier } from "@/lib/demo-data";
import { Award, Calendar, Gift, Trophy } from "lucide-react";

export const Route = createFileRoute("/membership")({
  component: Membership,
  head: () => ({
    meta: [
      { title: "Membership & Rewards — Waven Harper Fitness" },
      { name: "description", content: "Track your races, climb the tiers, redeem rewards." },
    ],
  }),
});

const me = { name: "Thandi Mokoena", tier: "Gold" as Tier, races: 27, nextTier: "Platinum", needed: 9 };

const tierMeta: Record<Tier, { color: string; need: number }> = {
  Bronze: { color: "var(--bronze)", need: 0 },
  Silver: { color: "var(--silver)", need: 12 },
  Gold: { color: "var(--gold)", need: 24 },
  Platinum: { color: "var(--platinum)", need: 36 },
};

function Membership() {
  const progress = Math.min(100, (me.races / 36) * 100);
  const myRewards = rewards.filter((r) => r.tier === me.tier || r.tier === "Special");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-16 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Member Dashboard</div>
        <h1 className="mt-3 display text-5xl md:text-7xl">Hey {me.name.split(" ")[0]}.</h1>
        <p className="mt-3 text-muted-foreground">Here's where you stand.</p>
      </section>

      {/* Stat cards */}
      <section className="mx-auto max-w-7xl px-5 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-7">
          <Trophy className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Current tier</div>
          <div className="mt-2 display text-5xl" style={{ color: tierMeta[me.tier].color }}>{me.tier}</div>
          <div className="mt-1 text-xs text-muted-foreground">{me.needed} more races to {me.nextTier}</div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <Calendar className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Races this year</div>
          <div className="mt-2 display text-6xl">{me.races}</div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <Gift className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Rewards available</div>
          <div className="mt-2 display text-6xl">{myRewards.length}</div>
        </div>
      </section>

      {/* Tier ladder */}
      <section className="mx-auto max-w-7xl px-5 mt-16">
        <h2 className="display text-3xl md:text-4xl">Tier progress</h2>
        <div className="mt-6 rounded-3xl border border-border bg-card p-8">
          <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {(["Bronze", "Silver", "Gold", "Platinum"] as Tier[]).map((t) => (
              <div key={t} className={`rounded-xl border p-4 text-center ${me.tier === t ? "border-primary bg-primary/10" : "border-border"}`}>
                <Award className="mx-auto" style={{ color: tierMeta[t].color }} />
                <div className="mt-2 display text-lg" style={{ color: tierMeta[t].color }}>{t}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{tierMeta[t].need}+ races</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Tiers reset every January 1. Platinum stays if you log 12+ races in any 6-month window.</p>
        </div>
      </section>

      {/* Rewards */}
      <section className="mx-auto max-w-7xl px-5 mt-16">
        <h2 className="display text-3xl md:text-4xl">Your rewards</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {myRewards.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
              <div className="rounded-xl bg-primary/15 p-3"><Gift className="text-primary" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="display text-lg">{r.title}</div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{r.tier}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">Redeem</button>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Expires in {r.expiresInDays} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="mx-auto max-w-7xl px-5 mt-16">
        <h2 className="display text-3xl md:text-4xl">Your upcoming runs</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {events.slice(0, 3).map((e) => (
            <div key={e.id} className="flex items-center justify-between p-5">
              <div>
                <div className="display text-lg">{e.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(e.date).toDateString()} · {e.time} · {e.meetingPlace}</div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary">Booked</span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
