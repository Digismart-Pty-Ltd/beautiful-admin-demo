import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import wh from "@/assets/wh-logo.jpeg";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Home" },
  { to: "/running-club", label: "Little Falls Runners" },
  { to: "/events", label: "Events" },
  { to: "/membership", label: "Rewards" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { currentMember, currentOpen, logout } = useStore();
  const navigate = useNavigate();
  const loggedIn = currentMember || currentOpen;
  const displayName = currentMember?.name ?? currentOpen?.name;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={wh} alt="Waven Harper Fitness" className="h-10 w-10 rounded-md object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <div className="display text-sm tracking-[0.2em] text-foreground">Waven Harper</div>
            <div className="text-[10px] tracking-[0.4em] text-muted-foreground">FITNESS</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary" }}
              activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          {loggedIn ? (
            <div className="ml-3 flex items-center gap-2">
              <Link to="/membership" className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs uppercase tracking-widest hover:border-primary">
                <User size={13} className="text-primary" /> {displayName?.split(" ")[0]}
              </Link>
              <button onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Log out"
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-primary hover:border-primary">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="ml-3 inline-flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                <LogIn size={13} /> Log in
              </Link>
              <Link to="/join"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90 transition">
                Join
              </Link>
            </>
          )}
        </nav>
        <button className="md:hidden rounded-md border border-border p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col px-5 py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-[0.2em] text-foreground">
                {n.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-3 flex gap-2">
              {loggedIn ? (
                <>
                  <Link to="/membership" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-widest text-center">My dashboard</Link>
                  <button onClick={() => { setOpen(false); logout(); navigate({ to: "/" }); }} className="rounded-full border border-border p-2.5"><LogOut size={14} /></button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-widest text-center">Log in</Link>
                  <Link to="/join" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground text-center">Join</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
