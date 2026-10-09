import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Freeze / release page scrolling (menu overlay). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Smooth in-page navigation that works with or without Lenis. */
export function navigateTo(
  event: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean },
  hash: string,
) {
  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
  const target = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;
  event.preventDefault();

  if (lenis) {
    const l = lenis;
    const destination = () => (hash === "#top" ? 0 : target.getBoundingClientRect().top + l.scroll);
    l.scrollTo(destination(), {
      duration: 1.5,
      immediate: prefersReducedMotion(),
      // Layout can shift mid-flight (an accordion closing, fonts arriving): settle on the true position.
      onComplete: () => {
        if (Math.abs(destination() - l.scroll) > 2) l.scrollTo(destination(), { duration: 0.5 });
      },
    });
  } else if (hash === "#top") {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  history.pushState(null, "", hash);
  if (hash !== "#top") {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
}
