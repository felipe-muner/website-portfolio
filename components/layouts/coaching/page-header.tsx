import Link from "next/link";

interface PageHeaderProps {
  title: string;
  intro?: string;
  /** Breadcrumb trail, last item is the current page (no link). */
  crumbs?: readonly { label: string; href?: string }[];
}

export function CoachPageHeader({ title, intro, crumbs }: PageHeaderProps) {
  return (
    <header className="border-b border-black/10 bg-[#ece5d6]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        {crumbs && (
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-black/50">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="transition hover:text-black">{c.label}</Link>
                ) : (
                  <span className="text-black/70">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="opacity-50">/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="max-w-3xl font-[family-name:var(--font-serif)] text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-black/65 sm:text-lg">{intro}</p>
        )}
      </div>
    </header>
  );
}
