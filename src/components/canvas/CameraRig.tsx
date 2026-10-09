"use client";

import { useRef } from "react";
import type { PerspectiveCamera } from "three";
import { fitFov } from "@/story/state";
import { useStoryFrame } from "./useStoryFrame";

/** Places the camera from the master timeline. Runs before everything else each frame. */
export default function CameraRig() {
  const lastFov = useRef(0);

  useStoryFrame(({ camera: shot }, { camera, size }) => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(...shot.position);
    cam.lookAt(...shot.target);

    const fov = fitFov(shot.fov, size.width / Math.max(1, size.height));
    if (Math.abs(fov - lastFov.current) > 1e-4) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
      lastFov.current = fov;
    }
  }, -2);

  return null;
}
