import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pricing, WHATSAPP_NUMBER, events } from "@/lib/demo-data";
import hero from "@/assets/hero-runners.jpg";
import gym from "@/assets/hero-gym.jpg";
import community from "@/assets/community.jpg";
import wh from "@/assets/wh-logo.jpeg";
import lfr from "@/assets/lfr-logo.jpeg";
import { ArrowUpRight, Check, Dumbbell, MapPin, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Waven — I'd like to sign up for personal training.")}`;
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-32 md:pt-32 md:pb-44">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Little Falls · Roodepoort
          </div>
          <h1 className="mt-6 display text-[14vw] md:text-[8rem] leading-[0.85] text-foreground">
            Train.<br />Run.<br /><span className="text-gradient-brand">Rise.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
            Personal training with Waven Harper and the <span className="marker text-primary">No One Is Chasing Us</span> running crew. Show up. Sign in. Earn it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={waLink} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow hover:opacity-95">
              Sign up — WhatsApp <ArrowUpRight size={16} />
            </a>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] backdrop-blur hover:border-primary">
              See next runs
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK TILES */}
      <section className="mx-auto max-w-7xl px-5 -mt-20 relative z-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Dumbbell, label: "Personal Training", to: "/", note: "1:1 with Waven" },
            { icon: Users, label: "Running Club", to: "/running-club", note: "Little Falls Runners" },
            { icon: MapPin, label: "Events", to: "/events", note: "Next 4 runs" },
            { icon: Trophy, label: "Rewards", to: "/membership", note: "Bronze → Platinum" },
          ].map((t) => (
            <Link key={t.label} to={t.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:border-primary transition">
              <t.icon className="text-primary" size={22} />
              <div className="mt-6 display text-lg">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.note}</div>
              <ArrowUpRight className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition text-primary" size={18} />
            </Link>
          ))}
        </div>
      </section>

      {/* SPLIT - Mission */}
      <section className="mx-auto max-w-7xl px-5 mt-32 grid gap-12 md:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl grain">
          <img src={gym} alt="Gym" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <img src={wh} alt="WH" className="absolute bottom-6 left-6 h-16 w-16 rounded-xl ring-2 ring-primary/60" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Our Mission</div>
          <h2 className="mt-3 display text-5xl md:text-6xl leading-none">Built for runners who turn up.</h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Waven Harper Fitness is a coaching practice and community club. We believe in the boring, beautiful work — the early alarms, the long Sunday, the slow build to fast.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {["1:1 and small-group personal training", "Periodised programmes you can actually follow", "A real club, not a hashtag", "Rewards for the work, not the talk"].map((x) => (
              <li key={x} className="flex items-start gap-3"><Check size={18} className="text-primary mt-0.5" /> <span>{x}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-7xl px-5 mt-32">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Personal Training</div>
            <h2 className="mt-2 display text-5xl md:text-6xl">Pick your weight.</h2>
          </div>
          <a href={waLink} target="_blank" rel="noreferrer" className="text-sm uppercase tracking-[0.2em] text-primary hover:underline">Chat on WhatsApp →</a>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricing.map((p) => (
            <div key={p.name}
              className={`relative rounded-3xl border p-7 ${p.highlight ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-glow" : "border-border bg-card"}`}>
              {p.highlight && <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">Most popular</div>}
              <div className="display text-2xl">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="display text-5xl">R{p.price}</span>
                <span className="text-muted-foreground text-sm">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check size={16} className="text-primary mt-0.5" /> {f}</li>
                ))}
              </ul>
              <a href={waLink} target="_blank" rel="noreferrer"
                 className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${p.highlight ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:border-primary"}`}>
                Sign up
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* NEXT RUNS PREVIEW */}
      <section className="mx-auto max-w-7xl px-5 mt-32">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="display text-5xl md:text-6xl">Next on the road.</h2>
          <Link to="/events" className="text-sm uppercase tracking-[0.2em] text-primary hover:underline">All events →</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {events.slice(0, 4).map((e) => (
            <Link key={e.id} to="/events" className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[4/5]">
                <img src={e.image} alt={e.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                {e.membersOnly && <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">Members</span>}
                <div className="absolute bottom-0 p-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{new Date(e.date).toDateString().slice(0, 10)} · {e.time}</div>
                  <div className="display text-lg mt-1 leading-tight">{e.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mt-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={community} alt="" className="h-full w-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
          <img src={lfr} alt="LFR" className="h-20 w-20 rounded-full ring-2 ring-primary mb-6" />
          <div className="marker text-primary text-2xl md:text-4xl">"No one is chasing us."</div>
          <h2 className="mt-3 display text-5xl md:text-7xl max-w-3xl">A club for runners, not a brand for posters.</h2>
          <Link to="/running-club" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-background hover:opacity-90">
            Meet the crew
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
