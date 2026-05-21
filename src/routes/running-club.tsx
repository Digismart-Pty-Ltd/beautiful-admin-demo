import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import lfr from "@/assets/lfr-logo.jpeg";
import community from "@/assets/community.jpg";
import { events } from "@/lib/demo-data";
import { Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/running-club")({
  component: RunningClub,
  head: () => ({
    meta: [
      { title: "Little Falls Runners — Waven Harper Fitness" },
      { name: "description", content: "Community running club based in Little Falls. No one is chasing us." },
    ],
  }),
});

function RunningClub() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={community} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="relative mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-20 pb-20 grid md:grid-cols-[auto,1fr] gap-10 items-center">
          <img src={lfr} alt="Little Falls Runners" className="h-44 w-44 md:h-72 md:w-72 rounded-full ring-2 ring-primary shadow-glow" />
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Community Club</div>
            <h1 className="mt-3 display text-4xl md:text-8xl leading-[0.9]">Little Falls<br />Runners.</h1>
            <p className="marker mt-4 text-primary text-3xl md:text-5xl">No one is chasing us.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 mt-10">
        <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed">
          We meet at sunrise, after work, on Saturdays — basically whenever someone's keen.
          LFR is a no-pressure, all-paces community of runners and walkers based in Little Falls, Roodepoort.
          You don't need to be fast. You just need to show up.
        </p>
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-16 grid gap-4 md:grid-cols-3">
        {[
          { k: "120+", v: "Active members" },
          { k: "4×", v: "Group runs / week" },
          { k: "0", v: "People chasing us" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="display text-4xl md:text-6xl text-primary">{s.k}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-20">
        <h2 className="display text-4xl md:text-6xl">Upcoming runs</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {events.slice(0, 4).map((e) => (
            <div key={e.id} className="flex gap-5 rounded-2xl border border-border bg-card p-4">
              <img src={e.image} alt={e.title} className="h-28 w-28 md:h-36 md:w-36 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{e.distanceKm}K · {e.time}</div>
                <div className="display text-xl md:text-2xl truncate">{e.title}</div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2"><Calendar size={12} /> {new Date(e.date).toDateString()}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2"><MapPin size={12} /> {e.meetingPlace}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 mt-24 pb-16 text-center">
        <h2 className="display text-3xl ">Join the club.</h2>
        <p className="mt-4 text-muted-foreground">Membership is free for the first month. After that — only if you've actually been showing up.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/join" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow">
            Join the club
          </Link>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:border-primary">
            See events
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
