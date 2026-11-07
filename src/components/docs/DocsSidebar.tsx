"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";

export interface SidebarSection {
  title: string;
  pages: { slug: string; title: string; href: string }[];
}

export interface SidebarSearchEntry {
  page: string;
  section: string;
  heading: string | null;
  href: string;
}

interface DocsSidebarProps {
  sections: SidebarSection[];
  search: SidebarSearchEntry[];
  activeSlug: string;
  labels: { search: string; noResults: string; menu: string };
}

export default function DocsSidebar({ sections, search, activeSlug, labels }: DocsSidebarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return search
      .filter((e) => (e.heading ?? e.page).toLowerCase().includes(q) || (!e.heading && e.section.toLowerCase().includes(q)))
      .slice(0, 12);
  }, [query, search]);

  return (
    <nav aria-label="Documentation" className="text-sm">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="lg:hidden flex items-center gap-2 w-full px-3 py-2 mb-3 rounded-lg border border-(--card-border) bg-(--card-bg) font-medium"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        {labels.menu}
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--card-border) bg-(--card-bg) text-(--foreground) placeholder:text-(--text-muted) focus:outline-hidden focus:border-(--primary)"
          />
        </div>

        {query.trim() ? (
          results.length ? (
            <ul className="space-y-1">
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    onClick={() => { setQuery(""); setOpen(false); }}
                    className="block px-3 py-2 rounded-lg hover:bg-(--card-bg) transition-colors"
                  >
                    <span className="block font-medium text-(--foreground)">{r.heading ?? r.page}</span>
                    <span className="block text-xs text-(--text-muted)">
                      {r.section} › {r.page}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 text-(--text-muted)">{labels.noResults}</p>
          )
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.pages.map((p) => {
                    const active = p.slug === activeSlug;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={p.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`block px-3 py-1.5 rounded-lg transition-colors ${
                            active
                              ? "bg-(--primary)/10 text-(--primary) font-semibold"
                              : "text-(--foreground) hover:bg-(--card-bg) hover:text-(--primary)"
                          }`}
                        >
                          {p.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
