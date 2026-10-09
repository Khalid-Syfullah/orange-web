# PROMPT 01 — Project Setup and Animation Architecture

```text
You are a senior creative frontend engineer, 3D artist,
motion designer, and interactive experience developer.

PROJECT:
Orange.io

REFERENCE:
https://pear.no

OBJECTIVE:

Build a premium, cinematic, scroll-driven website inspired
by the smooth scrolling experience and visual storytelling
of Pear.no.

Develop an original interactive story involving:

1. A man and a woman watering an orange tree.
2. The tree growing and flourishing.
3. Oranges appearing and ripening.
4. A person plucking a ripe orange.
5. The orange floating toward the camera.
6. The orange rotating in cinematic slow motion.
7. The orange splitting into two halves.
8. The juicy interior of the orange being revealed.

The entire experience must be controlled by the user's
scroll position.

Scrolling down advances the story.

Scrolling upward reverses the story.

All major transitions must be seamless and continuous.

TECHNOLOGY:

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- React Three Drei

Use compatible, stable package versions.

DESIGN:

Create a high-end cinematic editorial website.

Visual characteristics:

- Photorealistic 3D objects
- Natural lighting
- Realistic materials
- Elegant camera movements
- Minimal typography
- Warm neutral backgrounds
- Strong visual hierarchy
- Smooth transitions
- Premium art direction

PRIMARY COLORS:

Orange: #FF7800
Cream: #F7F3EA
Dark: #181818
Leaf Green: #476B35

ANIMATION ARCHITECTURE:

Create one master scroll timeline.

Map the story to a normalized progress value
between 0 and 1.

Each scene should occupy a defined interval
within that timeline.

The timeline must control:

- Character movements
- Tree growth
- Leaf movement
- Water effects
- Fruit growth
- Fruit picking
- Camera position
- Camera rotation
- Orange rotation
- Orange splitting
- Lighting transitions
- Typography reveals

Avoid independent animations that conflict
with the master timeline.

Use deterministic animation states.

REQUIREMENTS:

- Smooth scrolling
- Reversible animations
- Responsive layouts
- Optimized 3D rendering
- Minimal visual clutter
- Accessible navigation
- Reduced-motion alternative
- No unnecessary scroll hijacking

Create a clean, maintainable project architecture.

Do not use Pear's logo, copy, source code,
images, or proprietary assets.

The website must have its own original identity.

FIRST TASK:

Initialize the project.

Set up the animation architecture.

Create reusable scene components.

Implement the master scroll timeline.

Verify the development and production builds.

Do not implement the detailed scenes yet.
```
