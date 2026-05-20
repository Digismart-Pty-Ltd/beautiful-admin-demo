import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/join")({
  component: Join,
  head: () => ({ meta: [{ title: "Join — Waven Harper Fitness" }] }),
});

const waiverPoints = [
  ["Acknowledgement of Risk", "I acknowledge participation involves inherent risks including injury, illness or death."],
  ["Medical Fitness", "I confirm I am physically and medically fit to participate."],
  ["Indemnity & Release", "I indemnify Little Falls Runners NPC, its directors, organisers and volunteers from any and all claims."],
  ["Personal Responsibility", "I will follow safety guidance, obey road rules and run within my limits."],
  ["Voluntary Participation", "Participation is voluntary; I may withdraw at any time, at my own risk."],
  ["Media Consent", "Photos/video taken at events may be used for community communication."],
  ["Governing Law", "This agreement is governed by the laws of the Republic of South Africa."],
] as const;

function Join() {
  const nav = useNavigate();
  const { registerMember, registerOpenRunner } = useStore();
  const [tab, setTab] = useState<"member" | "open">("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [contact, setContact] = useState("");
  const [emergency, setEmergency] = useState("");
  const [checks, setChecks] = useState<boolean[]>(Array(waiverPoints.length).fill(false));
  const allChecked = checks.every(Boolean);

  function setAll(v: boolean) { setChecks(Array(waiverPoints.length).fill(v)); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return toast.error("Name & email required");
    if (tab === "member" && !allChecked) return toast.error("Please accept the full waiver to become a member.");
    if (tab === "member") {
      registerMember({ name, email });
      toast.success(`Welcome, ${name.split(" ")[0]}! You're in.`);
      nav({ to: "/membership" });
    } else {
      if (!checks[0]) return toast.error("You must accept the risk acknowledgement.");
      registerOpenRunner({ name, email });
      toast.success(`Registered as Open Runner.`);
      nav({ to: "/events" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-5 pt-14 pb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Get on the start line</div>
        <h1 className="mt-3 display text-5xl ">Join.</h1>
        <p className="mt-4 text-muted-foreground">
          Already registered? <Link to="/login" className="text-primary underline">Log in</Link>.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5">
        <div className="grid grid-cols-2 gap-2 rounded-full border border-border bg-card p-1">
          {([["member","Club Member"],["open","Open Runner"]] as const).map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)}
              className={`rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${tab===v?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 rounded-3xl border border-border bg-card p-6 space-y-4">
          <div className="grid  gap-4">
            <Field label="Full name" value={name} onChange={setName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            {tab === "member" && <>
              <Field label="ID / Passport" value={id} onChange={setId} />
              <Field label="Contact number" value={contact} onChange={setContact} />
              <div className="md:col-span-2"><Field label="Emergency contact name & number" value={emergency} onChange={setEmergency} /></div>
            </>}
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                <ShieldCheck size={14} /> Indemnity & Liability Waiver
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={allChecked} onChange={(e) => setAll(e.target.checked)} className="accent-primary" />
                Accept all
              </label>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">"No one is chasing us." — Little Falls Runners NPC</p>
            <ul className="mt-4 space-y-2">
              {waiverPoints.map(([t, body], i) => (
                <li key={t}>
                  <label className="flex items-start gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={checks[i]} onChange={(e) => setChecks((c) => c.map((v, idx) => idx === i ? e.target.checked : v))} className="accent-primary mt-0.5" />
                    <span><strong className="text-foreground">{t}.</strong> <span className="text-muted-foreground">{body}</span></span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full rounded-full bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow inline-flex items-center justify-center gap-2">
            <Check size={14} /> {tab === "member" ? "Become a member" : "Register as Open Runner"}
          </button>
          {!allChecked && tab === "member" && (
            <p className="text-center text-[11px] text-muted-foreground">Tick every box to confirm you accept the full waiver.</p>
          )}
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}{required && " *"}</span>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}
