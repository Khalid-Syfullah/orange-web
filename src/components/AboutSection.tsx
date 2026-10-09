"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import ParallaxSection from "@/components/animations/ParallaxSection";
import ScrubText from "@/components/animations/ScrubText";
import { gsap, NO_MOTION_QUERY, registerGsap } from "@/lib/animations";

/** One masked line of display type; GSAP lifts it out of its mask. */
function Line({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}>
      <span data-reveal="line" className="block will-change-transform">
        {children}
      </span>
    </span>
  );
}

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(NO_MOTION_QUERY, () => {
      // Each group plays once, the first time it reaches 80% of the viewport.
      el.querySelectorAll<HTMLElement>("[data-group]").forEach((group) => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: group, start: "top 80%", once: true },
        });
        tl.fromTo(group.querySelectorAll("[data-reveal=rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6 })
          .fromTo(
            group.querySelectorAll("[data-reveal=line]"),
            { y: 0, yPercent: 110 },
            { y: 0, yPercent: 0, duration: 1.4, stagger: 0.14 },
            "-=1.3",
          )
          .fromTo(
            group.querySelectorAll("[data-reveal=fade]"),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
            "-=1.1",
          );
      });

      // The closing rule is scrubbed: it draws as the reader approaches the next chapter.
      const closing = el.querySelector<HTMLElement>("[data-closing]");
      const rule = el.querySelector<HTMLElement>("[data-closing-rule]");
      if (closing && rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: closing, start: "top 95%", end: "top 45%", scrub: true } },
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="studio"
      data-tone="light"
      aria-labelledby="studio-title"
      className="relative overflow-hidden pb-20 pt-28 md:pb-32 md:pt-44"
    >
      {/* Oversized outlined numeral — slow parallax counterweight */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[2vw] top-[26%] md:top-[22%] select-none">
        <ParallaxSection speed={0.22}>
          <span
            className="block font-display text-[clamp(220px,46vw,760px)] font-bold leading-[0.8] tracking-[-0.07em] text-transparent"
            style={{ WebkitTextStroke: "1px var(--color-orange)" }}
          >
            01
          </span>
        </ParallaxSection>
      </div>

      <div className="container-x relative">
        {/* Chapter heading */}
        <div data-group>
          <div data-reveal="rule" className="h-px origin-left bg-ink/30" />
          <div className="label flex items-center justify-between py-4">
            <p data-reveal="fade">Chapter 01</p>
            <p data-reveal="fade" className="flex items-center gap-3">
              <span aria-hidden="true" className="size-2 bg-orange" />
              The Idea
            </p>
          </div>

          <h2
            id="studio-title"
            aria-label="Good ideas deserve great execution."
            className="mt-10 font-display text-[clamp(32px,9vw,168px)] font-bold leading-[0.9] tracking-[-0.055em] text-ink md:mt-16"
          >
            <Line>Good ideas deserve</Line>
            <Line className="md:ml-[12vw]">
              great <span className="text-orange-deep">execution.</span>
            </Line>
          </h2>
        </div>

        {/* Description, pushed into the right of the grid */}
        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-36 md:gap-x-6">
          <div data-group className="col-span-12 md:col-span-3">
            <div data-reveal="rule" className="mb-4 h-px w-12 origin-left bg-orange-deep" />
            <p data-reveal="fade" className="label text-muted">
              About Orange
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-7">
            <ScrubText
              className="font-display text-[clamp(22px,2.7vw,42px)] font-medium leading-[1.22] tracking-[-0.025em] text-ink"
              text="Orange is a creative technology studio building digital experiences that combine thoughtful design, powerful engineering, and meaningful innovation."
            />
          </div>
        </div>

        {/* Secondary statement */}
        <ParallaxSection speed={0.04} className="mt-28 md:mt-52">
          <div data-group>
            <div data-reveal="rule" className="h-px origin-left bg-ink/30" />
            <div className="label flex items-center justify-between py-4 text-muted">
              <p data-reveal="fade">A belief</p>
              <p data-reveal="fade" aria-hidden="true" className="text-orange-ink">
                —
              </p>
            </div>
            <p
              aria-label="We don’t just build software. We build possibilities."
              className="mt-8 font-display text-[clamp(30px,5.6vw,100px)] font-bold leading-[0.95] tracking-[-0.045em] text-ink md:mt-12"
            >
              <Line>We don’t just build software.</Line>
              <Line className="md:ml-[10vw]">
                We build <span className="text-orange-deep">possibilities.</span>
              </Line>
            </p>
          </div>
        </ParallaxSection>

        {/* Hand-off to the next chapter */}
        <div data-closing className="mt-24 md:mt-44">
          <div data-closing-rule className="h-0.5 origin-left bg-orange-deep" />
          <AnchorLink
            href="#capabilities"
            className="group flex items-end justify-between gap-6 py-6 md:py-8"
            aria-label="Next chapter: 02, What We Do"
          >
            <span className="label text-muted">Next chapter</span>
            <span className="flex items-center gap-3 font-display text-[clamp(24px,3.6vw,56px)] font-semibold tracking-[-0.03em] text-ink">
              <span className="tabular-nums text-orange-ink">02</span>
              <span className="relative">
                What We Do
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-[0.8em] transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </span>
          </AnchorLink>
        </div>
      </div>
    </section>
  );
}
