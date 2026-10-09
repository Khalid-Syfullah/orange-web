# PROMPT 10 — Seamless Scrolling, Optimization and Final Integration

Run this after all scenes have been implemented.

```text
Act as a senior frontend performance engineer,
creative technologist, and motion design director.

PROJECT:
Orange.io

OBJECTIVE:

Integrate and refine all eight scenes into one
seamless cinematic scroll-driven experience.

REFERENCE:
https://pear.no

PRIMARY REQUIREMENT:

The entire story must feel like one continuous
cinematic sequence.

There must be no abrupt scene changes.

MASTER TIMELINE:

0.00–0.10:
Opening scene.

0.10–0.25:
Man and woman watering the tree.

0.25–0.45:
Tree growth.

0.45–0.58:
Orange growth and ripening.

0.58–0.70:
Orange being plucked.

0.70–0.82:
Orange floating and rotating.

0.82–0.95:
Orange splitting into two halves.

0.95–1.00:
Orange.io brand reveal.

TECHNICAL REQUIREMENTS:

1. Use one master GSAP ScrollTrigger timeline.

2. Implement scroll scrubbing.

3. Use a suitable pinning strategy.

4. Synchronize Lenis with GSAP.

5. Ensure every animation is reversible.

6. Use deterministic animation states.

7. Prevent sudden camera jumps.

8. Avoid inconsistent object positions.

9. Synchronize text transitions with scene progress.

10. Ensure the experience works on mobile.

SCROLL CONFIGURATION:

Use a long cinematic scroll distance.

For example:

end: "+=6000"

Adjust dynamically based on viewport
and tested user experience.

Use:

scrub: 1

Avoid excessive artificial scroll smoothing.

Do not lock or hijack normal scrolling.

CAMERA:

Create continuous camera transitions.

Use smooth interpolated movement.

Avoid clipping through objects.

Maintain consistent object scale.

PERFORMANCE:

Optimize:

- Mesh geometry
- Texture resolution
- Draw calls
- Shadow quality
- Particle systems
- Lighting calculations
- React rendering
- Animation updates

Use compressed textures where appropriate.

Avoid unnecessary React state changes
during every scroll frame.

Prefer direct animation of refs
and Three.js object properties.

Implement adaptive quality for lower-end devices.

RESPONSIVENESS:

Desktop:
Full cinematic 3D experience.

Tablet:
Adjusted camera framing and object positioning.

Mobile:
Simplified effects where necessary.

Maintain the complete narrative.

ACCESSIBILITY:

Support prefers-reduced-motion.

Provide a nonanimated representation
of the complete story.

Ensure all essential content remains accessible.

Allow keyboard navigation.

VISUAL CONSISTENCY:

All eight scenes should share:

- Consistent lighting direction
- Compatible materials
- Coherent color grading
- Consistent character design
- Consistent tree appearance
- Identical orange geometry throughout transitions
- Consistent camera language

QUALITY ASSURANCE:

Test:

- Slow scrolling
- Fast scrolling
- Reverse scrolling
- Trackpad scrolling
- Mouse wheel scrolling
- Touch scrolling
- Mobile orientation changes
- Browser resizing
- Reduced-motion preferences

Check for:

- Animation jitter
- Scroll jumps
- Object popping
- Camera discontinuities
- Texture flickering
- Incorrect geometry intersections
- Layout shifts
- Memory leaks

Ensure the production build succeeds.

FINAL GOAL:

Produce a highly polished, cinematic,
premium-quality Orange.io scrolling experience
comparable in technical refinement
to leading interactive agency websites.

The result must remain creatively original,
using custom visuals and original code.
```
