"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE } from "@/lib/animations";
import { CHAPTERS, OFFICES, SITE } from "@/lib/constants";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { lockScroll, navigateTo } from "@/lib/scroll";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();
  const progress = useScrollProgress();
  const chapter = useActiveChapter();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setScrolled(y > 40);
  });

  // Lock scroll, make the page inert and handle Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      lockScroll(false);
      toggle?.focus();
    };
  }, [open]);

  const onDark = open || chapter.tone === "dark";
  const textColor = onDark ? "text-paper" : "text-ink";
  const surface = scrolled && !open ? (onDark ? "bg-ink/92" : chapter.tone === "orange" ? "bg-orange/92" : "bg-paper/92") : "";

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${textColor} ${surface}`}
      >
        <div className="container-x grid grid-cols-[1fr_auto] items-center gap-4 py-4 md:grid-cols-3 md:py-5">
          <a
            href="#top"
            onClick={(e) => {
              setOpen(false);
              navigateTo(e, "#top");
            }}
            className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight"
            aria-label={`${SITE.name} — back to top`}
          >
            <span aria-hidden="true" className="size-3.5 rounded-full bg-orange" />
            {SITE.name}
          </a>

          <p className="label hidden justify-self-center md:block" aria-live="off">
            <span className="tabular-nums">{chapter.number}</span>
            <span className="mx-2 opacity-50">/</span>
            {chapter.label}
          </p>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className="label group -mr-2 flex min-h-11 items-center gap-3 justify-self-end px-2"
          >
            <span className="relative block h-[1.2em] w-[4.2em] overflow-hidden text-right">
              <span
                className="block transition-transform duration-500 ease-expo"
                style={{ transform: open ? "translateY(-100%)" : "none" }}
              >
                Menu
              </span>
              <span
                aria-hidden={!open}
                className="absolute inset-x-0 top-full block transition-transform duration-500 ease-expo"
                style={{ transform: open ? "translateY(-100%)" : "none" }}
              >
                Close
              </span>
            </span>
            <span aria-hidden="true" className="relative block size-4">
              <span
                className="absolute left-0 top-[5px] h-px w-full bg-current transition-transform duration-500 ease-expo"
                style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 top-[11px] h-px w-full bg-current transition-transform duration-500 ease-expo"
                style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-[2px] origin-left bg-orange"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-label="Site menu"
            data-tone="dark"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-ink text-paper"
          >
            <nav aria-label="Chapters" className="container-x flex flex-1 flex-col justify-center pt-24">
              <ol>
                {CHAPTERS.map((c, i) => (
                  <li key={c.id} className="overflow-hidden border-t border-paper/15 last:border-b">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.05 }}
                    >
                      <a
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={`#${c.id}`}
                        onClick={(e) => {
                          setOpen(false);
                          navigateTo(e, `#${c.id}`);
                        }}
                        className="group flex items-baseline gap-5 py-2.5 md:py-3.5"
                      >
                        <span className="label w-8 shrink-0 text-orange tabular-nums">{c.number}</span>
                        <span className="display-lg transition-all duration-500 ease-expo group-hover:translate-x-3 group-hover:text-orange group-focus-visible:text-orange">
                          {c.label}
                        </span>
                      </a>
                    </motion.div>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="container-x label flex flex-wrap items-center justify-between gap-4 pb-6 text-paper/70">
              <a href={`mailto:${SITE.email}`} className="min-h-11 content-center hover:text-orange">
                {SITE.email}
              </a>
              <span>{OFFICES.join(" · ")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
