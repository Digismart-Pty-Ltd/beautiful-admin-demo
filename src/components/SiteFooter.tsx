import { Link, useLocation } from "@tanstack/react-router";
import { Home, CalendarDays, Trophy, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/events", label: "Runs", icon: CalendarDays },
  { to: "/running-club", label: "Club", icon: User },
  { to: "/membership", label: "Rewards", icon: Trophy },
];

export function SiteFooter() {
  const { pathname } = useLocation();
  return (
    <>
      {/* spacer so content isn't covered (mobile only) */}
      <div aria-hidden className="h-28 md:hidden" />
      <nav className="fixed bottom-0 inset-x-0 z-40 pointer-events-none md:hidden">
        <div className="mx-auto max-w-md px-4 pb-4 pointer-events-auto">
          <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-glow px-2 py-2 grid grid-cols-4 gap-1">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition ${
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold">{t.label}</span>
                  {active && <span className="absolute -top-1 h-1 w-6 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
