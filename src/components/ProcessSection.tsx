"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { gsap, NO_MOTION_QUERY, registerGsap } from "@/lib/animations";
import { PROCESS } from "@/lib/constants";

export default function ProcessSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Vertical rule fills as the reader moves down the timeline.
  useEffect(() => {
    registerGsap();
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_QUERY, () => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: true },
        },
      );
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(fill, { scaleY: 1 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="process" data-tone="light" aria-labelledby="process-title" className="py-28 md:py-44">
      <div className="container-x grid grid-cols-12 gap-x-4 gap-y-16 md:gap-x-6">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="label text-orange-ink">The Process</p>
            <TextReveal
              as="h2"
              id="process-title"
              text={"From first\nconversation\nto lasting impact."}
              highlight={["impact"]}
              className="display-lg mt-8 text-ink"
            />
            <p className="lede mt-8 max-w-[34ch] text-muted">
              A clear, four-stage rhythm. You always know where we are, what is next and what it will cost.
            </p>
          </div>
        </div>

        <div className="relative col-span-12 md:col-span-6 md:col-start-7">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-rule">
            <div ref={fillRef} className="h-full origin-top bg-orange" />
          </div>
          <ol ref={listRef} className="space-y-16 md:space-y-24">
            {PROCESS.map((step) => (
              <li key={step.number} className="relative pl-10 md:pl-14">
                <motion.span
                  aria-hidden="true"
                  initial={{ scale: 0.6, backgroundColor: "#F7F5F0" }}
                  whileInView={{ scale: 1, backgroundColor: "#FF6B00" }}
                  viewport={{ margin: "0px 0px -45% 0px", once: true }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-0 top-2 size-[15px] rounded-full border border-orange"
                />
                <ScrollReveal>
                  <p className="label flex gap-4 text-muted">
                    <span className="tabular-nums text-orange-ink">{step.number}</span>
                    {step.time}
                  </p>
                  <h3 className="display-xl mt-3 !text-[clamp(40px,5.5vw,88px)] text-ink">{step.title}</h3>
                  <p className="lede mt-5 max-w-[42ch]">{step.body}</p>
                  <ul className="label mt-6 flex flex-wrap gap-x-6 gap-y-2 text-muted">
                    {step.outputs.map((o) => (
                      <li key={o} className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-1.5 bg-orange" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
