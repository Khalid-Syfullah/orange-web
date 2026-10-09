import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE } from "@/lib/constants";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * Runs before first paint. Marks JS availability and decides whether the loading sequence plays:
 * it is skipped for reduced motion and for repeat visits in the same session. A timeout makes sure
 * the page can never stay hidden if something goes wrong.
 */
const HEAD_SCRIPT = `(function(d){var h=d.documentElement;h.classList.add('js');try{if(sessionStorage.getItem('orange-loaded')||matchMedia('(prefers-reduced-motion: reduce)').matches){h.dataset.ready='1';h.dataset.loader='done'}}catch(e){}setTimeout(function(){h.dataset.ready='1';h.dataset.loader='done'},9000)})(document)`;

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.secondary,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[100] -translate-y-24 bg-ink px-4 py-3 text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Loader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
