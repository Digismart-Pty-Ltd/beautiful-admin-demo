import { useEffect, useState } from "react";
import { ArrowUpRight, Megaphone } from "lucide-react";
import {
  isAdvertisementLive,
  subscribeToAdvertisements,
  type Advertisement,
} from "@/lib/advertService";

export default function Advertisements() {
  const [adverts, setAdverts] = useState<Advertisement[]>([]);

  useEffect(() => {
    document.title = "Advertisements - Waven Harper Fitness";
    return subscribeToAdvertisements((rows) => {
      setAdverts(rows.filter((ad) => isAdvertisementLive(ad)));
    });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-16 pb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Our partners</div>
        <h1 className="mt-3 display text-4xl md:text-6xl">Advertisements.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
          Businesses supporting the Waven Harper Fitness community.
        </p>
      </section>

      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pb-24">
        {adverts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No active advertisements right now.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {adverts.map((ad) => {
              const imageUrl = ad.imageUrl || ad.logoUrl;
              const isBanner = ad.adType === "banner";
              return (
                <a
                  key={ad.id}
                  href={ad.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
                >
                  <div
                    className={`flex items-center justify-center overflow-hidden bg-white p-4 ${
                      isBanner ? "aspect-[4/1]" : "h-40"
                    }`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={ad.businessName}
                        loading="lazy"
                        decoding="async"
                        className={isBanner ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain"}
                      />
                    ) : (
                      <Megaphone className="text-muted-foreground" size={28} />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-primary">
                        Sponsored
                      </div>
                      <h2 className="mt-1 display text-xl truncate">{ad.businessName}</h2>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ad.slogan}</p>
                    </div>
                    <ArrowUpRight className="shrink-0 text-muted-foreground group-hover:text-foreground" size={18} />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
