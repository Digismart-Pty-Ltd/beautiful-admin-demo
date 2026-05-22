import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import lfr from "@/assets/lfr-logo.png";
import hero from "@/assets/hero-runners.jpg";
import community from "@/assets/community.jpg";
import wh from "@/assets/wh-logo.jpeg";
import { useEffect, useState } from "react";
import { ArrowUpRight, Instagram, ShoppingBag, X, Check, ChevronDown } from "lucide-react";
import tshirt1 from "@/assets/Tshirt-1.jpeg";
import tshirt2 from "@/assets/Tshirt-2.jpeg";
import socks from "@/assets/socks.jpeg";

// ─── product catalogue ──────────────────────────────────────────────────────

const TSHIRT_SIZES = ["S", "M", "L", "XL"] as const;
const SOCK_SIZES = [
  { label: "Kids (5–8 yrs)", desc: "Crew only" },
  { label: "Small", desc: "UK 12–3 / EU 32–38" },
  { label: "Medium", desc: "UK 4–7 / EU 38–42" },
  { label: "Large", desc: "UK 8–12 / EU 42–47" },
  { label: "XL", desc: "UK 13+ / EU 47+" },
] as const;

type Product = {
  id: string;
  name: string;
  price: number;
  type: "tshirt" | "socks";
  colours: string[];
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "tshirt-mens",
    name: "Men's Tee",
    price: 0,
    type: "tshirt",
    colours: ["White", "Black"],
    description: "\"No One Is Chasing Us\" — LFR logo front, Little Falls Runners back. Sizes S–XL.",
  },
  {
    id: "tshirt-womens",
    name: "Women's Tee",
    price: 0,
    type: "tshirt",
    colours: ["White", "Black"],
    description: "\"No One Is Chasing Us\" — LFR logo front, Little Falls Runners back. Sizes S–XL.",
  },
  {
    id: "socks",
    name: "LFR Socks",
    price: 150,
    type: "socks",
    colours: ["Pink", "White"],
    description: "LFR logo or 'No One Is Chasing Us' text. Available in 5 sizes.",
  },
];

// ─── types ───────────────────────────────────────────────────────────────────

type OrderLine = {
  product: string;
  colour: string;
  size: string;
  qty: number;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  lines: OrderLine[];
  notes: string;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function sizesFor(type: "tshirt" | "socks") {
  if (type === "tshirt") return TSHIRT_SIZES as unknown as string[];
  return SOCK_SIZES.map((s) => s.label);
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function RunningClub() {
  useEffect(() => { document.title = "Little Falls Runners — Waven Harper Fitness"; }, []);
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={community} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="relative mx-auto max-w-md md:max-w-6xl px-5 md:px-8 pt-20 pb-20 grid md:grid-cols-[auto,1fr] gap-10 items-center">
<div className="mb-4 h-28 w-28 md:h-36 md:w-36 overflow-hidden rounded-full ring-2 ring-primary shadow-glow bg-transparent">
  <img
    src={lfr}
    alt="LFR"
    className="h-full w-full object-cover scale-110"
  />
</div>          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Community Club</div>
            <h1 className="mt-3 display text-4xl md:text-8xl leading-[0.9]">Little Falls<br />Runners.</h1>
            <p className="marker mt-4 text-primary text-3xl md:text-5xl">No one is chasing us.</p>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="mx-auto max-w-5xl px-5 md:px-8 mt-10">
        <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed">
          We meet at sunrise, after work, on Saturdays — basically whenever someone's keen.
          LFR is a no-pressure, all-paces community of runners and walkers based in Little Falls, Roodepoort.
          You don't need to be fast. You just need to show up.
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-16 grid gap-4 md:grid-cols-3">
        {[
          { k: "120+", v: "Active members" },
          { k: "4×", v: "Group runs / week" },
          { k: "0", v: "People chasing us" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="display text-4xl md:text-6xl text-primary">{s.k}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </section>

      {/* ── Merch ── */}
      <section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Represent</div>
            <h2 className="mt-2 display text-4xl md:text-6xl">Club merch.</h2>
          </div>
          <button
            onClick={() => setOrderOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow w-fit"
          >
            <ShoppingBag size={14} /> Place an order
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
  {/* White tee card */}
  <MerchCard
    label="White / Pink"
    tag="Tee — Unisex cut"
    price="POA"
    sizes="S · M · L · XL"
    imgSrc={tshirt1}
    imgAlt="White LFR tee"
  />

  {/* Black tee card */}
  <MerchCard
    label="Black / White"
    tag="Tee — Unisex cut"
    price="POA"
    sizes="S · M · L · XL"
    imgSrc={tshirt2}
    imgAlt="Black LFR tee"
  />

  {/* Socks card */}
  <MerchCard
    label="Pink & White"
    tag="LFR Socks"
    price="R150"
    sizes="Kids · S · M · L · XL"
    imgSrc={socks}
    imgAlt="LFR socks"
  />
</div>
        <p className="mt-5 text-xs text-muted-foreground">
          * T-shirt pricing confirmed on order. All orders processed manually — we'll confirm stock and cost via WhatsApp or email.
        </p>
      </section>

  {/* ── INSTAGRAM ── */}
<section className="mx-auto max-w-md md:max-w-6xl px-5 md:px-8 mt-24">{/* Heading */}
<div className="flex items-end justify-between gap-4 mb-6">
  <div>
    <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">
      Follow Along
    </div>

    <h2 className="mt-2 display text-3xl md:text-6xl leading-[0.95]">
      On Instagram.
    </h2>
  </div>
</div>

  {/* Instagram Card */}
  <div className="rounded-3xl border border-border bg-card overflow-hidden">

    {/* Top Bar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <Instagram size={12} /> Latest posts from Instagram
      </div>

      <a
        href="https://instagram.com/wavenharper"
        target="_blank"
        rel="noreferrer"
        className="text-[10px] uppercase tracking-[0.2em] text-primary flex items-center gap-0.5"
      >
        Open Instagram <ArrowUpRight size={11} />
      </a>
    </div>

    {/* Profile Row */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">

      <div className="flex items-center gap-3">

        {/* Circular Profile */}
        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary">
          <img
            src={wh}
            alt="Waven Harper"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <div className="display text-lg leading-none">
            Waven Harper
          </div>

          <div className="text-[11px] text-muted-foreground mt-1">
            @wavenharper
          </div>
        </div>
      </div>

      <button className="rounded-full border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] hover:border-primary transition">
        Follow
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
      {[
        ["48", "Posts"],
        ["1.2K", "Followers"],
        ["312", "Following"],
      ].map(([val, lbl]) => (
        <div
          key={lbl}
          className="flex flex-col items-center py-4"
        >
          <span className="display text-2xl leading-none">
            {val}
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
            {lbl}
          </span>
        </div>
      ))}
    </div>

    {/* Photo Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">

      {[hero, community, hero, community].map((img, i) => (
        <div
          key={i}
          className="aspect-square overflow-hidden bg-muted"
        >
          <img
            src={img}
            alt=""
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
        </div>
      ))}

    </div>
  </div>
</section>

      {/* ── Join CTA ── */}
      <section className="mx-auto max-w-4xl px-5 mt-24 pb-16 text-center">
        <h2 className="display text-3xl">Join the club.</h2>
        <p className="mt-4 text-muted-foreground">Membership is free for the first month. After that — only if you've actually been showing up.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/join" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow">
            Join the club
          </Link>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:border-primary">
            See events
          </Link>
        </div>
      </section>

      <SiteFooter />

      {/* ── Order Modal ── */}
      {orderOpen && <OrderModal onClose={() => setOrderOpen(false)} />}
    </div>
  );
}

// ─── merch card ──────────────────────────────────────────────────────────────

function MerchCard({
  label, tag, price, sizes, imgSrc, imgAlt,
  isPlaceholder, placeholderColour, placeholderText, lightText,
}: {
  label: string; tag: string; price: string; sizes: string;
  imgSrc?: string; imgAlt: string;
  isPlaceholder?: boolean; placeholderColour?: string; placeholderText?: string; lightText?: boolean;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-card overflow-hidden">
      <div
className="aspect-[3/4] overflow-hidden bg-secondary/20 flex items-center justify-center"
        style={isPlaceholder ? { backgroundColor: placeholderColour } : undefined}
      >
        {isPlaceholder ? (
          <span
            className="display text-3xl font-black tracking-widest select-none opacity-20"
            style={{ color: lightText ? "#fff" : "#000" }}
          >
            {placeholderText}
          </span>
        ) : (
          <img src={imgSrc} alt={imgAlt} className="h-full w-full object-contain transition duration-700 group-hover:scale-105"/>
        )}
      </div>
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{tag}</div>
        <div className="mt-1 display text-2xl">{label}</div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{sizes}</span>
          <span className="text-sm font-bold text-foreground">{price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── order modal ─────────────────────────────────────────────────────────────

function OrderModal({ onClose }: { onClose: () => void }) {
  const blank = (): OrderLine => ({ product: PRODUCTS[0].id, colour: PRODUCTS[0].colours[0], size: sizesFor(PRODUCTS[0].type)[0], qty: 1 });

  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", notes: "",
    lines: [blank()],
  });
  const [submitted, setSubmitted] = useState(false);
  const [sockGuideOpen, setSockGuideOpen] = useState(false);

  function updateLine(i: number, patch: Partial<OrderLine>) {
    const lines = form.lines.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, ...patch };
      // reset size when product changes
      if (patch.product) {
        const prod = PRODUCTS.find((p) => p.id === patch.product)!;
        updated.colour = prod.colours[0];
        updated.size = sizesFor(prod.type)[0];
      }
      return updated;
    });
    setForm({ ...form, lines });
  }

  function addLine() { setForm({ ...form, lines: [...form.lines, blank()] }); }
  function removeLine(i: number) { setForm({ ...form, lines: form.lines.filter((_, idx) => idx !== i) }); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to your backend / email / WhatsApp API here
    console.log("ORDER", form);
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 md:p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"><X size={18} /></button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check size={28} />
            </div>
            <div className="display text-3xl">Order received!</div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">
              We'll confirm your order, stock, and payment details via WhatsApp or email within 24 hours.
            </p>
            <button onClick={onClose} className="mt-8 inline-flex rounded-full border border-border px-7 py-3 text-xs uppercase tracking-[0.2em] hover:border-primary">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="display text-3xl">Place an order</div>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details and we'll be in touch to confirm.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* contact */}
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Phone / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              </div>
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" required />

              {/* order lines */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Items</div>
                <div className="space-y-3">
                  {form.lines.map((line, i) => {
                    const prod = PRODUCTS.find((p) => p.id === line.product)!;
                    return (
                      <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-[0.15em]">Item {i + 1}</span>
                          {form.lines.length > 1 && (
                            <button type="button" onClick={() => removeLine(i)} className="text-muted-foreground hover:text-destructive">
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* product */}
                        <SelectField
                          label="Product"
                          value={line.product}
                          onChange={(v) => updateLine(i, { product: v })}
                          options={PRODUCTS.map((p) => ({ value: p.id, label: `${p.name} — ${p.price ? `R${p.price}` : "POA"}` }))}
                        />

                        <div className="grid gap-3 grid-cols-3">
                          {/* colour */}
                          <SelectField
                            label="Colour"
                            value={line.colour}
                            onChange={(v) => updateLine(i, { colour: v })}
                            options={prod.colours.map((c) => ({ value: c, label: c }))}
                          />
                          {/* size */}
                          <SelectField
                            label="Size"
                            value={line.size}
                            onChange={(v) => updateLine(i, { size: v })}
                            options={sizesFor(prod.type).map((s) => ({ value: s, label: s }))}
                          />
                          {/* qty */}
                          <label className="block">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Qty</span>
                            <input
                              type="number" min={1} max={20}
                              value={line.qty}
                              onChange={(e) => updateLine(i, { qty: Number(e.target.value) })}
                              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={addLine}
                  className="mt-3 text-xs text-primary underline underline-offset-2"
                >
                  + Add another item
                </button>
              </div>

              {/* sock size guide */}
              <div className="rounded-xl border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSockGuideOpen(!sockGuideOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Sock size guide
                  <ChevronDown size={14} className={`transition ${sockGuideOpen ? "rotate-180" : ""}`} />
                </button>
                {sockGuideOpen && (
                  <div className="px-4 pb-4">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          <th className="py-1.5 pr-4">Size</th>
                          <th className="py-1.5">Fits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {SOCK_SIZES.map((s) => (
                          <tr key={s.label}>
                            <td className="py-2 pr-4 font-semibold">{s.label}</td>
                            <td className="py-2 text-muted-foreground">{s.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* notes */}
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Notes (optional)</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special requests or questions…"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-glow"
              >
                Submit order
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                Payment details will be shared once we confirm your order via WhatsApp or email.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── form helpers ─────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, required, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
