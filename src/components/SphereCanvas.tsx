"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { clamp01, easeInOutCubic, easeOutCubic, lerp, Spring } from "@/lib/spring";

interface SphereCanvasProps {
  /** 0 → 1 while the section scrolls into view. */
  enter: MotionValue<number>;
  /** 0 → 1 while the section is pinned. */
  pinned: MotionValue<number>;
  active: boolean;
  onReady: () => void;
  onLowPerformance: () => void;
}

/** Soft, low-frequency noise used as a bump map — a faint orange-peel dimple. */
function makePeelTexture() {
  const size = 64;
  const small = document.createElement("canvas");
  small.width = small.height = size;
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);

  const big = document.createElement("canvas");
  big.width = big.height = 256;
  const bctx = big.getContext("2d")!;
  bctx.imageSmoothingEnabled = true;
  bctx.imageSmoothingQuality = "high";
  bctx.drawImage(small, 0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(big);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 5);
  return tex;
}

/** Soft radial falloff used as a fake contact shadow: cheap, stable, and travels with the sphere. */
function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(61, 23, 0, 0.55)");
  g.addColorStop(0.45, "rgba(61, 23, 0, 0.22)");
  g.addColorStop(1, "rgba(61, 23, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function Orb({ enter, pinned }: Pick<SphereCanvasProps, "enter" | "pinned">) {
  const group = useRef<THREE.Group>(null);
  const sphere = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const idle = useRef(0);
  const { viewport } = useThree();
  const peel = useMemo(() => makePeelTexture(), []);
  const shadow = useMemo(() => makeShadowTexture(), []);

  const springs = useRef({
    x: new Spring(0, 55, 12),
    y: new Spring(0, 55, 12),
    scale: new Spring(0.01, 60, 12),
    rx: new Spring(0.2, 40, 10),
    ry: new Spring(0, 40, 10),
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      peel.dispose();
      shadow.dispose();
    };
  }, [peel, shadow]);

  useFrame((_, dt) => {
    const g = group.current;
    const m = sphere.current;
    if (!g || !m) return;

    // One scalar for the whole journey: 0→1 entering, 1→2 pinned.
    const e = clamp01(enter.get());
    const q = clamp01(pinned.get());
    const t = e < 1 ? e : 1 + q;

    const w = viewport.width;
    const h = viewport.height;
    const wide = w / h > 1.1;
    const base = wide ? Math.min(h * 0.3, w * 0.165) : Math.min(w * 0.34, h * 0.2);
    const x0 = wide ? w * 0.26 : 0;
    const y0 = wide ? 0 : -h * 0.06;

    let x: number, y: number, s: number;
    if (t < 1) {
      const k = easeOutCubic(t);
      x = lerp(wide ? w * 0.8 : w * 0.9, x0, k); // enters from the right
      y = y0;
      s = base * lerp(0.8, 1, k);
    } else if (q < 0.65) {
      const u = q / 0.65;
      x = x0;
      y = y0 + u * h * 0.03;
      s = base * (1 + 0.1 * u); // slight swell
    } else {
      const v = easeInOutCubic((q - 0.65) / 0.35);
      x = lerp(x0, 0, v);
      y = lerp(y0 + h * 0.03, -h * 1.05, v); // sinks out of frame as the next section arrives
      s = base * lerp(1.1, 1.35, v);
    }

    idle.current += dt * 0.16;
    const sp = springs.current;
    g.position.x = sp.x.step(x, dt);
    g.position.y = sp.y.step(y, dt);
    g.scale.setScalar(Math.max(0.001, sp.scale.step(s, dt)));
    m.rotation.y = sp.ry.step(idle.current + t * 1.4 + pointer.current.x * 0.45, dt);
    m.rotation.x = sp.rx.step(0.2 - pointer.current.y * 0.28, dt);
  });

  return (
    <group ref={group}>
      <mesh ref={sphere}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#ff6b00"
          roughness={0.42}
          metalness={0}
          clearcoat={0.7}
          clearcoatRoughness={0.3}
          sheen={0.6}
          sheenRoughness={0.5}
          sheenColor="#ffb070"
          bumpMap={peel}
          bumpScale={0.5}
        />
      </mesh>
      <mesh position={[0, -1.32, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.4, 3.4, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} opacity={0.75} />
      </mesh>
    </group>
  );
}

export default function SphereCanvas({ enter, pinned, active, onReady, onLowPerformance }: SphereCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.6, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      aria-hidden="true"
    >
      <PerformanceMonitor bounds={() => [18, 60]} flipflops={2} onFallback={onLowPerformance} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 5]} intensity={1.1} color="#fff1e0" />
      {/* Studio softboxes — no network-loaded HDR */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[-5, 4, 4]} scale={[7, 4, 1]} color="#fff3e6" />
        <Lightformer form="rect" intensity={1.4} position={[6, 0, 3]} scale={[3, 7, 1]} color="#ffd2a3" />
        <Lightformer form="circle" intensity={0.8} position={[0, -4, 2]} scale={6} color="#ffe8d0" />
        <Lightformer form="ring" intensity={1.2} position={[0, 5, -4]} scale={5} color="#ffffff" />
      </Environment>
      <Orb enter={enter} pinned={pinned} />
    </Canvas>
  );
}
