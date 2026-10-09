import { ArrowUpRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  return (
    <section id="capabilities" data-tone="light" aria-labelledby="capabilities-title" className="pb-28 md:pb-44">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-4 gap-y-8 pb-14 md:gap-x-6 md:pb-24">
          <p className="label col-span-12 text-orange-ink md:col-span-3">Chapter 02 — What We Do</p>
          <TextReveal
            as="h2"
            id="capabilities-title"
            text={"Capabilities,\nengineered."}
            highlight={["engineered"]}
            className="display-xl col-span-12 text-ink md:col-span-9"
          />
          <p className="lede col-span-12 max-w-[40ch] text-muted md:col-span-5 md:col-start-4">
            Five disciplines, one team. Each is practised at depth and combined without friction.
          </p>
        </div>
      </div>

      <ul className="border-t border-ink">
        {SERVICES.map((s, i) => (
          <ScrollReveal as="li" key={s.number} delay={i * 0.05} y={24} className="border-b border-ink">
            <AnchorLink
              href="#contact"
              aria-label={`${s.title} — start a conversation`}
              className="group relative block overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-orange transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="container-x relative grid grid-cols-12 items-start gap-x-4 gap-y-4 py-7 transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink md:gap-x-6 md:py-10">
                <span className="label col-span-2 pt-2 tabular-nums text-orange-ink group-hover:text-ink group-focus-visible:text-ink md:col-span-2 md:pt-4">
                  {s.number}
                </span>
                <span className="display-lg col-span-10 text-ink transition-transform duration-500 ease-expo group-hover:translate-x-3 group-focus-visible:translate-x-3 md:col-span-6">
                  {s.title}
                </span>
                <span className="col-span-10 col-start-3 flex flex-col gap-4 md:col-span-4 md:col-start-9 md:pt-2">
                  <span className="max-w-[40ch] text-muted transition-colors group-hover:text-ink group-focus-visible:text-ink">
                    {s.description}
                  </span>
                  <span className="label flex flex-wrap gap-x-4 gap-y-1 text-muted transition-colors group-hover:text-ink group-focus-visible:text-ink">
                    {s.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-0 top-8 hidden size-6 -translate-x-[clamp(16px,4vw,64px)] opacity-0 transition-all duration-500 ease-expo group-hover:opacity-100 group-focus-visible:opacity-100 md:top-11 md:block"
                />
              </span>
            </AnchorLink>
          </ScrollReveal>
        ))}
      </ul>
    </section>
  );
}
