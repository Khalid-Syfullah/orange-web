"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";

interface StaticSphereProps {
  enter: MotionValue<number>;
  pinned: MotionValue<number>;
}

/**
 * CSS-only sphere. Used while WebGL loads, on low-power devices and for reduced motion.
 * It follows the same scroll journey with simple transforms (and stays put when motion is reduced).
 */
export default function StaticSphere({ enter, pinned }: StaticSphereProps) {
  const reduce = useReducedMotion();
  // Always mapped (never conditionally unset) so server-rendered transforms are overwritten on hydration.
  const x = useTransform(enter, [0, 1], reduce ? ["0vw", "0vw"] : ["55vw", "0vw"]);
  const scaleIn = useTransform(enter, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const scaleOut = useTransform(pinned, [0, 0.65, 1], reduce ? [1, 1, 1] : [1, 1.08, 1.3]);
  const y = useTransform(pinned, [0, 0.65, 1], reduce ? ["0vh", "0vh", "0vh"] : ["0vh", "0vh", "42vh"]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[12vw]">
      <motion.div style={{ x, y, scale: scaleIn }} className="mt-[30svh] md:mt-0">
        <motion.div style={{ scale: scaleOut }} className="relative">
          <div
            className="size-[min(62vw,22rem)] rounded-full md:size-[min(31vw,32rem)]"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, #ffb27a 0%, #ff8a3d 14%, #ff6b00 38%, #d94f00 68%, #8f2f00 100%)",
              boxShadow: "inset -2.2rem -2.6rem 4rem rgb(90 25 0 / 0.35), inset 1.2rem 1.4rem 2.4rem rgb(255 225 190 / 0.18)",
            }}
          />
          <div
            className="absolute -bottom-[7%] left-[10%] right-[10%] -z-10 h-[8%] rounded-full bg-[#3d1700]/40 blur-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
