"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type Group, type InstancedMesh } from "three";
import { fruitPose, treePose } from "@/story/choreography";
import { lerpColor } from "@/story/math";
import { WORLD } from "@/story/world";
import { PALETTE } from "../materials";
import { useStoryFrame } from "../useStoryFrame";

const TRUNK_HEIGHT = 1.9;
const FRUIT_RADIUS = 0.075;

/** Canopy blobs relative to the canopy centre: [x, y, z, radius]. */
const BLOBS: readonly (readonly [number, number, number, number])[] = [
  [0, 0, 0, 1.0],
  [-0.62, -0.18, 0.25, 0.68],
  [0.6, 0.05, -0.3, 0.72],
  [0.1, 0.42, 0.35, 0.6],
  [-0.2, 0.3, -0.55, 0.62],
  [0.42, -0.3, 0.85, 0.46], // the low branch the chosen orange hangs from
];

/** Fruit spread over the canopy shell with a golden-angle spiral: deterministic, evenly spaced. */
function fruitLayout(count: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = -0.65 + (i / (count - 1)) * 0.95; // mostly the lower, outer half
    const r = Math.sqrt(1 - y * y);
    const a = i * golden;
    const shell = 1.06;
    return {
      position: [Math.cos(a) * r * shell, y * shell, Math.sin(a) * r * shell] as const,
      order: ((i * 7) % count) / count, // shuffle the set wave so it doesn't sweep around the tree
    };
  });
}

/**
 * Blockout tree. Growth, sway and fruit are all read from the story state, so the tree
 * is a sapling, in full leaf or in fruit purely according to scroll position.
 */
export default function OrangeTree() {
  const trunk = useRef<Group>(null);
  const canopy = useRef<Group>(null);
  const fruit = useRef<InstancedMesh>(null);

  const layout = useMemo(() => fruitLayout(18), []);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  // Instance colours must exist before the first frame.
  useLayoutEffect(() => {
    layout.forEach((_, i) => fruit.current?.setColorAt(i, color.set(PALETTE.unripe)));
  }, [layout, color]);

  useStoryFrame((story) => {
    const pose = treePose(story);

    if (trunk.current) {
      const girth = 0.45 + pose.trunk * 0.55;
      trunk.current.scale.set(girth, pose.trunk, girth);
    }

    if (canopy.current) {
      // The canopy rides on top of the trunk and reaches its final place when fully grown.
      const lift = WORLD.canopy[1] - TRUNK_HEIGHT;
      canopy.current.position.set(0, TRUNK_HEIGHT * pose.trunk + lift * pose.canopy, 0);
      canopy.current.scale.setScalar(Math.max(pose.canopy, 1e-3));
      canopy.current.rotation.set(pose.sway * 0.6, 0, pose.sway);
    }

    const mesh = fruit.current;
    if (mesh) {
      layout.forEach(({ position, order }, i) => {
        const f = fruitPose(story, order);
        dummy.position.set(...position);
        dummy.scale.setScalar(Math.max(f.size * FRUIT_RADIUS, 1e-4));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, color.set(lerpColor(PALETTE.unripe, PALETTE.orange, f.ripeness)));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.visible = story.scenes.ripening > 0;
    }
  });

  return (
    <group position={WORLD.tree}>
      <group ref={trunk}>
        <mesh position-y={TRUNK_HEIGHT / 2} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.13, TRUNK_HEIGHT, 14]} />
          <meshStandardMaterial color={PALETTE.bark} roughness={0.95} />
        </mesh>
      </group>

      <group ref={canopy}>
        {BLOBS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <icosahedronGeometry args={[r, 3]} />
            <meshStandardMaterial color={i % 2 ? PALETTE.leafLight : PALETTE.leaf} roughness={0.85} />
          </mesh>
        ))}
        {/* Unit spheres scaled per instance; the matrices are rewritten every frame. */}
        <instancedMesh ref={fruit} args={[undefined, undefined, layout.length]} castShadow frustumCulled={false}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial roughness={0.55} />
        </instancedMesh>
      </group>
    </group>
  );
}
