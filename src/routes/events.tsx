import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Coffee, ChevronDown, Users, AlertTriangle, X, Check, MapPinned, Lock } from "lucide-react";
import type { Event } from "@/lib/demo-data";

export const Route = createFileRoute("/events")({
  component: Events,
  head: () => ({
    meta: [
      { title: "Events — Waven Harper Fitness" },
      { name: "description", content: "Upcoming community runs with the Little Falls Runners. Book your spot." },
    ],
  }),
});

function Events() {
  const { state } = useStore();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">What's next</div>
        <h1 className="mt-3 display text-6xl md:text-8xl">Events.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">The next runs on the calendar. Book your spot, lace up, see you there.</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 grid gap-6 md:grid-cols-2 pb-10">
        {state.events.map((e) => <EventCard key={e.id} e={e} />)}
      </section>

      <SiteFooter />
    </div>
  );
}

function EventCard({ e }: { e: Event }) {
  const { currentMember, currentOpen, signUpForEvent, myRegistrationFor, attendeesFor, cancelSignup, checkIn } = useStore();
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [attendOpen, setAttendOpen] = useState(false);
  const [name, setName] = useState(currentMember?.name ?? currentOpen?.name ?? "");
  const [contact, setContact] = useState("");
  const [emergency, setEmergency] = useState("");

  const myReg = myRegistrationFor(e.id);
  const attendees = attendeesFor(e.id);
  const blocked = e.membersOnly && !currentMember;

  // race day window: 30 min before -> 2h after start
  const start = new Date(`${e.date}T${e.time}`);
  const now = new Date();
  const windowOpen = now.getTime() >= start.getTime() - 30 * 60_000 && now.getTime() <= start.getTime() + 2 * 60 * 60_000;

  function handleSignup(ev: React.FormEvent) {
    ev.preventDefault();
    const reg = signUpForEvent(e.id, { name, contact, emergency });
    if (!reg) return toast.error(blocked ? "Members only event." : "Already signed up.");
    toast.success(`You're in — ${e.title}`);
    setSignupOpen(false);
  }

  function handleCheckIn() {
    if (!("geolocation" in navigator)) {
      const r = checkIn(e.id);
      if (r?.checkedInAt) toast.success("Checked in!");
      return;
    }
    toast.info("Verifying location…");
    navigator.geolocation.getCurrentPosition(
      () => {
        const r = checkIn(e.id);
        if (r?.checkedInAt) toast.success("Checked in! Race counted.");
        else toast.error("Could not check in.");
      },
      () => {
        // permissive demo fallback
        const r = checkIn(e.id);
        if (r?.checkedInAt) toast.success("Checked in (location skipped).");
      },
      { timeout: 5000 }
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent" />
        {e.membersOnly && (
          <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">Members Only</span>
        )}
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground border border-border">
          <AlertTriangle size={11} className="text-primary" /> Run at your own risk
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary">
          <span>{e.distanceKm}K</span><span>·</span><span>{new Date(e.date).toDateString()}</span>
        </div>
        <h3 className="mt-2 display text-2xl">{e.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Info icon={Clock} label="Start" value={e.time} />
          <Info icon={Calendar} label="Date" value={new Date(e.date).toDateString().slice(4)} />
          <Info icon={MapPin} label="Meet at" value={e.meetingPlace} />
          <Info icon={Coffee} label="After-run" value={e.afterRunPlace} />
        </div>

        {!myReg && (
          <div className="mt-5 rounded-xl border border-border">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Indemnity & waiver
              <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="px-4 pb-4 text-xs text-muted-foreground space-y-2 max-h-56 overflow-y-auto">
                <p><strong className="text-foreground">Risk.</strong> Running involves inherent risks including injury, illness or death.</p>
                <p><strong className="text-foreground">Medical Fitness.</strong> I confirm I am medically fit to participate.</p>
                <p><strong className="text-foreground">Indemnity.</strong> I indemnify Little Falls Runners NPC, its directors, organisers and volunteers from any and all claims.</p>
                <p><strong className="text-foreground">Media consent.</strong> Photos and video may be used for community communication.</p>
                <p>Governed by the laws of the Republic of South Africa.</p>
              </div>
            )}
            <label className="flex items-center gap-2 px-4 pb-3 text-xs cursor-pointer">
              <input type="checkbox" checked={accepted} onChange={(ev) => setAccepted(ev.target.checked)} className="accent-primary" />
              <span>Accept all — I have read and agree to the waiver.</span>
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {blocked ? (
            <Link to="/join" className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Lock size={14} /> Members only — Join
            </Link>
          ) : myReg ? (
            <>
              {myReg.checkedInAt ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em]">
                  <Check size={14} /> Checked in
                </span>
              ) : windowOpen ? (
                <button onClick={handleCheckIn}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow">
                  <MapPinned size={14} /> Check in
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Check size={14} /> Booked
                </span>
              )}
              <button onClick={() => { cancelSignup(myReg.id); toast("Booking cancelled."); }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-destructive hover:text-destructive">
                Cancel
              </button>
            </>
          ) : (
            <button disabled={!accepted} onClick={() => setSignupOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed">
              Sign up
            </button>
          )}
          <button onClick={() => setAttendOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-primary">
            <Users size={14} /> Attendees ({attendees.length})
          </button>
        </div>

        {!currentMember && !currentOpen && !blocked && (
          <p className="mt-3 text-[11px] text-muted-foreground">
            Tip: <Link to="/join" className="text-primary underline">Join</Link> or <Link to="/login" className="text-primary underline">log in</Link> to track races and earn rewards.
          </p>
        )}
      </div>

      {signupOpen && (
        <Modal onClose={() => setSignupOpen(false)}>
          <div className="display text-2xl">Confirm spot</div>
          <p className="text-sm text-muted-foreground mt-1">{e.title} · {new Date(e.date).toDateString()}</p>
          <form onSubmit={handleSignup} className="mt-5 space-y-3">
            <Field label="Full name" value={name} onChange={setName} required />
            <Field label="Contact number" value={contact} onChange={setContact} required />
            <Field label="Emergency contact" value={emergency} onChange={setEmergency} required />
            <button className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">Confirm booking</button>
          </form>
        </Modal>
      )}

      {attendOpen && (
        <Modal onClose={() => setAttendOpen(false)}>
          <div className="display text-2xl">Who's running</div>
          <p className="text-sm text-muted-foreground mt-1">{e.title}</p>
          {attendees.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No one signed up yet. Be the first.</p>
          ) : (
            <ul className="mt-5 divide-y divide-border max-h-72 overflow-y-auto">
              {attendees.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="flex items-center gap-2">
                    {a.name}
                    {a.checkedInAt && <span className="text-[10px] uppercase tracking-widest text-primary">· in</span>}
                  </span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] ${a.openRunner ? "text-muted-foreground" : "text-primary"}`}>
                    {a.openRunner ? "Open Runner" : a.tier ?? "Member"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </article>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><Icon size={12} /> {label}</div>
      <div className="mt-1 text-foreground">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}
