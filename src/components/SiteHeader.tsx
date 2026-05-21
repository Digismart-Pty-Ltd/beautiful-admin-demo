import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import wh from "@/assets/wh-logo.jpeg";
import { useStore } from "@/lib/store";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/events", label: "Runs" },
  { to: "/running-club", label: "Club" },
  { to: "/membership", label: "Rewards" },
] as const;

export function SiteHeader() {
  const { currentMember, currentOpen, logout } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const loggedIn = currentMember || currentOpen;
  const name = currentMember?.name ?? currentOpen?.name;
  const initials = (name ?? "Guest")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto flex max-w-md md:max-w-6xl items-center justify-between px-5 md:px-8 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={wh} alt="WH" className="h-9 w-9 md:h-11 md:w-11 rounded-xl object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <div className="display text-[13px] md:text-base tracking-[0.2em]">Waven Harper</div>
            <div className="text-[9px] md:text-[10px] tracking-[0.35em] text-muted-foreground">FITNESS · LFR</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.25em] transition ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="relative h-9 w-9 md:h-10 md:w-10 rounded-full border border-border grid place-items-center text-muted-foreground hover:text-primary">
            <Bell size={15} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          {loggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link to="/membership"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-[11px] font-bold text-primary-foreground uppercase">
                {initials}
              </Link>
              <button onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Log out"
                className="h-9 w-9 md:h-10 md:w-10 grid place-items-center rounded-full border border-border text-muted-foreground hover:text-primary">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/join"
              className="rounded-full bg-primary px-4 md:px-5 py-2 md:py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              Join
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
