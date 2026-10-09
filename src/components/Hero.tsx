import { ArrowDown } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import ParallaxSection from "@/components/animations/ParallaxSection";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import MagneticButton from "@/components/animations/MagneticButton";
import { OFFICES, SITE } from "@/lib/constants";

/** Concentric measurement rings around a flat orange disc. */
function Disc() {
  return (
    <div className="relative aspect-square w-[min(70vw,30rem)] md:w-[min(42vw,52rem)]">
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

export default function Hero() {
  return (
    <section
      id="top"
      data-tone="light"
      className="relative flex min-h-svh flex-col overflow-hidden pb-8 pt-28 md:pt-32"
    >
      <div className="pointer-events-none absolute -right-[14vw] top-[8svh] md:-right-[6vw] md:top-[8svh]">
        <ParallaxSection speed={0.12}>
          <ScrollReveal y={0}>
            <Disc />
          </ScrollReveal>
        </ParallaxSection>
      </div>

      <div className="container-x relative z-10 mt-auto">
        <p className="label mb-6 text-muted md:mb-10">
          <span className="text-orange-ink">●</span>&nbsp; Independent digital studio — Est. 2014
        </p>

        <TextReveal
          as="h1"
          id="hero-title"
          text={"We build\nwhat comes\nnext."}
          trigger="mount"
          delay={0.1}
          highlight={["next"]}
          lineClasses={["", "md:ml-[9vw]", ""]}
          className="display-hero text-ink"
        />

        <div className="mt-10 grid grid-cols-12 items-end gap-x-4 gap-y-8 border-t border-rule pt-6 md:mt-16">
          <p className="lede col-span-12 max-w-[34ch] md:col-span-5 lg:col-span-4">
            {SITE.secondary} A studio of senior designers and engineers shaping the products and platforms
            that define their categories.
          </p>
          <div className="col-span-12 md:col-span-4 md:col-start-7 lg:col-start-6">
            <MagneticButton href="#contact">Start a project</MagneticButton>
          </div>
          <div className="label col-span-12 flex items-center justify-between gap-6 text-muted md:col-span-3 md:justify-end">
            <span>{OFFICES.join(" / ")}</span>
            <AnchorLink
              href="#studio"
              aria-label="Scroll to studio"
              className="grid size-11 place-items-center overflow-hidden border border-ink/30 text-ink hover:bg-ink hover:text-paper"
            >
              <ArrowDown aria-hidden="true" className="size-4" style={{ animation: "cue 2.4s ease-in-out infinite" }} />
            </AnchorLink>
          </div>
        </div>
      </div>
    </section>
  );
}
