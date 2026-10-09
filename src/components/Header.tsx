"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE } from "@/lib/animations";
import { NAV_LINKS, OFFICES, SITE } from "@/lib/constants";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { lockScroll, navigateTo } from "@/lib/scroll";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();
  const progress = useScrollProgress();
  const chapter = useActiveChapter();

  // Hide while reading downwards, reveal on any upward scroll.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setScrolled(y > 40);
  });

  // Menu open: freeze scroll, make the page inert, close on Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");
    firstLinkRef.current?.focus();
    // Escape closes; Tab is trapped between the close button and the overlay links.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(
        (el): el is HTMLElement => !!el,
      );
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (!current || !items.includes(current) || (e.shiftKey && current === first) || (!e.shiftKey && current === last)) {
        e.preventDefault();
        (e.shiftKey && current === first ? last : first).focus();
      }
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
  const surface =
    scrolled && !open ? (onDark ? "bg-ink/92" : chapter.tone === "orange" ? "bg-orange/92" : "bg-paper/92") : "";

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        onFocusCapture={() => setHidden(false)}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        data-site-header
        className={`fixed inset-x-0 top-0 z-50 transition-[color,background-color,opacity] duration-700 ${onDark ? "text-paper" : "text-ink"} ${surface}`}
      >
        <div className="container-x grid grid-cols-[1fr_auto] items-center gap-x-4 py-4 md:grid-cols-[auto_1fr] md:py-5">
          <a
            href="#top"
            onClick={(e) => {
              setOpen(false);
              navigateTo(e, "#top");
            }}
            className="flex min-h-11 items-center gap-2.5 font-display text-xl font-bold tracking-tight"
            aria-label={`${SITE.name} — back to top`}
          >
            <span aria-hidden="true" className="size-3.5 rounded-full bg-orange" />
            <span className="uppercase tracking-[0.08em]">{SITE.name}</span>
          </a>

          <nav aria-label="Chapters" className="nav-primary hidden justify-self-end md:block">
            <ul className="flex flex-wrap items-center gap-x-6 lg:gap-x-10">
              {NAV_LINKS.map((l) => {
                const active = chapter.id === l.id;
                return (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => navigateTo(e, `#${l.id}`)}
                      aria-current={active ? "true" : undefined}
                      className="label group relative inline-flex min-h-11 items-center"
                    >
                      <span className={`tabular-nums transition-opacity duration-500 ${active ? "opacity-100" : "opacity-60"}`}>
                        {l.number}
                      </span>
                      <span className="mx-1.5 opacity-40">/</span>
                      {l.label}
                      {/* Hover underline */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-2 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                      {/* Active indicator glides between chapters */}
                      {active && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="chapter-indicator"
                          transition={{ duration: 0.6, ease: EASE }}
                          className={`absolute inset-x-0 bottom-1.5 h-0.5 ${onDark ? "bg-orange" : "bg-orange-deep"}`}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="menu-toggle label group -mr-2 flex min-h-11 items-center gap-3 justify-self-end px-2 md:hidden"
          >
            <span aria-hidden="true" className="relative block h-[1.2em] w-[4.2em] overflow-hidden text-right">
              <span
                className="block transition-transform duration-500 ease-expo"
                style={{ transform: open ? "translateY(-100%)" : "none" }}
              >
                Menu
              </span>
              <span
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

        <motion.div aria-hidden="true" style={{ scaleX: progress }} className="h-[2px] origin-left bg-orange" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            data-tone="dark"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-ink text-paper md:hidden"
          >
            <nav aria-label="Chapters" className="container-x flex flex-1 flex-col justify-center pt-24">
              <ol>
                {NAV_LINKS.map((c, i) => {
                  const active = chapter.id === c.id;
                  return (
                    <li key={c.id} className="overflow-hidden border-t border-paper/15 last:border-b">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.07 }}
                      >
                        <a
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={`#${c.id}`}
                          aria-current={active ? "true" : undefined}
                          onClick={(e) => {
                            setOpen(false);
                            navigateTo(e, `#${c.id}`);
                          }}
                          className={`group flex flex-col gap-1 py-4 transition-colors duration-300 hover:text-orange focus-visible:text-orange ${
                            active ? "text-orange" : "text-paper"
                          }`}
                        >
                          <span className="label tabular-nums opacity-70">{c.number}</span>
                          <span className="font-display text-[clamp(44px,13vw,110px)] font-bold leading-[0.95] tracking-[-0.05em]">
                            {c.label}
                          </span>
                        </a>
                      </motion.div>
                    </li>
                  );
                })}
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
    </MotionConfig>
  );
}
