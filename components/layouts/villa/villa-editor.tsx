"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { VillaDraft } from "@/lib/layouts/villa/store";
import { fileToDataUrl } from "@/lib/layouts/villa/image";
import { AMENITY_OPTIONS, AZURE, STOCK_PHOTOS } from "@/lib/layouts/villa/theme";

interface Props {
  title: string;
  initial: VillaDraft;
  onSave: (draft: VillaDraft) => void;
  onCancel: () => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: `${AZURE.teal}99` }}>
        {label}
      </span>
      {hint && <span className="ml-2 text-xs font-normal normal-case tracking-normal" style={{ color: `${AZURE.teal}66` }}>{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[color:var(--gold)]";

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: `${AZURE.teal}99` }}>{label}</span>
      <div className="mt-2 flex items-center border" style={{ borderColor: `${AZURE.teal}26` }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-10 place-items-center transition hover:bg-black/[0.03]"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="grid size-10 place-items-center transition hover:bg-black/[0.03]"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function VillaEditor({ title, initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<VillaDraft>(initial);
  const [showStock, setShowStock] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customFeature, setCustomFeature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof VillaDraft>(key: K, val: VillaDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: val }));
  }, []);

  const addPhoto = useCallback((src: string) => {
    setDraft((d) => {
      if (d.photos.includes(src)) return d;
      const photos = [...d.photos, src];
      return { ...d, photos, coverImage: d.photos.length === 0 ? src : d.coverImage };
    });
  }, []);

  const removePhoto = useCallback((src: string) => {
    setDraft((d) => {
      const photos = d.photos.filter((p) => p !== src);
      const coverImage = d.coverImage === src ? photos[0] ?? "" : d.coverImage;
      return { ...d, photos, coverImage };
    });
  }, []);

  const onUpload = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const url = await fileToDataUrl(file);
        addPhoto(url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [addPhoto]);

  const toggleFeature = useCallback((f: string) => {
    setDraft((d) => ({
      ...d,
      features: d.features.includes(f) ? d.features.filter((x) => x !== f) : [...d.features, f],
    }));
  }, []);

  const addCustomFeature = useCallback(() => {
    const f = customFeature.trim();
    if (!f) return;
    setDraft((d) => (d.features.includes(f) ? d : { ...d, features: [...d.features, f] }));
    setCustomFeature("");
  }, [customFeature]);

  const stockAvailable = useMemo(
    () => STOCK_PHOTOS.filter((s) => !draft.photos.includes(s)),
    [draft.photos],
  );

  const submit = () => {
    if (!draft.name.trim()) {
      setError("Give the villa a name.");
      return;
    }
    if (draft.photos.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" style={{ color: AZURE.teal }}>
      <button
        type="button"
        aria-label="Close editor"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div
        className="relative flex h-full w-full max-w-2xl flex-col shadow-2xl"
        style={{ backgroundColor: AZURE.ivory, ["--gold" as string]: AZURE.gold }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: `${AZURE.teal}1a` }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: AZURE.gold }}>Azure Villas</p>
            <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-full transition hover:bg-black/[0.05]">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Photos */}
          <section>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: `${AZURE.teal}99` }}>
                Photos
              </span>
              <span className="text-xs" style={{ color: `${AZURE.teal}66` }}>Tap the star to set the cover</span>
            </div>

            {draft.photos.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {draft.photos.map((src) => {
                  const isCover = src === draft.coverImage;
                  return (
                    <div key={src} className="group relative aspect-square overflow-hidden border" style={{ borderColor: isCover ? AZURE.gold : `${AZURE.teal}1a` }}>
                      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                      <div className="absolute inset-0 flex items-start justify-between p-1.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => set("coverImage", src)}
                          className="grid size-7 place-items-center rounded-full bg-white/90 text-[color:var(--gold)] shadow"
                          aria-label="Set as cover"
                        >
                          <Star className="size-4" fill={isCover ? AZURE.gold : "none"} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(src)}
                          className="grid size-7 place-items-center rounded-full bg-white/90 text-[#c2453f] shadow"
                          aria-label="Remove photo"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {isCover && (
                        <span className="absolute bottom-0 inset-x-0 bg-[color:var(--gold)] py-0.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 border border-dashed px-4 py-8 text-center text-sm" style={{ borderColor: `${AZURE.teal}33`, color: `${AZURE.teal}80` }}>
                No photos yet — add from the library or upload your own.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowStock((s) => !s)}
                className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition hover:bg-black/[0.03]"
                style={{ borderColor: `${AZURE.teal}33` }}
              >
                <ImagePlus className="size-4" /> {showStock ? "Hide library" : "Photo library"}
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition hover:bg-black/[0.03] disabled:opacity-60"
                style={{ borderColor: `${AZURE.teal}33` }}
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
            </div>

            {showStock && (
              <div className="mt-3 grid max-h-52 grid-cols-4 gap-2 overflow-y-auto border p-2 sm:grid-cols-6" style={{ borderColor: `${AZURE.teal}1a` }}>
                {stockAvailable.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => addPhoto(src)}
                    className="group relative aspect-square overflow-hidden"
                    aria-label="Add photo"
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover transition group-hover:scale-105" />
                    <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                      <Plus className="size-5" />
                    </span>
                  </button>
                ))}
                {stockAvailable.length === 0 && (
                  <p className="col-span-full py-4 text-center text-sm" style={{ color: `${AZURE.teal}80` }}>
                    Every library photo is already added.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Basics */}
          <section className="space-y-5">
            <Field label="Villa name">
              <input className={inputCls} style={{ borderColor: `${AZURE.teal}26` }} value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Villa Breeze" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tagline">
                <input className={inputCls} style={{ borderColor: `${AZURE.teal}26` }} value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="The hideaway for two" />
              </Field>
              <Field label="Location">
                <input className={inputCls} style={{ borderColor: `${AZURE.teal}26` }} value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="Sunset Bay · Tropical Island" />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stepper label="Bedrooms" value={draft.bedrooms} min={0} onChange={(n) => set("bedrooms", n)} />
              <Stepper label="Bathrooms" value={draft.bathrooms} min={0} onChange={(n) => set("bathrooms", n)} />
              <Stepper label="Guests" value={draft.guests} min={1} onChange={(n) => set("guests", n)} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Price / night" hint="฿ THB">
                <div className="flex items-center border" style={{ borderColor: `${AZURE.teal}26` }}>
                  <span className="px-3 text-sm" style={{ color: `${AZURE.teal}99` }}>฿</span>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-white py-2.5 pr-3 text-sm outline-none"
                    value={draft.pricePerNight}
                    onChange={(e) => set("pricePerNight", Math.max(0, Number(e.target.value) || 0))}
                  />
                </div>
              </Field>
              <Field label="Status">
                <div className="flex border" style={{ borderColor: `${AZURE.teal}26` }}>
                  {(["available", "booked"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className="flex-1 py-2.5 text-sm font-semibold capitalize transition"
                      style={draft.status === s ? { backgroundColor: AZURE.teal, color: "#fff" } : { color: `${AZURE.teal}99` }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Short description" hint="one line, shown on cards">
              <input className={inputCls} style={{ borderColor: `${AZURE.teal}26` }} value={draft.description} onChange={(e) => set("description", e.target.value)} placeholder="A one-bedroom nest above the palms…" />
            </Field>
            <Field label="The story" hint="full copy on the detail page">
              <textarea rows={4} className={inputCls} style={{ borderColor: `${AZURE.teal}26` }} value={draft.story} onChange={(e) => set("story", e.target.value)} placeholder="Describe the experience of staying here…" />
            </Field>
          </section>

          {/* Features */}
          <section>
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: `${AZURE.teal}99` }}>Features & amenities</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(new Set([...AMENITY_OPTIONS, ...draft.features])).map((f) => {
                const on = draft.features.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-sm transition"
                    style={on ? { backgroundColor: AZURE.teal, borderColor: AZURE.teal, color: "#fff" } : { borderColor: `${AZURE.teal}2e`, color: `${AZURE.teal}cc` }}
                  >
                    {on && <Check className="size-3.5" />}
                    {f}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className={inputCls}
                style={{ borderColor: `${AZURE.teal}26` }}
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomFeature();
                  }
                }}
                placeholder="Add a custom feature…"
              />
              <button type="button" onClick={addCustomFeature} className="shrink-0 border px-4 text-sm font-semibold transition hover:bg-black/[0.03]" style={{ borderColor: `${AZURE.teal}33` }}>
                Add
              </button>
            </div>
          </section>

          {/* Publish */}
          <section>
            <button
              type="button"
              onClick={() => set("published", !draft.published)}
              className="flex w-full items-center justify-between border px-4 py-3.5 text-left transition hover:bg-black/[0.02]"
              style={{ borderColor: `${AZURE.teal}26` }}
            >
              <span>
                <span className="block text-sm font-semibold">Publish to the website</span>
                <span className="block text-xs" style={{ color: `${AZURE.teal}80` }}>
                  {draft.published ? "Visible on the Azure Villas landing page." : "Saved as a draft — hidden from guests."}
                </span>
              </span>
              <span
                className="relative h-6 w-11 shrink-0 rounded-full transition"
                style={{ backgroundColor: draft.published ? AZURE.gold : `${AZURE.teal}33` }}
              >
                <span className="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all" style={{ left: draft.published ? "22px" : "2px" }} />
              </span>
            </button>
          </section>

          {error && <p className="text-sm font-semibold text-[#c2453f]">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4" style={{ borderColor: `${AZURE.teal}1a` }}>
          <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-semibold transition hover:opacity-70">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#0e4a5a] transition hover:opacity-90"
            style={{ backgroundColor: AZURE.gold }}
          >
            <Check className="size-4" /> Save villa
          </button>
        </div>
      </div>
    </div>
  );
}
