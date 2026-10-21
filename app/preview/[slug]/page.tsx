import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Check, MapPin, Phone, Star } from "lucide-react";
import { PREVIEWS, getPreview, type PreviewLead } from "@/lib/previews";
import { TRADES } from "@/lib/previews/trades";
import { QuoteForm } from "./quote-form";

/**
 * A website preview built for one real local business (from a Google Maps lead
 * list), linked from the cold email offering it to them. Not indexed, and only
 * reachable by its link: slugs carry a short hash.
 */

const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-pv-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-pv-sans" });

export const dynamicParams = false;

export function generateStaticParams() {
  return PREVIEWS.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lead = getPreview((await params).slug);
  if (!lead) return {};
  const trade = TRADES[lead.trade];
  return {
    title: `${lead.short} | ${trade.label} in ${lead.place}`,
    description: `${lead.short}: ${trade.label.toLowerCase()} in ${lead.place}. Call for a free quote.`,
    robots: { index: false, follow: false },
  };
}

const DISPLAY = "font-[family-name:var(--font-pv-display)] tracking-[-0.02em]";
const BTN =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-bold transition-transform hover:-translate-y-px";
const ACCENT_BTN = `${BTN} bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_10px_24px_-10px_var(--accent)]`;

function CallButton({ phone, label, className }: { phone: PreviewLead["phone"]; label?: string; className: string }) {
  if (!phone) {
    return (
      <a href="#quote" className={className}>
        Get a free quote
      </a>
    );
  }
  return (
    <a href={`tel:${phone.tel}`} className={className}>
      <Phone className="size-[18px]" />
      <span>{label ?? `Call ${phone.display}`}</span>
    </a>
  );
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="mb-11 max-w-[640px]">
      <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--brand)]">{kicker}</span>
      <h2 className={`${DISPLAY} mt-2.5 mb-3 text-[28px] leading-tight font-bold sm:text-[40px]`}>{title}</h2>
      {text && <p className="text-lg text-slate-600">{text}</p>}
    </div>
  );
}

export default async function PreviewPage({ params }: Props) {
  const lead = getPreview((await params).slug);
  if (!lead) notFound();

  const trade = TRADES[lead.trade];
  const copy = { short: lead.short, city: lead.city, place: lead.place };
  const [headline, accentLine] = trade.headline(copy);
  const [bandTitle, bandText] = trade.band(copy);
  const { phone } = lead;
  const initials =
    lead.short
      .replace(/[^A-Za-z0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "★";
  const colors = {
    "--brand": trade.colors.brand,
    "--dark": trade.colors.dark,
    "--accent": trade.colors.accent,
    "--accent-ink": trade.colors.ink,
    "--tint": trade.colors.tint,
  } as React.CSSProperties;

  const logo = (
    <a href="#top" className={`${DISPLAY} flex min-w-0 items-center gap-2.5 text-lg font-extrabold`}>
      <span className="grid size-[38px] flex-none place-items-center rounded-[10px] bg-[var(--brand)] text-[15px] text-white">
        {initials}
      </span>
      <span className="truncate">{lead.short}</span>
    </a>
  );

  return (
    <div
      id="top"
      style={colors}
      className={`${display.variable} ${sans.variable} min-h-screen w-full bg-white pb-[78px] font-[family-name:var(--font-pv-sans)] leading-relaxed text-slate-900 sm:pb-0`}
    >
      <div className="bg-gray-900 px-4 py-2 text-center text-sm text-gray-300">
        Website preview made for <b className="text-white">{lead.short}</b> by{" "}
        <Link href="/portfolio" className="text-white underline underline-offset-2">
          Felipe
        </Link>{" "}
        · <span className="text-amber-200">not live yet</span>
      </div>

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between gap-4 px-5">
          {logo}
          <nav className="flex items-center gap-6 text-[15px] font-medium text-slate-600">
            <a href="#services" className="hidden hover:text-slate-900 md:inline">
              Services
            </a>
            <a href="#why" className="hidden hover:text-slate-900 md:inline">
              Why us
            </a>
            <a href="#quote" className="hidden hover:text-slate-900 md:inline">
              Free quote
            </a>
            <CallButton
              phone={phone}
              label={phone?.display}
              className={`${ACCENT_BTN} px-3 py-2.5 text-[15px] sm:px-4 max-sm:[&>span]:hidden`}
            />
          </nav>
        </div>
      </header>

      <section
        className="relative overflow-hidden py-12 text-white sm:pt-[76px] sm:pb-[92px]"
        style={{
          background:
            "radial-gradient(900px 420px at 90% -10%, color-mix(in srgb, var(--accent) 38%, transparent), transparent 65%), linear-gradient(160deg, var(--brand), var(--dark))",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 px-5 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold">
              <MapPin className="size-4" />
              {trade.eyebrow(copy)}
            </span>
            <h1 className={`${DISPLAY} mt-5 mb-[18px] text-[36px] leading-[1.15] font-bold sm:text-[58px]`}>
              {headline}
              <br />
              <span className="text-[var(--accent)]">{accentLine}</span>
            </h1>
            <p className="max-w-[560px] text-[17px] text-white/85 sm:text-[19px]">{trade.lead(copy)}</p>
            <div className="mt-[30px] flex flex-wrap gap-3">
              <CallButton phone={phone} className={ACCENT_BTN} />
              <a href="#quote" className={`${BTN} border border-white/30 bg-white/10 text-white`}>
                Get a free quote
              </a>
            </div>
            {lead.rating >= 4 && lead.reviews >= 3 && (
              <a
                href={lead.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2.5 text-[15px] text-white/90"
              >
                <span className="flex text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-[18px] fill-current" strokeWidth={0} />
                  ))}
                </span>
                <span>
                  <b>{lead.rating.toFixed(1)}</b> from {lead.reviews} Google reviews
                </span>
              </a>
            )}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px] text-white/90">
              {["Upfront pricing", `Local to ${lead.city}`, "Friendly, careful team"].map((chip) => (
                <span key={chip} className="flex items-center gap-2">
                  <Check className="size-[18px] text-[var(--accent)]" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div id="quote" className="scroll-mt-24 rounded-[20px] bg-white p-[30px] text-slate-900 shadow-[0_30px_70px_-24px_rgba(0,0,0,.5)]">
            <h2 className={`${DISPLAY} text-[23px] font-bold`}>Get a free quote</h2>
            <p className="mt-1.5 mb-5 text-[15px] text-slate-500">
              Tell us what you need and we&apos;ll get back to you quickly.
            </p>
            <QuoteForm business={lead.short} services={trade.services.map((s) => s.title)} />
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 py-16 sm:py-[92px]">
        <div className="mx-auto max-w-[1120px] px-5">
          <SectionHead
            kicker="Our services"
            title="Everything your home needs, done right"
            text={`${trade.label} services for homes and businesses across ${lead.place}.`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trade.services.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[18px] border border-slate-200 bg-white p-7 transition hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-22px_rgba(15,23,42,.3)]"
              >
                <div className="mb-[18px] grid size-[50px] place-items-center rounded-[14px] bg-[var(--tint)] text-[var(--brand)]">
                  <Icon className="size-6" />
                </div>
                <h3 className={`${DISPLAY} mb-1.5 text-[19px] font-bold`}>{title}</h3>
                <p className="text-[15.5px] text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-20 bg-[var(--tint)] py-16 sm:py-[92px]">
        <div className="mx-auto max-w-[1120px] px-5">
          <SectionHead kicker={`Why ${lead.short}`} title="The kind of service you'd recommend to a neighbor" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trade.why(copy).map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <div className="mb-[18px] grid size-[50px] place-items-center rounded-[14px] bg-white text-[var(--brand)]">
                  <Icon className="size-6" />
                </div>
                <h3 className={`${DISPLAY} mb-1.5 text-[19px] font-bold`}>{title}</h3>
                <p className="text-[15.5px] text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-[92px]">
        <div className="mx-auto max-w-[1120px] px-5">
          <SectionHead kicker="How it works" title="Simple from start to finish" />
          <div className="grid gap-5 lg:grid-cols-3">
            {trade.steps.map(({ title, text }, i) => (
              <div key={title} className="rounded-[18px] border border-slate-200 bg-white p-[30px]">
                <span className="mb-4 grid size-[38px] place-items-center rounded-full bg-[var(--brand)] font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className={`${DISPLAY} mb-1.5 text-[19px] font-bold`}>{title}</h3>
                <p className="text-[15.5px] text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-[92px]">
        <div className="mx-auto max-w-[1120px] px-5">
          <div
            className="flex flex-wrap items-center justify-between gap-6 rounded-[26px] px-6 py-8 text-white sm:p-[52px]"
            style={{
              background:
                "radial-gradient(600px 300px at 100% 0, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%), linear-gradient(135deg, var(--dark), var(--brand))",
            }}
          >
            <div>
              <h2 className={`${DISPLAY} mb-2 text-[26px] font-bold sm:text-4xl`}>{bandTitle}</h2>
              <p className="text-lg text-white/85">
                {bandText} Serving {lead.city} and nearby areas.
              </p>
            </div>
            <CallButton phone={phone} className={ACCENT_BTN} />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-[34px] text-sm text-slate-500">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-5">
          <span className="text-slate-900">{logo}</span>
          <span>
            {trade.label} · {lead.place}
            {phone && (
              <>
                {" · "}
                <a href={`tel:${phone.tel}`}>{phone.display}</a>
              </>
            )}
          </span>
          <span>
            © {new Date().getFullYear()} {lead.short}
          </span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
        <CallButton phone={phone} className={`${ACCENT_BTN} w-full`} />
      </div>
    </div>
  );
}
