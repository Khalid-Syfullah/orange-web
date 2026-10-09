import { ArrowUpRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import { NAV_LINKS, OFFICES, SITE, SOCIALS } from "@/lib/constants";

const LINK = "group relative inline-flex min-h-11 min-w-11 items-center gap-1.5 transition-colors duration-300 hover:text-orange focus-visible:text-orange";

function Underline() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
    />
  );
}

export default function Footer() {
  return (
    <footer data-tone="dark" className="overflow-hidden bg-ink text-paper">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-4 gap-y-14 border-t border-paper/25 pt-14 md:gap-x-6 md:pt-20">
          <div className="col-span-12 md:col-span-6">
            <p className="font-display text-[clamp(28px,3.6vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">
              Independent by design.
              <br />
              <span className="text-orange">Connected by technology.</span>
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-3 md:col-start-7 lg:col-span-2 lg:col-start-8">
            <p className="label mb-4 text-paper/60">Navigate</p>
            <ul>
              <li>
                <AnchorLink href="#top" className={LINK}>
                  Home
                  <Underline />
                </AnchorLink>
              </li>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <AnchorLink href={`#${l.id}`} className={LINK}>
                    {l.label}
                    <Underline />
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3 lg:col-span-3">
            <p className="label mb-4 text-paper/60">Follow</p>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className={LINK}>
                    {s.label}
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <Underline />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="container-x mt-16 select-none whitespace-nowrap pb-[0.06em] font-display text-[25.8vw] font-bold uppercase leading-[0.8] tracking-[-0.05em] text-orange md:mt-24"
      >
        Orange
      </p>

      <div className="container-x label flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/20 py-6 text-paper/60">
        <span>
          © {SITE.year} {SITE.name} Studio. All rights reserved.
        </span>
        <span>{OFFICES.join(" · ")}</span>
        <AnchorLink href="#top" className="group relative inline-flex min-h-11 items-center transition-colors duration-300 hover:text-orange">
          Back to top
          <Underline />
        </AnchorLink>
      </div>
    </footer>
  );
}
