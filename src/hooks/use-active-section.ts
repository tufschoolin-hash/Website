"use client";

import { useEffect, useState } from "react";

function headerOffset(): number {
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 76;
}

export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let queued = false;

    const update = () => {
      if (queued) return;
      queued = true;

      window.requestAnimationFrame(() => {
        const readingLine = headerOffset() + 120;
        let current: string | null = null;
        let closestTop = Number.NEGATIVE_INFINITY;

        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (!section) continue;

          const top = section.getBoundingClientRect().top;
          if (top <= readingLine && top > closestTop) {
            closestTop = top;
            current = id;
          }
        }

        setActiveId(current);
        queued = false;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  return activeId;
}
