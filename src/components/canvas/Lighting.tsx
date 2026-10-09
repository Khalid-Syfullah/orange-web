"use client";

import { useMemo, useRef } from "react";
import { Object3D, type AmbientLight, type Color, type Fog, type DirectionalLight, type HemisphereLight, type SpotLight } from "three";
import { WORLD } from "@/story/world";
import { useStoryFrame } from "./useStoryFrame";

/**
 * Natural light for the garden that turns into a studio key + warm rim for the orange.
 * Background and fog share one colour, so pulling the fog in dissolves the garden into
 * the backdrop without a cut.
 */
export default function Lighting() {
  const sun = useRef<DirectionalLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const sky = useRef<HemisphereLight>(null);
  const rim = useRef<SpotLight>(null);
  const background = useRef<Color>(null);
  const fog = useRef<Fog>(null);

  const rimTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(...WORLD.studio);
    return target;
  }, []);

  useStoryFrame(({ lighting: l }) => {
    background.current?.set(l.background);
    if (fog.current) {
      fog.current.color.set(l.background);
      fog.current.near = l.fogNear;
      fog.current.far = l.fogFar;
    }

    if (sun.current) {
      sun.current.position.set(...l.sunPosition);
      sun.current.color.set(l.sunColor);
      sun.current.intensity = l.sunIntensity;
    }
    if (ambient.current) ambient.current.intensity = l.ambient * 0.35;
    if (sky.current) sky.current.intensity = l.ambient;
    if (rim.current) rim.current.intensity = l.rim;
  }, -1);

  return (
    <>
      <color ref={background} attach="background" args={["#F7F3EA"]} />
      <fog ref={fog} attach="fog" args={["#F7F3EA", 16, 42]} />
      <hemisphereLight ref={sky} args={["#FFF6E8", "#B9A88A", 0.8]} />
      <ambientLight ref={ambient} intensity={0.3} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />
      <spotLight
        ref={rim}
        color="#FF7800"
        position={[WORLD.studio[0] - 1.2, WORLD.studio[1] + 1.4, WORLD.studio[2] - 1.6]}
        angle={0.5}
        penumbra={0.9}
        distance={8}
        decay={2}
        intensity={0}
        target={rimTarget}
      />
      <primitive object={rimTarget} />
    </>
  );
}
