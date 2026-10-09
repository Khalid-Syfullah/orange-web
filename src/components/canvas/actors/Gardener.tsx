"use client";

import { useMemo, useRef } from "react";
import { Object3D, Vector3, type Group, type InstancedMesh } from "three";
import type { Beat, PersonPose } from "@/story/choreography";
import { fract, lerp, segment, type Vec3 } from "@/story/math";
import { PALETTE } from "../materials";
import { useStoryFrame } from "../useStoryFrame";

interface GardenerProps {
  pose: (beat: Beat) => PersonPose;
  /** Standing height in metres. */
  height: number;
  colors: { body: string; skin: string; legs: string };
}

const UP = new Vector3(0, 1, 0);
const DROPS = 22;

/**
 * Blockout person with a watering can. Placeholder geometry only: the final version swaps
 * in a rigged model whose animation clips are scrubbed with `mixer.setTime(clip * local)`,
 * driven by the same pose functions, so it stays deterministic.
 */
export default function Gardener({ pose, height, colors }: GardenerProps) {
  const body = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const can = useRef<Group>(null);
  const drops = useRef<InstancedMesh>(null);

  const tmp = useMemo(
    () => ({ a: new Vector3(), b: new Vector3(), dir: new Vector3(), o: new Object3D() }),
    [],
  );
  const k = height / 1.7;

  useStoryFrame((story) => {
    const p = pose(story);
    const forward: Vec3 = [Math.sin(p.yaw), 0, Math.cos(p.yaw)];

    if (body.current) {
      body.current.position.set(...p.position);
      body.current.rotation.y = p.yaw;
    }

    const swing = Math.sin(p.stride * Math.PI * 2) * 0.45;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;

    // Arm: a capsule stretched from shoulder to hand.
    if (arm.current) {
      tmp.a.set(...p.shoulder);
      tmp.b.set(...p.hand);
      tmp.dir.subVectors(tmp.b, tmp.a);
      const length = tmp.dir.length();
      arm.current.position.copy(tmp.a).addScaledVector(tmp.dir, 0.5);
      arm.current.quaternion.setFromUnitVectors(UP, tmp.dir.normalize());
      arm.current.scale.set(1, Math.max(length, 0.01), 1);
    }

    // Can: in the hand, tilting to pour, then lowered to the ground beside them.
    const down = p.canDown;
    const ground: Vec3 = [p.position[0] + forward[0] * 0.35, 0.12, p.position[2] + forward[2] * 0.35];
    const canPos: Vec3 = [lerp(p.hand[0], ground[0], down), lerp(p.hand[1] - 0.1, ground[1], down), lerp(p.hand[2], ground[2], down)];
    if (can.current) {
      can.current.position.set(...canPos);
      can.current.rotation.set(p.pour * 0.75, p.yaw, 0, "YXZ");
    }

    // Water: droplets on a parabola from the spout, phase-locked to progress.
    const mesh = drops.current;
    if (mesh) {
      mesh.visible = p.pour > 0.02;
      if (mesh.visible) {
        const spout: Vec3 = [canPos[0] + forward[0] * 0.24, canPos[1] + 0.02, canPos[2] + forward[2] * 0.24];
        const reach = 0.12 + p.pour * 0.18;
        for (let i = 0; i < DROPS; i++) {
          const t = fract(story.progress * 160 + i / DROPS);
          const size = 0.012 * segment(p.pour, 0, 0.4) * (1 - t * 0.4);
          tmp.o.position.set(
            spout[0] + forward[0] * reach * t,
            spout[1] - spout[1] * t * t,
            spout[2] + forward[2] * reach * t,
          );
          tmp.o.scale.set(size, size * 2.2, size);
          tmp.o.updateMatrix();
          mesh.setMatrixAt(i, tmp.o.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <group ref={body}>
        <group scale={k}>
          {/* Legs pivot at the hip so the stride swings from the right place. */}
          <group ref={legL} position={[-0.09, 1.2, 0]}>
            <mesh position-y={-0.41} castShadow>
              <capsuleGeometry args={[0.07, 0.68, 4, 10]} />
              <meshStandardMaterial color={colors.legs} roughness={0.9} />
            </mesh>
          </group>
          <group ref={legR} position={[0.09, 1.2, 0]}>
            <mesh position-y={-0.41} castShadow>
              <capsuleGeometry args={[0.07, 0.68, 4, 10]} />
              <meshStandardMaterial color={colors.legs} roughness={0.9} />
            </mesh>
          </group>
          <mesh position-y={1.18} castShadow>
            <capsuleGeometry args={[0.17, 0.42, 6, 14]} />
            <meshStandardMaterial color={colors.body} roughness={0.85} />
          </mesh>
          <mesh position-y={1.58} castShadow>
            <sphereGeometry args={[0.11, 20, 16]} />
            <meshStandardMaterial color={colors.skin} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Unit-length along y; the frame callback stretches it from shoulder to hand. */}
      <group ref={arm}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.04, 1, 10]} />
          <meshStandardMaterial color={colors.body} roughness={0.85} />
        </mesh>
      </group>

      <group ref={can}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.2, 18]} />
          <meshStandardMaterial color={PALETTE.can} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.04, 0.14]} rotation-x={Math.PI / 2.6}>
          <cylinderGeometry args={[0.012, 0.02, 0.22, 8]} />
          <meshStandardMaterial color={PALETTE.can} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      <instancedMesh ref={drops} args={[undefined, undefined, DROPS]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={PALETTE.water} roughness={0.1} transparent opacity={0.8} />
      </instancedMesh>
    </>
  );
}
