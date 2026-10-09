import AnchorLink from "@/components/AnchorLink";
import MagneticButton from "@/components/animations/MagneticButton";
import { CHAPTERS, OFFICES, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer data-tone="dark" className="overflow-hidden bg-ink pt-20 text-paper md:pt-28">
      <div className="container-x grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
        <div className="col-span-12 md:col-span-5">
          <p className="display-md max-w-[16ch]">{SITE.tagline}</p>
          <p className="lede mt-5 max-w-[32ch] text-paper/70">{SITE.secondary}</p>
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-8">
          <p className="label mb-4 text-paper/60">Index</p>
          <ul className="space-y-1">
            {CHAPTERS.slice(1).map((c) => (
              <li key={c.id}>
                <AnchorLink href={`#${c.id}`} className="inline-flex min-h-9 items-center hover:text-orange">
                  {c.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3">
          <p className="label mb-4 text-paper/60">Say hello</p>
          <a href={`mailto:${SITE.email}`} className="inline-flex min-h-9 items-center break-all hover:text-orange">
            {SITE.email}
          </a>
          <p className="mt-3 text-paper/70">{OFFICES.join(" · ")}</p>
        </div>

        <div className="col-span-12 flex md:justify-end">
          <MagneticButton href="#top" variant="outline-light">
            Back to top
          </MagneticButton>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="container-x mt-16 select-none whitespace-nowrap font-display text-[29vw] font-bold pb-[0.2em] leading-[0.78] tracking-[-0.06em] text-orange md:mt-24"
      >
        Orange
      </p>

      <div className="container-x label flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-paper/20 py-6 text-paper/60">
        <span>© {SITE.year} {SITE.name} Studio</span>
        <span>Engineered differently.</span>
      </div>
    </footer>
  );
}
