import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/scroll/SmoothScroll";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Orange.io — From seed to slice",
  description:
    "A scroll-driven story in eight movements: two people tend a young orange tree, it grows and ripens, and one orange is picked, turned in the light and opened.",
  applicationName: "Orange.io",
  openGraph: {
    title: "Orange.io — From seed to slice",
    description: "A scroll-driven story in eight movements.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EA",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-ink="dark" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
