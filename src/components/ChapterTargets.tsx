import { TIMELINE, anchorOf } from "@/story/timeline";

/**
 * The story as real document content. Each scene is a section placed in the scroll track
 * at the point where it reads best, so:
 * - screen readers get the full narrative in order, with headings to jump between;
 * - `#chapter-…` links scroll to the right moment even before JavaScript loads;
 * - chapter navigation has a focus target that matches what is on screen.
 * Visually they are hidden; the on-stage captions show the same copy.
 */
export default function ChapterTargets() {
  return (
    <>
      {TIMELINE.scenes.map((scene) => (
        <section
          key={scene.id}
          id={`chapter-${scene.id}`}
          tabIndex={-1}
          aria-labelledby={`chapter-${scene.id}-title`}
          className="absolute left-0 h-px w-px outline-none"
          style={{ top: `calc(${anchorOf(TIMELINE, scene.id) * TIMELINE.length * 100}svh)` }}
        >
          <div className="sr-only">
            <h2 id={`chapter-${scene.id}-title`}>
              {scene.chapter === null ? scene.title : `Chapter ${scene.chapter}: ${scene.title}`}
            </h2>
            <p>{scene.kicker}.</p>
            <p>{scene.body}</p>
          </div>
        </section>
      ))}
    </>
  );
}
