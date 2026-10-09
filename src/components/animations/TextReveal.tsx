"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE } from "@/lib/animations";

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const;

interface TextRevealProps {
  text: string;
  as?: keyof typeof TAGS;
  id?: string;
  className?: string;
  /** Delay before the first word, in seconds. */
  delay?: number;
  /** Reveal on mount (hero) or when scrolled into view. */
  trigger?: "mount" | "view";
  /** Words rendered in `highlightClassName`. Matched without punctuation. */
  highlight?: readonly string[];
  highlightClassName?: string;
  /** Optional extra classes per line (e.g. an indent). */
  lineClasses?: readonly string[];
}

/**
 * Masked word-by-word reveal. Use "\n" in `text` for explicit line breaks.
 * Words are aria-hidden; the full string is exposed through aria-label.
 */
export default function TextReveal({
  text,
  as = "div",
  id,
  className,
  delay = 0,
  trigger = "view",
  highlight = [],
  highlightClassName = "text-orange-deep",
  lineClasses = [],
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "112%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 1.05, ease: EASE } },
  };

  const lines = text.split("\n");
  const viewProps =
    trigger === "view"
      ? { whileInView: "show", viewport: { once: true, amount: 0.4 } }
      : { animate: "show" };

  return (
    <Tag
      id={id}
      className={className}
      aria-label={text.replace(/\n/g, " ")}
      variants={container}
      initial="hidden"
      {...viewProps}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${lineClasses[li] ?? ""}`}>
          {line.split(" ").map((w, wi) => {
            const isHighlight = highlight.includes(w.replace(/[^\p{L}\p{N}']/gu, ""));
            return (
              <Fragment key={wi}>
                <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
                  <motion.span
                    variants={word}
                    className={`inline-block ${isHighlight ? highlightClassName : ""}`}
                  >
                    {w}
                  </motion.span>
                </span>{" "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
