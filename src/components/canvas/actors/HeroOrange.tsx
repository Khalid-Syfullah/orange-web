"use client";

import { useRef } from "react";
import type { Group, MeshPhysicalMaterial } from "three";
import { heroOrangePose } from "@/story/choreography";
import { lerpColor } from "@/story/math";
import { PALETTE } from "../materials";
import { useStoryFrame } from "../useStoryFrame";

const R = 0.075;
/** How far each half travels (in orange radii) at full split. */
const SEPARATION = 1.2;

/**
 * The chosen orange, from fruit-set to the final reveal. It is built as two halves from
 * the start (they meet seamlessly until the split), so the hand-off from whole fruit to
 * cut fruit needs no swap. Blockout surfaces; peel, pith and segment detail come later.
 */
export default function HeroOrange() {
  const root = useRef<Group>(null);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const peelL = useRef<MeshPhysicalMaterial>(null);
  const peelR = useRef<MeshPhysicalMaterial>(null);

  useStoryFrame((story) => {
    const pose = heroOrangePose(story);
    const g = root.current;
    if (!g) return;

    g.visible = pose.scale > 1e-3;
    if (!g.visible) return;

    g.position.set(...pose.position);
    g.rotation.set(...pose.rotation);
    g.scale.setScalar(pose.scale);

    const offset = pose.split * SEPARATION * R;
    const turn = pose.open * (Math.PI / 2);
    left.current?.position.set(-offset, 0, 0);
    left.current?.rotation.set(0, -turn, 0);
    right.current?.position.set(offset, 0, 0);
    right.current?.rotation.set(0, turn, 0);

    const peel = lerpColor(PALETTE.unripe, PALETTE.orange, pose.ripeness);
    peelL.current?.color.set(peel);
    peelR.current?.color.set(peel);
  });

  // Each half: a hemisphere of peel plus the cut face (flesh disc ringed with pith).
  // SphereGeometry's phi runs around y; [π/2, 3π/2] is the +x half, [-π/2, π/2] the -x half.
  const half = (side: -1 | 1, material: typeof peelL) => (
    <>
      <mesh castShadow>
        <sphereGeometry args={[R, 48, 32, side === 1 ? Math.PI / 2 : -Math.PI / 2, Math.PI]} />
        <meshPhysicalMaterial ref={material} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.45} />
      </mesh>
      <group rotation-y={side === 1 ? -Math.PI / 2 : Math.PI / 2}>
        <mesh>
          <circleGeometry args={[R * 0.9, 48]} />
          <meshStandardMaterial color={PALETTE.flesh} roughness={0.35} emissive={PALETTE.flesh} emissiveIntensity={0.08} />
        </mesh>
        <mesh position-z={0.0002}>
          <ringGeometry args={[R * 0.88, R, 48]} />
          <meshStandardMaterial color={PALETTE.pith} roughness={0.8} />
        </mesh>
        <mesh position-z={0.0004}>
          <circleGeometry args={[R * 0.1, 20]} />
          <meshStandardMaterial color={PALETTE.pith} roughness={0.8} />
        </mesh>
      </group>
    </>
  );

  return (
    <group ref={root} visible={false}>
      <group ref={left}>{half(-1, peelL)}</group>
      <group ref={right}>{half(1, peelR)}</group>
    </group>
  );
}
