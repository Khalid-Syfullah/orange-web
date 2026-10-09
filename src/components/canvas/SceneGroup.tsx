"use client";

import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { SceneId } from "@/story/config";
import { TIMELINE, at } from "@/story/timeline";
import { useStoryFrame } from "./useStoryFrame";

interface SceneGroupProps {
  /** First scene this group is needed for. */
  from: SceneId;
  /** Last scene this group is needed for (inclusive). */
  to: SceneId;
  children: ReactNode;
}

/**
 * Mounts a part of the world once and only *draws* it while the story is inside
 * [from, to]. Outside that window it costs nothing per frame, and because visibility is
 * derived from progress it switches back on correctly when scrolling up.
 */
export default function SceneGroup({ from, to, children }: SceneGroupProps) {
  const group = useRef<Group>(null);
  const start = at(TIMELINE, from, 0);
  const end = at(TIMELINE, to, 1);

  useStoryFrame(({ progress }) => {
    if (group.current) group.current.visible = progress >= start && progress <= end;
  }, -1);

  return <group ref={group}>{children}</group>;
}
