"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import StaticSphere from "@/components/StaticSphere";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { canRender3D } from "@/lib/capability";

// three.js is only fetched on capable, motion-friendly devices.
const SphereCanvas = dynamic(() => import("@/components/SphereCanvas"), { ssr: false });

const noopSubscribe = () => () => {};

export default function SphereSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [lowPerf, setLowPerf] = useState(false);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const capable = useSyncExternalStore(noopSubscribe, canRender3D, () => false);
  const live = capable && !reduceMotion && !lowPerf;

  // Phase 1: the section slides in. Phase 2: the stage is pinned and the sphere performs.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const { scrollYProgress: pinned } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const background = useTransform(pinned, [0.6, 0.78], ["#F7F5F0", "#171717"]);
  const color = useTransform(pinned, [0.6, 0.78], ["#202020", "#F7F5F0"]);

  // Only render frames while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    // three.js is only downloaded once the section is about a screen away.
    const preload = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && (setNear(true), preload.disconnect()),
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    preload.observe(el);
    return () => {
      io.disconnect();
      preload.disconnect();
    };
  }, []);

  return (
    <section ref={ref} id="built" data-tone="light" aria-labelledby="built-title" className="relative h-[270svh] md:h-[300svh]">
      <motion.div style={{ backgroundColor: background, color }} className="sticky top-0 h-svh overflow-hidden">
        {/* Static sphere: first paint, low-power and reduced-motion fallback */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${live && near && ready ? "opacity-0" : "opacity-100"}`}>
          <StaticSphere enter={enter} pinned={pinned} />
        </div>

        {live && near && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <SphereCanvas
              enter={enter}
              pinned={pinned}
              active={visible}
              onReady={() => setReady(true)}
              onLowPerformance={() => setLowPerf(true)}
            />
          </div>
        )}

        <div className="container-x pointer-events-none relative z-10 flex h-full flex-col justify-between pb-10 pt-28 md:pb-14 md:pt-32">
          <TextReveal
            as="h2"
            id="built-title"
            text={"Built to\nstand out."}
            highlight={["stand", "out"]}
            className="font-display text-[clamp(44px,13vw,200px)] font-bold leading-[0.88] tracking-[-0.055em] md:text-[clamp(64px,9.4vw,200px)]"
          />

          <div className="flex items-end justify-between gap-8">
            <ScrollReveal delay={0.2}>
              <p className="lede max-w-[32ch] text-[clamp(20px,1.6vw,28px)] leading-snug">
                Technology should do more than work.
                <br />
                It should inspire.
              </p>
            </ScrollReveal>
            <p aria-hidden="true" className="label hidden whitespace-nowrap opacity-70 md:block">
              Fig. 02 — Orange, in the round
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tone sentinel: tells the header the stage has turned dark */}
      <div id="built-dark" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]" />
    </section>
  );
}
