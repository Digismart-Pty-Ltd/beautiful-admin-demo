import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="display text-2xl">WAVEN HARPER<span className="text-primary">.</span></div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Personal training, community running, and a rewards system that actually means something.
          </p>
        </div>
        <div className="text-sm">
          <div className="display text-xs tracking-[0.3em] text-muted-foreground mb-3">Explore</div>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/running-club" className="hover:text-primary">Little Falls Runners</Link></li>
            <li><Link to="/events" className="hover:text-primary">Events</Link></li>
            <li><Link to="/membership" className="hover:text-primary">Membership & Rewards</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="display text-xs tracking-[0.3em] text-muted-foreground mb-3">Contact</div>
          <p className="text-muted-foreground">Clubhouse, Wilgerood Rd<br />Little Falls, Roodepoort</p>
          <p className="mt-3 text-muted-foreground">hello@wavenharper.fit</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} Waven Harper Fitness · No one is chasing us
      </div>
    </footer>
  );
}
