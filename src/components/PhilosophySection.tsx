import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { MARQUEE, PRINCIPLES } from "@/lib/constants";

export default function PhilosophySection() {
  return (
    <section
      id="philosophy"
      data-tone="dark"
      aria-labelledby="philosophy-title"
      className="relative overflow-hidden bg-ink pt-28 text-paper md:pt-44"
    >
      <div className="container-x grid grid-cols-12 gap-x-4 md:gap-x-6">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="label text-orange">(04) Philosophy</p>
            <TextReveal
              as="h2"
              id="philosophy-title"
              text={"Four beliefs.\nNo compromises."}
              highlight={["compromises"]}
              highlightClassName="text-orange"
              className="display-xl mt-8 !text-[clamp(38px,4.6vw,84px)]"
            />
            <p className="lede mt-8 max-w-[34ch] text-paper/70">
              Principles are only useful if they change what you ship. These four decide what we build —
              and what we refuse to.
            </p>
          </div>
        </div>

        <ol className="col-span-12 mt-20 md:col-span-6 md:col-start-7 md:mt-0">
          {PRINCIPLES.map((p) => (
            <ScrollReveal as="li" key={p.number} className="border-t border-paper/20 py-10 md:py-16">
              <div className="flex items-baseline gap-5">
                <span className="label tabular-nums text-orange">{p.number}</span>
                <h3 className="display-lg">{p.title}</h3>
              </div>
              <p className="lede mt-5 max-w-[38ch] text-paper/70 md:ml-[calc(2.2rem+1.25rem)]">{p.body}</p>
            </ScrollReveal>
          ))}
        </ol>
      </div>

      <div aria-hidden="true" className="mt-20 select-none overflow-hidden border-t border-paper/20 py-8 md:mt-32">
        <div className="flex w-max" style={{ animation: "marquee 48s linear infinite" }}>
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {MARQUEE.map((w) => (
                <span key={`${n}-${w}`} className="flex items-center">
                  <span
                    className="display-xl px-8 text-transparent"
                    style={{ WebkitTextStroke: "1px var(--color-paper)" }}
                  >
                    {w}
                  </span>
                  <span className="size-4 shrink-0 rounded-full bg-orange" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
