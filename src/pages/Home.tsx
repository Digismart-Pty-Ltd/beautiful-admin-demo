import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WHATSAPP_NUMBER } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero-runners.jpg";
import community from "@/assets/community.jpg";
import lfr from "@/assets/lfr-logo.png";
import wh from "@/assets/wh-logo.jpeg";
import trainerPhoto from "@/assets/trainer.png";
import {
  ArrowUpRight, Dumbbell, MapPin, Users, Clock, ChevronRight, Instagram,
} from "lucide-react";

export default function Home() {
  const { state, currentMember, currentOpen } = useStore();
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Waven — I'd like to sign up for personal training.")}`;
  const upcoming = state.events.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-4 md:pt-10 pb-2">

        {/* ── HERO: Trainer photo card ── */}
        <section className="relative overflow-hidden rounded-3xl border border-border">
          <img
            src={trainerPhoto}
            alt="Waven Harper"
            className="w-full h-[340px] md:h-[500px] object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-1">
              Waven Harper Fitness
            </div>
            <div className="display text-3xl leading-tight text-foreground">Personal Trainer</div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin size={11} /> Roodepoort
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="mt-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-3">About</div>
          <h2 className="display text-3xl md:text-5xl leading-tight mb-4">
            More than a personal trainer.<br />Real results.
          </h2>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              <span className="display text-foreground text-base">Meet Waven Harper</span>
            </p>
            <p>
              Fitness has always been more than just training for me — it's about transformation, discipline, and helping people become the strongest version of themselves, both physically and mentally.
            </p>
            <p>
              With over 13 years of experience in the fitness industry as a qualified personal trainer, I've dedicated my career to helping individuals achieve real, lasting results. My journey started with a passion for self-improvement and quickly grew into a purpose-driven career focused on motivating and empowering others through health and fitness.
            </p>
            <p>
              Over the years, I've worked with people from all walks of life, helping them build confidence, improve their strength, lose weight, and create healthier lifestyles that are sustainable long term. My training philosophy combines discipline, consistency, and personalised coaching to ensure every client feels supported throughout their fitness journey.
            </p>
            <p>
              I chose the fitness industry because I genuinely love seeing people transform — not just physically, but mentally and emotionally too. There's nothing more rewarding than helping someone achieve goals they once believed were impossible.
            </p>
            <p>
              As a trainer, my goal is to create an environment where people feel motivated, challenged, and inspired to become the best version of themselves. Whether you're just starting out or looking to take your fitness to the next level, I'm here to guide you every step of the way.
            </p>
            <p>
              My mission is simple: to help people unlock their full potential through fitness, confidence, and consistency.
            </p>
            <p className="text-foreground font-medium">
              Welcome to the journey.<br />
              <span className="text-primary display text-base">— Waven Harper</span>
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6 mb-6">
            {["Strength Training", "Personal Training", "Weight Loss", "Nutrition Guidance", "Body Transformation"].map((tag) => (
              <span key={tag} className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-background"
            >
              Book a session <ArrowUpRight size={13} />
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Contact us
            </a>
          </div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="mt-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-3">Quick Links</div>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink icon={Dumbbell} title="Personal Trainer" sub="1:1 sessions with Waven" to="/" highlight />
            <QuickLink icon={MapPin} title="Find a Run" sub="Upcoming events this week" to="/events" />
          </div>
        </section>

      

        {/* ── UPCOMING RUNS ── */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">Upcoming Runs</div>
            <Link to="/events" className="text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="-mx-5 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-5 pb-2 min-w-min">
              {upcoming.map((e) => (
                <Link to="/events" key={e.id}
                  className="group relative w-[180px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative h-[140px]">
                    <img src={e.image} alt={e.title} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105 duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    {e.membersOnly && (
                      <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                        Members
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-primary flex items-center gap-1">
                        <Clock size={9} /> {new Date(e.date).toDateString().slice(4, 10)} · {e.distanceKm}K
                      </div>
                      <div className="mt-0.5 display text-[14px] leading-tight line-clamp-2 text-foreground">{e.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Community / Running Club */}
        <section className="mt-8 relative overflow-hidden rounded-3xl border border-border">
          <img src={community} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-primary/20" />
          <div className="relative p-6">
            <div className="mb-4">
<div className="mb-4 h-28 w-28 md:h-36 md:w-36 overflow-hidden rounded-full ring-2 ring-primary shadow-glow bg-transparent">
  <img
    src={lfr}
    alt="LFR"
    className="h-full w-full object-cover scale-110"
  />
</div>
</div>
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

/* ── Sub-components ── */

function QuickLink({ icon: Icon, title, sub, to, highlight }: { icon: any; title: string; sub: string; to: string; highlight?: boolean }) {
  return (
    <Link to={to}
      className={`group relative overflow-hidden rounded-2xl border p-4 min-h-[90px] flex flex-col justify-between ${
        highlight ? "border-primary/60 bg-gradient-to-br from-primary/15 to-card" : "border-border bg-card"
      } hover:border-primary transition`}>
      <Icon size={18} className="text-primary" />
      <div>
        <div className="display text-sm leading-tight">{title}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <ArrowUpRight size={13} className="absolute right-3 top-3 text-muted-foreground group-hover:text-primary transition" />
    </Link>
  );
}
