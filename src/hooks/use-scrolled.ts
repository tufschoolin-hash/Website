"use client";

import { useEffect, useState } from "react";

export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let queued = false;

    const update = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
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
  }, [threshold]);

  return scrolled;
}
