"use client";

import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { navigateTo } from "@/lib/scroll";

type Variant = "solid" | "inverse" | "outline-light";

const VARIANTS: Record<Variant, { base: string; fill: string }> = {
  solid: { base: "bg-ink text-paper group-hover:text-ink group-focus-visible:text-ink", fill: "bg-orange" },
  inverse: { base: "bg-ink text-paper group-hover:text-ink group-focus-visible:text-ink", fill: "bg-paper" },
  "outline-light": {
    base: "border border-paper/60 text-paper group-hover:text-ink group-focus-visible:text-ink",
    fill: "bg-orange",
  },
};

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: Variant;
  /** How far the button follows the pointer (0–1). */
  strength?: number;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export default function MagneticButton({
  children,
  href,
  type = "button",
  variant = "solid",
  strength = 0.35,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!canHover) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const v = VARIANTS[variant];
  const classes = `group relative inline-flex min-h-14 items-center gap-3 overflow-hidden px-7 py-4 font-display text-base font-medium tracking-tight transition-colors duration-500 ${v.base} ${className}`;
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100 ${v.fill}`}
      />
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="relative z-10 size-5 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );

  return (
    <motion.span style={{ x: sx, y: sy }} className="inline-block" onPointerMove={move} onPointerLeave={leave}>
      {href ? (
        <a
          href={href}
          className={classes}
          onClick={(e) => {
            onClick?.(e);
            if (href.startsWith("#")) navigateTo(e, href);
          }}
        >
          {inner}
        </a>
      ) : (
        <button type={type} className={classes} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
