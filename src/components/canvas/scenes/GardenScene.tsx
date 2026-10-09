"use client";

import { manPose, womanPose } from "@/story/choreography";
import Gardener from "../actors/Gardener";
import Ground from "../actors/Ground";
import OrangeTree from "../actors/OrangeTree";
import { PALETTE } from "../materials";
import SceneGroup from "../SceneGroup";

/**
 * Movements 1–4 (tending, growth, ripening, picking) share one garden set. It stays
 * mounted through "float" so the fog can dissolve it rather than cutting it away.
 */
export default function GardenScene() {
  return (
    <SceneGroup from="prologue" to="float">
      <Ground />
      <OrangeTree />
      <Gardener pose={womanPose} height={1.65} colors={PALETTE.woman} />
      <Gardener pose={manPose} height={1.8} colors={PALETTE.man} />
    </SceneGroup>
  );
}
