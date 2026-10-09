# orange.io hero: prompt pack

Two kinds of prompts live here, kept apart on purpose.

| Folder | What it is | Who uses it |
| --- | --- | --- |
| `prompts/` | Six phases for Claude Code that build the scroll-driven hero | `run-prompts.sh` sends these in order |
| `asset-prompts/` | Prompts and commands for making the video, images, and frames | You, in an AI video or image tool and in your terminal |

## Order of operations

1. **Build the code first, with placeholders.** The code works without the real assets because `useGeneratedPlaceholders` starts as `true`.
   - Copy `prompts/` and `run-prompts.sh` into the orange.io repo root.
   - `chmod +x run-prompts.sh`
   - Run: `CHECK_CMD="npm run build" ./run-prompts.sh`
2. **Make the assets** using `asset-prompts/01` and `02`, then process them with `03`. You can do this while step 1 runs.
3. **Switch to the real assets.** Drop the frames and cutouts into `public/`, set `useGeneratedPlaceholders` to `false`, set `frames.count`, and tune `orangePosition` and the timeline values.

## Running the runner

```bash
cd ~/path/to/orange.io
chmod +x run-prompts.sh
CHECK_CMD="npm run build" ./run-prompts.sh
```

If auto mode is not available on your plan:

```bash
PERM_MODE=acceptEdits ALLOWED_TOOLS="Bash(npm *),Bash(npx *),Bash(git *)" \
CHECK_CMD="npm run build" ./run-prompts.sh
```

If it stops, read `logs/<phase>.txt` and `logs/<phase>.check.log`, fix the cause or edit that phase's prompt file, and run the same command again. It skips finished phases. `./run-prompts.sh --reset` starts over.

## The six phases

1. `01-inspect-and-setup.md`: inspect the repo, install `gsap` and `lenis`, create the config module and asset folders
2. `02-smooth-scroll.md`: Lenis synced with ScrollTrigger
3. `03-frame-canvas.md`: canvas frame-sequence player with placeholder mode
4. `04-hero-timeline.md`: pinned hero and the master scroll timeline (watering, pluck, slice, split, headline reveal)
5. `05-accessibility.md`: reduced motion, semantics, no-JS fallback
6. `06-performance-and-docs.md`: performance pass, QA, README section

All six phases share one conversation, so later phases build on earlier ones. Each phase also checks the repo for what already exists, so any phase can be re-run on its own.
