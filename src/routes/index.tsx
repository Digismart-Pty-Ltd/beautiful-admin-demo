import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pricing, WHATSAPP_NUMBER } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero-runners.jpg";
import community from "@/assets/community.jpg";
import lfr from "@/assets/lfr-logo.jpeg";
import {
  ArrowUpRight, Check, Dumbbell, Flame, MapPin, Sparkles, Trophy, Users, Clock, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { state, currentMember, currentOpen } = useStore();
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Waven — I'd like to sign up for personal training.")}`;
  const upcoming = state.events.slice(0, 4);
  const name = (currentMember?.name ?? currentOpen?.name ?? "Runner").split(" ")[0];
  const races = currentMember?.races ?? 0;
  const tier = currentMember?.tier ?? "Guest";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-4 md:pt-10 pb-2">
        {/* Greeting */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Good run, runner</div>
            <h1 className="mt-1 display text-4xl leading-none">
              Hey <span className="text-gradient-brand">{name}.</span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-primary">
            <Flame size={13} /> {races} runs
          </div>
        </div>

        {/* Hero card */}
        <section className="relative mt-5 overflow-hidden rounded-3xl border border-border shadow-glow">
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-primary/30" />
          <div className="relative p-6 md:p-12 pt-7 min-h-[260px] md:min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 text-[9px] uppercase tracking-[0.3em] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Little Falls · Roodepoort
              </div>
              <div className="mt-5 display text-[44px] md:text-[96px] leading-[0.9]">
                Train.<br />Run.<br /><span className="text-gradient-brand">Rise.</span>
              </div>
              <p className="mt-3 md:mt-6 text-xs md:text-base text-muted-foreground max-w-[220px] md:max-w-md">
                Show up. Sign in. Earn it. The <span className="marker text-primary">no one is chasing us</span> crew is loading.
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <Link to="/events"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                Next runs <ArrowUpRight size={13} />
              </Link>
              <a href={waLink} target="_blank" rel="noreferrer"
                 className="rounded-full border border-border bg-background/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
                PT
              </a>
            </div>
          </div>
        </section>

        {/* Quick stats / tier strip */}
        <section className="mt-5 md:mt-8 grid grid-cols-3 gap-2.5 md:gap-5">
          <Stat icon={Trophy} label="Tier" value={tier} />
          <Stat icon={Sparkles} label="Rewards" value={String(state.rewards.length)} />
          <Stat icon={Users} label="Crew" value={String(state.members.length + state.openRunners.length)} />
        </section>

        {/* Action chips */}
        <section className="mt-6">
          <SectionLabel>Quick actions</SectionLabel>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <Action icon={Dumbbell} title="Personal Training" sub="1:1 with Waven" to="/" highlight />
            <Action icon={MapPin} title="Find a Run" sub="Open this week" to="/events" />
            <Action icon={Users} title="Little Falls" sub="The club" to="/running-club" />
            <Action icon={Trophy} title="My Rewards" sub="Bronze → Platinum" to="/membership" />
          </div>
        </section>

        {/* Next runs (horizontal scroll) */}
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <SectionLabel>Next on the road</SectionLabel>
            <Link to="/events" className="text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-0.5">
              All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="mt-3 -mx-5 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-5 pb-2 min-w-min">
              {upcoming.map((e) => (
                <Link to="/events" key={e.id}
                  className="group relative w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative h-[150px]">
                    <img src={e.image} alt={e.title} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105 duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    {e.membersOnly && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                        Members
                      </span>
                    )}
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-background/70 backdrop-blur px-2 py-0.5 text-[9px] uppercase tracking-widest border border-border">
                      {e.distanceKm}K
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-primary flex items-center gap-1">
                      <Clock size={10} /> {new Date(e.date).toDateString().slice(4, 10)} · {e.time}
                    </div>
                    <div className="mt-1 display text-[15px] leading-tight line-clamp-2">{e.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-8">
          <SectionLabel>Personal Training</SectionLabel>
          <h2 className="mt-1 display text-2xl">Pick your weight.</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-5">
            {pricing.map((p) => (
              <div key={p.name}
                className={`relative rounded-2xl border p-5 ${
                  p.highlight
                    ? "border-primary bg-gradient-to-br from-primary/12 via-card to-card shadow-glow"
                    : "border-border bg-card"
                }`}>
                {p.highlight && (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <div className="display text-lg">{p.name}</div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="display text-3xl">R{p.price}</span>
                    <span className="text-[10px] text-muted-foreground">{p.period}</span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[12px]">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-muted-foreground">
                      <Check size={13} className="text-primary mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a href={waLink} target="_blank" rel="noreferrer"
                  className={`mt-4 inline-flex w-full justify-center rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    p.highlight ? "bg-primary text-primary-foreground" : "border border-border"
                  }`}>
                  Sign up
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section className="mt-8 relative overflow-hidden rounded-3xl border border-border">
          <img src={community} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-primary/20" />
          <div className="relative p-6">
            <img src={lfr} alt="LFR" className="h-12 w-12 rounded-full ring-2 ring-primary mb-3" />
            <div className="marker text-primary text-lg">"No one is chasing us."</div>
            <h2 className="mt-1 display text-2xl leading-tight">A club for runners,<br />not a brand for posters.</h2>
            <Link to="/running-club"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-background">
              Meet the crew <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">{children}</div>;
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <Icon size={14} className="text-primary" />
      <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="display text-base leading-none mt-1">{value}</div>
    </div>
  );
}

function Action({ icon: Icon, title, sub, to, highlight }: { icon: any; title: string; sub: string; to: string; highlight?: boolean }) {
  return (
    <Link to={to}
      className={`group relative overflow-hidden rounded-2xl border p-4 min-h-[110px] flex flex-col justify-between ${
        highlight ? "border-primary/60 bg-gradient-to-br from-primary/15 to-card" : "border-border bg-card"
      } hover:border-primary transition`}>
      <Icon size={20} className="text-primary" />
      <div>
        <div className="display text-sm leading-tight">{title}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <ArrowUpRight size={14} className="absolute right-3 top-3 text-muted-foreground group-hover:text-primary transition" />
    </Link>
  );
}
