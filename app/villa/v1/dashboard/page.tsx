"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost, Prata } from "next/font/google";
import {
  ArrowUpRight,
  BedDouble,
  Bath,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  Palmtree,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react";
import { VillaDashboardGate } from "@/components/layouts/villa/dashboard-gate";
import { VillaEditor } from "@/components/layouts/villa/villa-editor";
import { useVillaAuth } from "@/lib/layouts/villa/auth";
import {
  emptyDraft,
  useVillaStore,
  type EditableVilla,
  type VillaDraft,
} from "@/lib/layouts/villa/store";
import { AZURE } from "@/lib/layouts/villa/theme";

const display = Prata({ subsets: ["latin"], weight: "400" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "600"] });

function draftFrom(v: EditableVilla): VillaDraft {
  return {
    name: v.name,
    tagline: v.tagline,
    location: v.location,
    bedrooms: v.bedrooms,
    bathrooms: v.bathrooms,
    guests: v.guests,
    pricePerNight: v.pricePerNight,
    description: v.description,
    story: v.story,
    coverImage: v.coverImage,
    photos: v.photos,
    features: v.features,
    status: v.status,
    published: v.published,
  };
}

type EditorState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; villa: EditableVilla };

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: `${AZURE.teal}80` }}>{label}</p>
      <p className={`${display.className} mt-2 text-3xl`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs" style={{ color: `${AZURE.teal}80` }}>{sub}</p>}
    </div>
  );
}

function VillaRow({
  villa,
  index,
  count,
  onEdit,
}: {
  villa: EditableVilla;
  index: number;
  count: number;
  onEdit: () => void;
}) {
  const { move, remove, duplicate, togglePublished } = useVillaStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Reorder */}
      <div className="hidden flex-col sm:flex">
        <button
          type="button"
          onClick={() => move(villa.id, -1)}
          disabled={index === 0}
          className="grid size-6 place-items-center rounded transition hover:bg-black/[0.05] disabled:opacity-25"
          aria-label="Move up"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => move(villa.id, 1)}
          disabled={index === count - 1}
          className="grid size-6 place-items-center rounded transition hover:bg-black/[0.05] disabled:opacity-25"
          aria-label="Move down"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Cover */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-square sm:size-20">
        <Image src={villa.coverImage} alt={villa.name} fill sizes="120px" className="object-cover" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`${display.className} truncate text-xl`}>{villa.name}</h3>
          <span
            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={villa.status === "available"
              ? { backgroundColor: "#e6f4ea", color: "#1c7a43" }
              : { backgroundColor: "#f7e9e3", color: "#b4593a" }}
          >
            {villa.status}
          </span>
          {!villa.published && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${AZURE.teal}12`, color: `${AZURE.teal}aa` }}>
              Draft
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm" style={{ color: `${AZURE.teal}99` }}>{villa.tagline}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: `${AZURE.teal}b3` }}>
          <span className="flex items-center gap-1.5"><BedDouble className="size-4" style={{ color: AZURE.gold }} />{villa.bedrooms}</span>
          <span className="flex items-center gap-1.5"><Bath className="size-4" style={{ color: AZURE.gold }} />{villa.bathrooms}</span>
          <span className="flex items-center gap-1.5"><Users className="size-4" style={{ color: AZURE.gold }} />{villa.guests}</span>
          <span className="font-semibold" style={{ color: AZURE.teal }}>฿{villa.pricePerNight.toLocaleString()}<span className="font-normal" style={{ color: `${AZURE.teal}80` }}> / night</span></span>
          <span style={{ color: `${AZURE.teal}66` }}>· {villa.photos.length} photos</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => togglePublished(villa.id)}
          title={villa.published ? "Unpublish" : "Publish"}
          className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition hover:bg-black/[0.03]"
          style={{ borderColor: `${AZURE.teal}26`, color: villa.published ? "#1c7a43" : `${AZURE.teal}99` }}
        >
          {villa.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          {villa.published ? "Live" : "Hidden"}
        </button>
        <Link
          href={`/villa/v1/${villa.slug}`}
          title="View detail page"
          className="grid size-8 place-items-center border transition hover:bg-black/[0.03]"
          style={{ borderColor: `${AZURE.teal}26` }}
        >
          <ExternalLink className="size-4" />
        </Link>
        <button type="button" onClick={() => duplicate(villa.id)} title="Duplicate" className="grid size-8 place-items-center border transition hover:bg-black/[0.03]" style={{ borderColor: `${AZURE.teal}26` }}>
          <Copy className="size-4" />
        </button>
        <button type="button" onClick={onEdit} title="Edit" className="grid size-8 place-items-center border transition hover:bg-black/[0.03]" style={{ borderColor: `${AZURE.teal}26` }}>
          <Pencil className="size-4" />
        </button>
        {confirmDelete ? (
          <button
            type="button"
            onClick={() => remove(villa.id)}
            onMouseLeave={() => setConfirmDelete(false)}
            className="inline-flex items-center gap-1 bg-[#c2453f] px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Trash2 className="size-3.5" /> Sure?
          </button>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} title="Delete" className="grid size-8 place-items-center border text-[#c2453f] transition hover:bg-[#c2453f]/5" style={{ borderColor: `${AZURE.teal}26` }}>
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function DashboardInner() {
  const { villas, hydrated, create, update, reset } = useVillaStore();
  const { session, signOut } = useVillaAuth();
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });

  const stats = useMemo(() => {
    const published = villas.filter((v) => v.published);
    const available = villas.filter((v) => v.status === "available" && v.published);
    const avg = published.length
      ? Math.round(published.reduce((s, v) => s + v.pricePerNight, 0) / published.length)
      : 0;
    return { total: villas.length, published: published.length, available: available.length, avg };
  }, [villas]);

  const handleSave = (draft: VillaDraft) => {
    if (editor.mode === "edit") update(editor.villa.id, draft);
    else create(draft);
    setEditor({ mode: "closed" });
  };

  return (
    <div className={`${body.className} min-h-dvh`} style={{ backgroundColor: AZURE.sand, color: AZURE.teal }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur" style={{ borderColor: `${AZURE.teal}12` }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: AZURE.teal }}>
              <Palmtree className="size-5" style={{ color: AZURE.gold }} />
            </span>
            <div className="leading-tight">
              <p className={`${display.className} text-lg`}>Azure Villas</p>
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: `${AZURE.teal}80` }}>Owner dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/villa/v1" className="hidden items-center gap-1.5 text-sm font-semibold transition hover:text-[color:var(--g)] sm:inline-flex" style={{ ["--g" as string]: AZURE.gold }}>
              View site <ArrowUpRight className="size-4" />
            </Link>
            <span className="hidden text-right leading-tight md:block">
              <span className="block text-sm font-semibold">{session?.name}</span>
              <span className="block text-xs" style={{ color: `${AZURE.teal}80` }}>{session?.email}</span>
            </span>
            <button type="button" onClick={signOut} title="Sign out" className="grid size-9 place-items-center rounded-full border transition hover:bg-black/[0.03]" style={{ borderColor: `${AZURE.teal}26` }}>
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        {/* Title + add */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className={`${display.className} text-4xl md:text-5xl`}>Your villas</h1>
            <p className="mt-1 text-sm" style={{ color: `${AZURE.teal}99` }}>
              Add, edit and publish the villas guests see on your website.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditor({ mode: "create" })}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#0e4a5a] transition hover:opacity-90"
            style={{ backgroundColor: AZURE.gold }}
          >
            <Plus className="size-4" /> Add villa
          </button>
        </div>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total villas" value={String(stats.total)} />
          <Stat label="Published" value={String(stats.published)} sub="live on the site" />
          <Stat label="Available now" value={String(stats.available)} sub="published & open" />
          <Stat label="Avg / night" value={`฿${stats.avg.toLocaleString()}`} sub="published villas" />
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
          {!hydrated ? (
            <p className="py-16 text-center text-sm" style={{ color: `${AZURE.teal}80` }}>Loading…</p>
          ) : villas.length === 0 ? (
            <div className="bg-white py-16 text-center shadow-sm">
              <Palmtree className="mx-auto size-10" style={{ color: `${AZURE.teal}40` }} />
              <p className={`${display.className} mt-4 text-2xl`}>No villas yet</p>
              <p className="mt-1 text-sm" style={{ color: `${AZURE.teal}99` }}>Add your first villa to get started.</p>
              <button
                type="button"
                onClick={() => setEditor({ mode: "create" })}
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#0e4a5a]"
                style={{ backgroundColor: AZURE.gold }}
              >
                <Plus className="size-4" /> Add villa
              </button>
            </div>
          ) : (
            villas.map((villa, i) => (
              <VillaRow
                key={villa.id}
                villa={villa}
                index={i}
                count={villas.length}
                onEdit={() => setEditor({ mode: "edit", villa })}
              />
            ))
          )}
        </div>

        {/* Reset */}
        {hydrated && (
          <div className="mt-10 border-t pt-6 text-center" style={{ borderColor: `${AZURE.teal}14` }}>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset the demo catalogue to the original four villas?")) reset();
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
              style={{ color: `${AZURE.teal}99` }}
            >
              <RotateCcw className="size-4" /> Reset demo data
            </button>
            <p className="mt-2 text-xs" style={{ color: `${AZURE.teal}66` }}>
              Everything here is saved in your browser only — this is a portfolio demo, not a live booking system.
            </p>
          </div>
        )}
      </main>

      {editor.mode !== "closed" && (
        <VillaEditor
          title={editor.mode === "edit" ? "Edit villa" : "New villa"}
          initial={editor.mode === "edit" ? draftFrom(editor.villa) : emptyDraft()}
          onSave={handleSave}
          onCancel={() => setEditor({ mode: "closed" })}
        />
      )}
    </div>
  );
}

export default function VillaDashboardPage() {
  return (
    <VillaDashboardGate>
      <DashboardInner />
    </VillaDashboardGate>
  );
}
