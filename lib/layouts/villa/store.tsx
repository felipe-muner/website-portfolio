"use client";

// Owner-editable villa catalogue for the Azure Villas demo. The landing page
// lists whatever is published here, and the /villa/v1/dashboard lets the owner
// create, edit, reorder and remove villas. Persisted to localStorage — this is
// a portfolio preview, no database. Seeded from the static VILLAS content so it
// never starts empty.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { VILLAS } from "@/lib/layouts/villas";

export type VillaStatus = "available" | "booked";

export interface EditableVilla {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  pricePerNight: number;
  /** One-line summary shown on cards. */
  description: string;
  /** Long-form copy shown on the detail page. */
  story: string;
  /** Cover image — first thing guests see. */
  coverImage: string;
  /** Gallery, cover included, in display order. */
  photos: string[];
  features: string[];
  status: VillaStatus;
  /** When false the villa is a draft — hidden from the public landing page. */
  published: boolean;
}

/** Fields the owner edits; id/slug are managed by the store. */
export type VillaDraft = Omit<EditableVilla, "id" | "slug">;

const STORAGE_KEY = "villa.v1.store.v2";

const EXTRA_STORY =
  "Wake to the sound of the bay, breakfast on the deck before anyone else is up, and let the day unfold at exactly the pace you choose. Our team is a quiet presence — there when you need them, invisible when you don't.";

/** A believable starting catalogue derived from the static demo content. */
function seed(): EditableVilla[] {
  const galleries: Record<string, string[]> = {
    breeze: [
      "/img/layouts/villa-bedroom-luxe.jpg",
      "/img/layouts/villa-terrace-view.jpg",
      "/img/layouts/villa-bathroom.jpg",
      "/img/layouts/villa-pool-sunset.jpg",
    ],
    reef: [
      "/img/layouts/villa-modern-pool.jpg",
      "/img/layouts/villa-living-bright.jpg",
      "/img/layouts/villa-kitchen.jpg",
      "/img/layouts/villa-bedroom-wood.jpg",
    ],
    palms: [
      "/img/layouts/villa-pool-palms.jpg",
      "/img/layouts/villa-living-sofa.jpg",
      "/img/layouts/villa-resort-bedroom.jpg",
      "/img/layouts/beach-turquoise.jpg",
    ],
    horizon: [
      "/img/layouts/villa-resort-aerial.jpg",
      "/img/layouts/villa-overwater.jpg",
      "/img/layouts/villa-room-luxe.jpg",
      "/img/layouts/villa-pool-night.jpg",
    ],
  };
  return VILLAS.map((v, i) => ({
    id: `seed-${v.slug}`,
    slug: v.slug,
    name: v.name,
    tagline: v.tagline,
    location: "Sunset Bay · Tropical Island",
    bedrooms: v.bedrooms,
    bathrooms: Math.max(1, v.bedrooms),
    guests: v.guests,
    pricePerNight: v.pricePerNight,
    description: v.description,
    story: `${v.description} ${EXTRA_STORY}`,
    coverImage: v.image,
    photos: [v.image, ...(galleries[v.slug] ?? [])].filter(
      (src, idx, arr) => arr.indexOf(src) === idx,
    ),
    features: [...v.features],
    status: i === 2 ? "booked" : "available",
    published: true,
  }));
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "villa"
  );
}

function uniqueSlug(base: string, taken: readonly string[]): string {
  let slug = base;
  let n = 2;
  while (taken.includes(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

/** A blank draft to prefill the "new villa" form. */
export function emptyDraft(): VillaDraft {
  return {
    name: "",
    tagline: "",
    location: "Sunset Bay · Tropical Island",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    pricePerNight: 3500,
    description: "",
    story: "",
    coverImage: "/img/layouts/villa-pool-palms.jpg",
    photos: ["/img/layouts/villa-pool-palms.jpg"],
    features: [],
    status: "available",
    published: false,
  };
}

interface VillaStoreValue {
  villas: EditableVilla[];
  /** Published villas only, in display order — what the landing page shows. */
  published: EditableVilla[];
  hydrated: boolean;
  getBySlug: (slug: string) => EditableVilla | undefined;
  create: (draft: VillaDraft) => EditableVilla;
  update: (id: string, draft: VillaDraft) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  move: (id: string, dir: -1 | 1) => void;
  togglePublished: (id: string) => void;
  reset: () => void;
}

const VillaStoreContext = createContext<VillaStoreValue | null>(null);

/** Normalise a draft so a villa always has a cover inside its gallery. */
function normalise(draft: VillaDraft): VillaDraft {
  const photos = draft.photos.length ? draft.photos : [draft.coverImage];
  const cover = photos.includes(draft.coverImage) ? draft.coverImage : photos[0];
  return { ...draft, coverImage: cover, photos };
}

export function VillaStoreProvider({ children }: { children: React.ReactNode }) {
  // Start from the seed so SSR + first paint match; hydrate from storage after.
  const [villas, setVillas] = useState<EditableVilla[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as EditableVilla[];
        if (Array.isArray(parsed) && parsed.length) setVillas(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(villas));
    } catch {
      // storage full or unavailable — carry on without persisting
    }
  }, [villas, hydrated]);

  const getBySlug = useCallback(
    (slug: string) => villas.find((v) => v.slug === slug),
    [villas],
  );

  const create = useCallback((draft: VillaDraft): EditableVilla => {
    const clean = normalise(draft);
    let created: EditableVilla;
    setVillas((prev) => {
      const slug = uniqueSlug(
        slugify(clean.name || "villa"),
        prev.map((v) => v.slug),
      );
      created = { ...clean, id: `villa-${Date.now().toString(36)}`, slug };
      return [...prev, created];
    });
    // `created` is always assigned synchronously by the updater above.
    return created!;
  }, []);

  const update = useCallback((id: string, draft: VillaDraft) => {
    const clean = normalise(draft);
    setVillas((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        // Re-slug when the name changes, keeping it unique.
        const base = slugify(clean.name || "villa");
        const slug =
          slugify(v.name) === base
            ? v.slug
            : uniqueSlug(base, prev.filter((o) => o.id !== id).map((o) => o.slug));
        return { ...v, ...clean, slug };
      }),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setVillas((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const duplicate = useCallback((id: string) => {
    setVillas((prev) => {
      const original = prev.find((v) => v.id === id);
      if (!original) return prev;
      const slug = uniqueSlug(
        slugify(`${original.name} copy`),
        prev.map((v) => v.slug),
      );
      const copy: EditableVilla = {
        ...original,
        id: `villa-${Date.now().toString(36)}`,
        slug,
        name: `${original.name} (copy)`,
        published: false,
      };
      const idx = prev.findIndex((v) => v.id === id);
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  }, []);

  const move = useCallback((id: string, dir: -1 | 1) => {
    setVillas((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }, []);

  const togglePublished = useCallback((id: string) => {
    setVillas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, published: !v.published } : v)),
    );
  }, []);

  const reset = useCallback(() => setVillas(seed()), []);

  const published = useMemo(
    () => villas.filter((v) => v.published),
    [villas],
  );

  const value = useMemo<VillaStoreValue>(
    () => ({
      villas,
      published,
      hydrated,
      getBySlug,
      create,
      update,
      remove,
      duplicate,
      move,
      togglePublished,
      reset,
    }),
    [villas, published, hydrated, getBySlug, create, update, remove, duplicate, move, togglePublished, reset],
  );

  return <VillaStoreContext.Provider value={value}>{children}</VillaStoreContext.Provider>;
}

export function useVillaStore(): VillaStoreValue {
  const ctx = useContext(VillaStoreContext);
  if (!ctx) throw new Error("useVillaStore must be used inside <VillaStoreProvider>");
  return ctx;
}
