"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { EASE } from "@/lib/animations";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  const [open, setOpen] = useState<number | null>(null);
  const pointer = useRef<string>("mouse");

  const onPointerEnter = (e: PointerEvent, i: number) => {
    pointer.current = e.pointerType;
    if (e.pointerType === "mouse") setOpen(i);
  };

  // Mouse users open rows by hovering; touch and keyboard users toggle with a tap / Enter.
  const onClick = (e: MouseEvent, i: number) => {
    if (e.detail !== 0 && pointer.current === "mouse") return;
    setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <section id="capabilities" data-tone="light" aria-labelledby="capabilities-title" className="pb-24 pt-8 md:pb-40">
      <div className="container-x">
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="h-px origin-left bg-ink/30"
        />
        <div className="label flex items-center justify-between py-4">
          <p>Chapter 02</p>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 bg-orange" />
            What We Do
          </p>
        </div>

        <TextReveal
          as="h2"
          id="capabilities-title"
          text={"Everything digital.\nNothing ordinary."}
          highlight={["ordinary"]}
          lineClasses={["", "md:ml-[12vw]"]}
          className="mb-16 mt-10 font-display text-[clamp(32px,9vw,168px)] font-bold leading-[0.9] tracking-[-0.055em] text-ink md:mb-28 md:mt-16"
        />
      </div>

      <ul className="border-t border-ink/25" onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}>
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          const panelId = `service-panel-${i}`;
          return (
            <ScrollReveal as="li" key={s.number} delay={0.04} y={28} className="border-b border-ink/25">
              <div className="relative" onPointerEnter={(e) => onPointerEnter(e, i)}>
                {/* Subtle tint + orange edge */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-ink/[0.045] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 left-0 w-1 origin-top bg-orange transition-transform duration-500 ease-expo ${isOpen ? "scale-y-100" : "scale-y-0"}`}
                />

                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={(e) => onClick(e, i)}
                    className="container-x relative grid w-full grid-cols-[2.5rem_1fr_2.5rem] items-center gap-x-3 py-7 text-left md:grid-cols-12 md:gap-x-6 md:py-11"
                  >
                    <span
                      className={`label tabular-nums transition-colors duration-500 md:col-span-2 ${isOpen ? "text-orange-ink" : "text-muted"}`}
                    >
                      {s.number}
                    </span>
                    <span
                      className={`font-display text-[clamp(30px,5vw,84px)] font-semibold leading-[1] tracking-[-0.04em] text-ink transition-transform duration-700 ease-expo md:col-span-8 ${
                        isOpen ? "md:translate-x-4" : ""
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-10 place-items-center justify-self-end border transition-all duration-500 ease-expo md:col-span-2 md:size-14 ${
                        isOpen ? "rotate-90 border-orange bg-orange text-ink" : "border-ink/30 text-ink"
                      }`}
                    >
                      <ArrowUpRight className="size-5 md:size-6" />
                    </span>
                  </button>
                </h3>

                {/* Details: height animates via grid rows; inert while closed keeps it out of tab order and the a11y tree */}
                <div
                  id={panelId}
                  role="region"
                  aria-label={s.title}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-700 ease-expo ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="container-x relative grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-6 pb-9 md:grid-cols-12 md:gap-x-6 md:pb-14">
                      <p className="col-start-2 max-w-[34ch] text-[clamp(18px,1.6vw,26px)] leading-snug text-ink md:col-span-5 md:col-start-3">
                        {s.description}
                      </p>
                      <div className="col-start-2 flex flex-col gap-6 md:col-span-4 md:col-start-9 md:items-start">
                        <ul className="label flex flex-wrap gap-x-5 gap-y-2 text-ink">
                          {s.tags.map((t) => (
                            <li key={t} className="flex items-center gap-2">
                              <span aria-hidden="true" className="size-1.5 bg-orange" />
                              {t}
                            </li>
                          ))}
                        </ul>
                        <AnchorLink
                          href="#contact"
                          className="group label inline-flex min-h-11 items-center gap-2 border-b border-ink pb-0.5 text-ink"
                        >
                          Discuss {s.title}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </AnchorLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </ul>
    </section>
  );
}
