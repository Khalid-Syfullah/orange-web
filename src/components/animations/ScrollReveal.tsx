"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/animations";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "section" | "article";
}

const TAGS = { div: motion.div, li: motion.li, p: motion.p, section: motion.section, article: motion.article };

/** Fade + rise when the element enters the viewport. */
export default function ScrollReveal({ children, className, delay = 0, y = 32, as = "div" }: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </Tag>
  );
}
