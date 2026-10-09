"use client";

import { PALETTE } from "../materials";

/** Blockout: a wide warm ground with a patch of soil under the tree. */
export default function Ground() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color={PALETTE.ground} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} receiveShadow>
        <circleGeometry args={[1.1, 48]} />
        <meshStandardMaterial color={PALETTE.soil} roughness={1} />
      </mesh>
    </group>
  );
}
