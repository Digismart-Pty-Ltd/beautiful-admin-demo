import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, Megaphone } from "lucide-react";
import whfLogo from "@/assets/lfr-logo-clean.png"; // ← swap for your actual Waven Harper Fitness logo asset
import { subscribeToActiveAdvertisements, type Advertisement } from "@/lib/advertService";

const ROTATE_MS = 6000;

export default function AdvertiseBanner() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsub = subscribeToActiveAdvertisements(setAds);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (ads.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ads.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <section className="mt-8">
        <Link
          to="/advertise"
          className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-dashed border-border bg-card px-6 py-6 hover:border-primary transition-colors"
        >
          <img
            src={whfLogo}
            alt="Waven Harper Fitness"
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-1.5">
              <Megaphone size={12} /> Sponsored spot open
            </div>
            <div className="mt-1 display text-xl">Advertise here.</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Put your business in front of our community — apply in minutes.
            </p>
          </div>
          <ArrowUpRight
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
          />
        </Link>
      </section>
    );
  }

  const ad = ads[index];

  return (
    <section className="mt-8">
      <a
        href={ad.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border bg-card px-6 py-6 hover:border-primary transition-colors"
      >
        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 border border-border">
          <img
            src={ad.logoUrl}
            alt={ad.businessName}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Sponsored</div>
          <div className="mt-1 display text-xl truncate">{ad.businessName}</div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{ad.slogan}</p>
        </div>
        <ArrowUpRight
          size={16}
          className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
        />
      </a>
      {ads.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {ads.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all ${
                i === index ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}