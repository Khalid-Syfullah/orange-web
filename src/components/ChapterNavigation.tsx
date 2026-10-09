"use client";

import { motion } from "motion/react";
import { CHAPTERS } from "@/lib/constants";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { navigateTo } from "@/lib/scroll";

/** Fixed chapter index with a live progress rule. Desktop only — mobile uses the menu. */
export default function ChapterNavigation() {
  const active = useActiveChapter();
  const progress = useScrollProgress();
  const color = active.tone === "dark" ? "text-paper" : "text-ink";

  return (
    <nav
      aria-label="Chapters"
      className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 transition-colors duration-500 lg:block xl:right-8 ${color}`}
    >
      <div className="relative flex gap-4">
        <ol className="flex flex-col items-end gap-1">
          {CHAPTERS.map((c) => {
            const isActive = c.id === active.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => navigateTo(e, `#${c.id}`)}
                  aria-current={isActive ? "true" : undefined}
                  className="group label flex min-h-9 items-center justify-end gap-3"
                >
                  <span
                    className={`transition-all duration-500 ease-expo ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span className={`tabular-nums transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                    {c.number}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <div aria-hidden="true" className="relative w-px self-stretch bg-current/20">
          <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-orange" />
        </div>
      </div>
    </nav>
  );
}
