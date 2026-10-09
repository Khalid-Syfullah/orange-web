"use client";

import HeroOrange from "../actors/HeroOrange";
import SceneGroup from "../SceneGroup";

/**
 * Movements 3–8: the chosen orange from the moment it sets on the branch, through the
 * pick and the lift, to the slow turn, the split and the reveal.
 */
export default function OrangeScene() {
  return (
    <SceneGroup from="ripening" to="reveal">
      <HeroOrange />
    </SceneGroup>
  );
}
