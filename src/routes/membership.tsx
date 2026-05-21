import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStore, nextTierInfo } from "@/lib/store";
import { toast } from "sonner";
import { Award, Calendar, Gift, Lock, Trophy } from "lucide-react";
import type { Tier } from "@/lib/demo-data";

export const Route = createFileRoute("/membership")({
  component: Membership,
  head: () => ({
    meta: [
      { title: "Membership & Rewards — Waven Harper Fitness" },
      { name: "description", content: "Track your races, climb the tiers, redeem rewards." },
    ],
  }),
});

const tierMeta: Record<Tier, { color: string; need: number }> = {
  Bronze: { color: "var(--bronze)", need: 0 },
  Silver: { color: "var(--silver)", need: 12 },
  Gold: { color: "var(--gold)", need: 24 },
  Platinum: { color: "var(--platinum)", need: 36 },
};

function Membership() {
  const { currentMember, currentOpen, state, redeem, myRedemptions } = useStore();

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Lock size={11} className="text-primary" /> Members only
          </div>
          <h1 className="mt-6 display text-3xl ">{currentOpen ? "Upgrade to Member" : "Join to unlock."}</h1>
          <p className="mt-4 text-muted-foreground">
            {currentOpen
              ? `Hey ${currentOpen.name.split(" ")[0]} — Open Runners can join the easy runs, but the tier system, rewards and Members-only events live behind a full club registration.`
              : "Tier progression, rewards and your race history live here. Become a member to start counting your runs."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/join" className="rounded-full bg-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow">Join the club</Link>
            <Link to="/login" className="rounded-full border border-border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-primary">Log in</Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const me = currentMember;
  const { next, needed, target } = nextTierInfo(me.races);
  const progress = Math.min(100, (me.races / target) * 100);
  const myRewards = state.rewards.filter((r) => r.tier === me.tier || r.tier === "Special");
  const redeemed = new Set(myRedemptions().map((r) => r.rewardId));
  const myUpcoming = state.events.filter((e) =>
    state.registrations.some((r) => r.eventId === e.id && r.userId === me.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-16 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Member Dashboard</div>
        <h1 className="mt-3 display text-3xl ">Hey {me.name.split(" ")[0]}.</h1>
        <p className="mt-3 text-muted-foreground">Here's where you stand.</p>
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 grid gap-5 ">
        <div className="rounded-3xl border border-border bg-card p-7">
          <Trophy className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Current tier</div>
          <div className="mt-2 display text-3xl" style={{ color: tierMeta[me.tier].color }}>{me.tier}</div>
          <div className="mt-1 text-xs text-muted-foreground">{needed === 0 ? "Top tier reached" : `${needed} more races to ${next}`}</div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <Calendar className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Races this year</div>
          <div className="mt-2 display text-4xl">{me.races}</div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <Gift className="text-primary" />
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Rewards available</div>
          <div className="mt-2 display text-4xl">{myRewards.length - redeemed.size}</div>
        </div>
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-16">
        <h2 className="display text-3xl ">Tier progress</h2>
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

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-16">
        <h2 className="display text-3xl ">Your rewards</h2>
        {myRewards.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nothing in your tier yet. Keep stacking races.</p>
        ) : (
          <div className="mt-6 grid gap-4 ">
            {myRewards.map((r) => {
              const isRedeemed = redeemed.has(r.id);
              return (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
                  <div className="rounded-xl bg-primary/15 p-3"><Gift className="text-primary" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="display text-lg">{r.title}</div>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{r.tier}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button disabled={isRedeemed} onClick={() => { redeem(r.id); toast.success(`Redeemed: ${r.title}`); }}
                        className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed">
                        {isRedeemed ? "Redeemed" : "Redeem"}
                      </button>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Expires in {r.expiresInDays} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-16 pb-10">
        <h2 className="display text-3xl ">Your upcoming runs</h2>
        {myUpcoming.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No bookings yet. <Link to="/events" className="text-primary underline">See events</Link>.</p>
        ) : (
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
            {myUpcoming.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-5">
                <div>
                  <div className="display text-lg">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(e.date).toDateString()} · {e.time} · {e.meetingPlace}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-primary">Booked</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
