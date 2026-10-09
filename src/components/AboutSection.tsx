"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import ScrubText from "@/components/animations/ScrubText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { EASE } from "@/lib/animations";
import { STATS } from "@/lib/constants";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="studio" data-tone="light" aria-labelledby="studio-label" className="relative py-28 md:py-44">
      <div className="container-x grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
        <p id="studio-label" className="label col-span-12 text-orange-ink md:col-span-2">
          (02) Studio
        </p>

        <div className="col-span-12 md:col-span-10">
          <ScrubText
            className="display-md !text-[clamp(30px,5.2vw,84px)] !leading-[1.02] text-ink"
            text="Orange is an independent studio of designers, engineers and strategists. We make the products, platforms and brand experiences that ambitious companies are measured by — built with the precision of software and the taste of print."
          />
        </div>

        <div className="col-span-12 grid grid-cols-12 gap-x-4 gap-y-8 md:col-span-10 md:col-start-3 md:mt-12 md:gap-x-6">
          <ScrollReveal className="col-span-12 lg:col-span-6">
            <p className="lede max-w-[44ch]">
              We are deliberately small. Every engagement is led by senior people from the first workshop
              to the final commit — no hand-offs, no layers, no theatre.
            </p>
          </ScrollReveal>
          <ScrollReveal className="col-span-12 lg:col-span-6" delay={0.1}>
            <p className="max-w-[44ch] text-muted">
              Since 2014 we have partnered with founders, scale-ups and global institutions across Europe,
              Asia and the Americas — shipping work that is quick to load, a pleasure to use and difficult to forget.
            </p>
          </ScrollReveal>
        </div>

        <dl className="col-span-12 mt-8 grid grid-cols-2 border-t border-rule md:mt-16 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <ScrollReveal
              key={s.label}
              delay={i * 0.08}
              className="border-b border-rule py-8 pr-4 lg:border-b-0 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <dd className="display-lg text-ink">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="label mt-3 text-muted">{s.label}</dt>
            </ScrollReveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
