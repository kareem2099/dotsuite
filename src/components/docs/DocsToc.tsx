"use client";

import { useEffect, useState } from "react";

interface DocsTocProps {
  items: { id: string; text: string; level: 2 | 3 }[];
  label: string;
}

/** "On this page" list that highlights the heading currently in view. */
export default function DocsToc({ items, label }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label={label} className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">{label}</p>
      <ul className="space-y-1.5 border-l border-(--card-border)">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block -ml-px border-l-2 py-0.5 transition-colors ${
                item.level === 3 ? "pl-6" : "pl-3"
              } ${
                activeId === item.id
                  ? "border-(--primary) text-(--primary) font-medium"
                  : "border-transparent text-(--text-muted) hover:text-(--foreground)"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
