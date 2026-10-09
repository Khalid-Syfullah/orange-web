"use client";

import { useEffect, useState } from "react";
import { CHAPTERS, type Chapter } from "@/lib/constants";

/** Tracks which chapter currently crosses the middle of the viewport. */
export function useActiveChapter(): Chapter {
  const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];
}
