import { TIMELINE } from "@/story/timeline";

const CHAPTERS = TIMELINE.scenes.filter((s) => s.chapter !== null);

/** After the story the page simply continues: an ordinary closing section and footer. */
export default function Epilogue() {
  return (
    <footer className="relative bg-ink text-cream">
      <div className="px-gutter py-[18svh] md:px-[max(var(--gutter),5vw)]">
        <p className="eyebrow text-cream/70">Epilogue</p>
        <p className="mt-6 max-w-[14ch] font-display text-[clamp(48px,8vw,128px)] leading-[0.92] tracking-[-0.025em]">
          Grown slowly. Made to be <em className="text-orange">opened</em>.
        </p>
        <p className="mt-8 max-w-[44ch] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-cream/80">
          Orange.io is a story told in scroll: eight movements, one tree, one orange. Scroll back up and it plays in
          reverse, frame for frame.
        </p>

        <nav aria-label="Revisit a chapter" className="mt-16 border-t border-cream/15 pt-8">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {CHAPTERS.map((scene) => (
              <li key={scene.id}>
                <a href={`#chapter-${scene.id}`} className="link text-sm">
                  <span className="mr-2 tabular-nums text-cream/50">{String(scene.chapter).padStart(2, "0")}</span>
                  {scene.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-cream/15 px-gutter py-6 text-xs text-cream/60 sm:flex-row sm:justify-between md:px-[max(var(--gutter),5vw)]">
        <p>© {new Date().getFullYear()} Orange.io</p>
        <a href="#top" className="link">
          Back to the beginning
        </a>
      </div>
    </footer>
  );
}
