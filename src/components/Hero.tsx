"use client";

import { useLayoutEffect, useRef } from "react";
import MagneticButton from "@/components/animations/MagneticButton";
import ParallaxSection from "@/components/animations/ParallaxSection";
import AnchorLink from "@/components/AnchorLink";
import { gsap, NO_MOTION_QUERY, registerGsap } from "@/lib/animations";
import { SITE } from "@/lib/constants";

/** Flat orange disc with measurement rings. */
function Disc() {
  return (
    <div className="relative aspect-square w-[min(56vw,26rem)] md:w-[min(46vw,50rem)]">
      <div className="absolute inset-0 rounded-full bg-orange" />
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute -inset-[12%] size-[124%] text-ink">
        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.25" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="0.6 2.4" />
        <g style={{ transformOrigin: "100px 100px", animation: "orbit 90s linear infinite" }}>
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="2"
              x2="100"
              y2={i % 6 === 0 ? 8 : 5}
              stroke="currentColor"
              strokeWidth="0.3"
              transform={`rotate(${i * 5} 100 100)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

const LINES = ["Ideas,", "engineered."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Load sequence: headline lines rise out of their masks, then the supporting layers fade up.
    // It waits for the loading curtain (`orange:ready`) on first visits.
    mm.add(NO_MOTION_QUERY, () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true, delay: 0.1 });
      tl.fromTo("[data-hero=line]", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.5, stagger: 0.14 })
        .fromTo("[data-hero=fade]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, "-=0.9");

      const play = () => tl.play();
      if (document.documentElement.dataset.ready) play();
      else window.addEventListener("orange:ready", play, { once: true });

      // Hand-off to the next section: the hero recedes slightly as the story begins.
      const content = el.querySelector("[data-hero-content]");
      if (content) {
        gsap.to(content, {
          yPercent: -6,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom 20%", scrub: true },
        });
      }
      return () => window.removeEventListener("orange:ready", play);
    });

    // Disc eases toward the pointer (fine pointers only).
    mm.add(`${NO_MOTION_QUERY} and (hover: hover) and (pointer: fine)`, () => {
      const target = disc.current;
      if (!target) return;
      const x = gsap.quickTo(target, "x", { duration: 1.4, ease: "power3.out" });
      const y = gsap.quickTo(target, "y", { duration: 1.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        x((e.clientX / window.innerWidth - 0.5) * -70);
        y((e.clientY / window.innerHeight - 0.5) * -70);
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      data-tone="light"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden pb-6 pt-24 md:pb-8 md:pt-28"
    >
      <div className="pointer-events-none absolute -right-[30vw] top-[11svh] md:-right-[14vw] md:top-[22svh]">
        <ParallaxSection speed={0.1}>
          <div ref={disc} className="will-change-transform">
            <Disc />
          </div>
        </ParallaxSection>
      </div>

      <div data-hero-content className="container-x relative z-10 my-auto py-8">
        <h1
          id="hero-title"
          aria-label="Ideas, engineered."
          className="font-display text-[clamp(44px,14.6vw,280px)] font-bold leading-[0.86] tracking-[-0.06em] text-ink"
        >
          {LINES.map((line, i) => (
            <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span data-hero="line" className="block will-change-transform">
                {i === 1 ? <span className="text-orange-deep">{line}</span> : line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div className="container-x relative z-10">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-8 border-t border-ink/20 pt-6 md:pt-8">
          <p data-hero="fade" className="col-span-12 font-display text-[clamp(26px,3.4vw,52px)] font-semibold leading-[1.02] tracking-[-0.03em] md:col-span-5 lg:col-span-4">
            {SITE.tagline}
          </p>
          <p data-hero="fade" className="lede col-span-12 max-w-[36ch] text-ink md:col-span-7 md:col-start-6 lg:col-span-4 lg:col-start-5">
            We turn ambitious ideas into exceptional digital products through thoughtful design,
            intelligent engineering, and relentless innovation.
          </p>
          <div data-hero="fade" className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:justify-self-end">
            <MagneticButton href="#studio">Explore Orange</MagneticButton>
          </div>
        </div>

        <AnchorLink
          href="#studio"
          data-hero="fade"
          aria-label="Scroll to next section"
          className="label mt-8 inline-flex min-h-11 items-center gap-4 text-ink md:mt-10"
        >
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-ink/20">
            <span className="absolute inset-0 bg-ink" style={{ animation: "scroll-line 2.4s var(--ease-expo) infinite" }} />
          </span>
          Scroll
        </AnchorLink>
      </div>
    </section>
  );
}
