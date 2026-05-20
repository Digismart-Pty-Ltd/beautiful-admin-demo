import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Log in — Waven Harper Fitness" }] }),
});

function Login() {
  const nav = useNavigate();
  const { loginByEmail, state } = useStore();
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loginByEmail(email)) {
      toast.success("Welcome back!");
      nav({ to: "/membership" });
    } else {
      toast.error("No account with that email. Try joining instead.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-md px-5 pt-20">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Welcome back</div>
        <h1 className="mt-3 display text-3xl">Log in.</h1>
        <form onSubmit={submit} className="mt-8 rounded-3xl border border-border bg-card p-6 space-y-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">Log in</button>
          <p className="text-xs text-muted-foreground text-center">
            No account? <Link to="/join" className="text-primary underline">Join the club</Link>
          </p>
          <div className="border-t border-border pt-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Demo accounts</p>
            <div className="mt-2 grid gap-1 text-xs">
              {state.members.slice(0, 3).map((m) => (
                <button type="button" key={m.id} onClick={() => setEmail(m.email)}
                  className="text-left text-muted-foreground hover:text-primary">
                  {m.email} <span className="text-primary">· {m.tier}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
