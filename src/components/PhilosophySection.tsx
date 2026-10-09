"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrubText from "@/components/animations/ScrubText";
import TextReveal from "@/components/animations/TextReveal";
import { gsap, NO_MOTION_QUERY, registerGsap, ScrollTrigger } from "@/lib/animations";
import { PROCESS } from "@/lib/constants";

export default function PhilosophySection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Active step: whichever step spans the middle of the viewport.
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      // Rail progress fills with the reader's journey through all four steps.
      const steps = el.querySelector("[data-steps]");
      const fill = el.querySelector("[data-fill]");
      if (steps && fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 55%", end: "bottom 55%", scrub: true } },
        );
      }
    }, el);

    // Dividers draw in once, as each block approaches.
    const mm = gsap.matchMedia(el);
    mm.add(NO_MOTION_QUERY, () => {
      el.querySelectorAll<HTMLElement>("[data-reveal=rule]").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: rule, start: "top 88%", once: true } },
        );
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="philosophy"
      data-tone="dark"
      aria-labelledby="philosophy-title"
      className="relative overflow-x-clip bg-ink pb-24 pt-28 text-paper md:pb-40 md:pt-44"
    >
      <div className="container-x">
        {/* Chapter heading */}
        <div data-reveal="rule" className="h-px origin-left bg-paper/30" />
        <div className="label flex items-center justify-between py-4">
          <p>Chapter 03</p>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 bg-orange" />
            How We Think
          </p>
        </div>

        <TextReveal
          as="h2"
          id="philosophy-title"
          text={"Less noise.\nMore impact."}
          highlight={["impact"]}
          highlightClassName="text-orange"
          lineClasses={["", "md:ml-[12vw]"]}
          className="mt-10 font-display text-[clamp(32px,9vw,168px)] font-bold leading-[0.9] tracking-[-0.055em] md:mt-16"
        />

        {/* Introduction */}
        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-8 md:mt-32 md:gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <div data-reveal="rule" className="mb-4 h-px w-12 origin-left bg-orange" />
            <p className="label text-paper/70">Our belief</p>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-7">
            <ScrubText
              className="font-display text-[clamp(22px,2.7vw,42px)] font-medium leading-[1.22] tracking-[-0.025em]"
              text="Every meaningful product begins with a question, evolves through experimentation, and succeeds through thoughtful execution."
            />
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="container-x mt-28 md:mt-48">
        <div data-reveal="rule" className="h-px origin-left bg-paper/30" />
        <div className="label flex items-center justify-between py-4 text-paper/70">
          <p>The Process</p>
          <p className="tabular-nums">04 Steps</p>
        </div>

        <div className="relative">
          {/* Sticky progress rail — decorative; each step carries its own number */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 md:block">
            <div className="sticky top-0 flex h-svh items-center">
              <div className="relative h-[46svh] w-full">
                <div className="absolute inset-y-0 left-0 w-px bg-paper/20">
                  <div data-fill className="h-full w-px origin-top bg-orange" style={{ transform: "scaleY(0)" }} />
                </div>
                {PROCESS.map((p, i) => {
                  const on = active === i;
                  return (
                    <div
                      key={p.number}
                      className="absolute left-0 flex -translate-y-1/2 items-center gap-3"
                      style={{ top: `${((i + 0.5) / PROCESS.length) * 100}%` }}
                    >
                      <span
                        className={`h-px bg-orange transition-all duration-700 ease-expo ${on ? "w-8" : "w-3 bg-paper/40"}`}
                      />
                      <span
                        className={`label tabular-nums transition-colors duration-500 ${on ? "text-orange" : "text-paper/50"}`}
                      >
                        {p.number}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <ol data-steps className="md:pl-28">
            {PROCESS.map((step, i) => {
              const on = active === i;
              const flip = i % 2 === 1; // alternate sides
              return (
                <li
                  key={step.number}
                  data-step
                  aria-current={on ? "step" : undefined}
                  className={`flex flex-col justify-center py-14 transition-opacity duration-700 md:min-h-[78svh] md:py-0 ${
                    on ? "opacity-100" : "opacity-55"
                  }`}
                >
                  <div data-reveal="rule" className="mb-8 h-px origin-left bg-paper/25 md:mb-14" />
                  <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6 md:gap-x-6">
                    <span
                      aria-hidden="true"
                      className={`col-span-12 font-display text-[clamp(110px,21vw,340px)] font-bold leading-[0.78] tracking-[-0.06em] transition-colors duration-700 md:col-span-5 ${
                        flip ? "md:col-start-8 md:text-right" : "md:col-start-1"
                      } ${on ? "text-orange" : "text-paper/20"}`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`col-span-12 md:col-span-6 ${flip ? "md:col-start-1 md:row-start-1" : "md:col-start-7"}`}
                    >
                      <TextReveal
                        as="h3"
                        text={step.title}
                        className="font-display text-[clamp(44px,8vw,136px)] font-bold leading-[0.9] tracking-[-0.05em]"
                      />
                      <ScrollReveal delay={0.15}>
                        <p className="mt-6 max-w-[28ch] text-[clamp(20px,1.8vw,30px)] leading-snug text-paper md:mt-8">
                          {step.body}
                        </p>
                      </ScrollReveal>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
