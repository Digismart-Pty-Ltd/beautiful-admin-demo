import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import wh from "@/assets/wh-logo.jpeg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/running-club", label: "Little Falls Runners" },
  { to: "/events", label: "Events" },
  { to: "/membership", label: "Rewards" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/events"
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90 transition"
          >
            Book a Run
          </Link>
        </nav>
        <button
          className="md:hidden rounded-md border border-border p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col px-5 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-[0.2em] text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
