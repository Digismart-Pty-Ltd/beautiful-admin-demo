import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import wh from "@/assets/wh-logo.jpeg";
import { useStore } from "@/lib/store";

export function SiteHeader() {
  const { currentMember, currentOpen, logout } = useStore();
  const navigate = useNavigate();
  const loggedIn = currentMember || currentOpen;
  const name = currentMember?.name ?? currentOpen?.name;
  const initials = (name ?? "Guest")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={wh} alt="WH" className="h-9 w-9 rounded-xl object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <div className="display text-[13px] tracking-[0.2em]">Waven Harper</div>
            <div className="text-[9px] tracking-[0.35em] text-muted-foreground">FITNESS · LFR</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="relative h-9 w-9 rounded-full border border-border grid place-items-center text-muted-foreground hover:text-primary">
            <Bell size={15} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          {loggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link to="/membership"
                className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-[11px] font-bold text-primary-foreground uppercase">
                {initials}
              </Link>
              <button onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Log out"
                className="h-9 w-9 grid place-items-center rounded-full border border-border text-muted-foreground hover:text-primary">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/join"
              className="rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              Join
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
