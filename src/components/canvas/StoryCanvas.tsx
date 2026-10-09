"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { storyStore } from "@/story/store";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import GardenScene from "./scenes/GardenScene";
import OrangeScene from "./scenes/OrangeScene";

/** Renders a frame only when story progress changes (or the canvas resizes). */
function RenderOnProgress() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => storyStore.subscribe(() => invalidate()), [invalidate]);
  return null;
}

/**
 * The 3D stage. `frameloop="demand"` means the GPU is idle whenever the reader isn't
 * scrolling: every frame is a function of progress, so there's nothing to tick.
 */
export default function StoryCanvas() {
  const [dpr, setDpr] = useState(() => Math.min(1.5, window.devicePixelRatio));

  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      shadows="percentage"
      camera={{ fov: 32, near: 0.05, far: 80, position: [0, 1.7, 12.5] }}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping, outputColorSpace: SRGBColorSpace }}
      fallback={<p className="sr-only">Your browser could not start 3D graphics; the story text is still available below.</p>}
      aria-hidden="true"
    >
      {/* Trade resolution for frame rate on weaker GPUs, and back again when it recovers. */}
      <PerformanceMonitor onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))} onDecline={() => setDpr(1)} />
      <RenderOnProgress />
      <CameraRig />
      <Lighting />
      <GardenScene />
      <OrangeScene />
    </Canvas>
  );
}
