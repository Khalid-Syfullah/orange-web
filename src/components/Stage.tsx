"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { resolveStory } from "@/story/state";
import { storyStore } from "@/story/store";
import Captions from "./Captions";

// Three.js is the heaviest part of the page and needs the browser, so it loads on its
// own after hydration. Until it arrives the stage shows the backdrop colour of the frame.
const StoryCanvas = dynamic(() => import("./canvas/StoryCanvas"), { ssr: false });

/** The sticky viewport the story plays in: 3D canvas behind, captions in front. */
export default function Stage() {
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paint = () => {
      if (backdrop.current) backdrop.current.style.backgroundColor = storyStore.getState().lighting.background;
    };
    paint();
    return storyStore.subscribe(paint);
  }, []);

  return (
    <div className="sticky top-0 h-svh w-full overflow-hidden">
      <div
        ref={backdrop}
        className="absolute inset-0"
        style={{ backgroundColor: resolveStory(0).lighting.background }}
        aria-hidden="true"
      >
        <StoryCanvas />
      </div>
      <Captions />
    </div>
  );
}
