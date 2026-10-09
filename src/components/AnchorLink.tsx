"use client";

import type { AnchorHTMLAttributes } from "react";
import { navigateTo } from "@/lib/scroll";

/** In-page link that scrolls through Lenis instead of jumping. */
export default function AnchorLink({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        navigateTo(e, href);
      }}
      {...rest}
    />
  );
}
