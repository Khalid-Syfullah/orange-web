"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/animations/MagneticButton";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { OFFICES, SITE } from "@/lib/constants";

const FIELD =
  "w-full border-0 border-b border-ink bg-transparent py-3 text-lg text-ink placeholder:text-ink/50 focus:border-b-2 focus:outline-none focus-visible:outline-none";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  // No backend: compose a pre-filled email in the visitor's mail client.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `Project enquiry — ${data.get("name")}`;
    const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      data-tone="orange"
      aria-labelledby="contact-title"
      className="bg-orange pb-20 pt-28 text-ink md:pb-32 md:pt-44"
    >
      <div className="container-x">
        <p className="label">Chapter 04 — Let’s Talk</p>
        <TextReveal
          as="h2"
          id="contact-title"
          text={"Let’s build\nwhat’s next."}
          className="display-hero mt-8"
        />

        <a
          href={`mailto:${SITE.email}`}
          className="group mt-12 inline-flex items-center gap-3 border-b-2 border-ink pb-1 font-display text-[clamp(22px,4.4vw,64px)] font-semibold tracking-tight md:mt-20"
        >
          {SITE.email}
          <ArrowUpRight
            aria-hidden="true"
            className="size-[0.9em] transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>

        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-14 border-t border-ink pt-10 md:mt-28 md:gap-x-6">
          <div className="col-span-12 space-y-8 md:col-span-4">
            <div>
              <p className="label mb-2">New business</p>
              <p className="lede max-w-[28ch]">
                Tell us what you are building. We reply to every serious enquiry within two working days.
              </p>
            </div>
            <div>
              <p className="label mb-2">Studios</p>
              <p className="lede">{OFFICES.join(" · ")}</p>
            </div>
          </div>

          <ScrollReveal className="col-span-12 md:col-span-7 md:col-start-6">
            <form onSubmit={onSubmit} className="space-y-9">
              <div className="grid gap-9 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">Name</label>
                  <input id="name" name="name" required autoComplete="name" className={FIELD} />
                </div>
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={FIELD} />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="label">What are you building?</label>
                <textarea id="message" name="message" required rows={3} className={`${FIELD} resize-none`} />
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <MagneticButton type="submit" variant="inverse">
                  Send enquiry
                </MagneticButton>
                <p role="status" className="text-base">
                  {sent ? "Opening your mail app — thank you." : ""}
                </p>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
