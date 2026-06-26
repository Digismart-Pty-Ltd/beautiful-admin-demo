import { useEffect } from "react";
import { ArrowUpRight, Instagram, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Gallery() {
  useEffect(() => {
    document.title = "Gallery — Little Falls Runners";
  }, []);

  return (
    <div className="min-h-screen bg-background">

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-16 pb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Community</div>
        <h1 className="mt-3 display text-4xl md:text-7xl">Gallery.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
          Moments from the road. Follow along on Instagram for more.
        </p>
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pb-20">
        <div className="rounded-3xl border border-border bg-card overflow-visible">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Instagram size={12} /> Latest posts from Instagram
            </div>
            <a
              href="https://www.instagram.com/littlefallsrunners"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-0.5"
            >
              Open Instagram <ArrowUpRight size={11} />
            </a>
          </div>

          {/* Elfsight Feed — isolation prevents z-index conflicts with the lightbox */}
          <div className="p-2 md:p-4" style={{ isolation: "auto" }}>
            <script src="https://elfsightcdn.com/platform.js" async></script>
            <div
              className="elfsight-app-3ccf5b0d-6644-40ea-a8cf-41e7c993aa40"
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>
      </section>

    </div>
  );
}