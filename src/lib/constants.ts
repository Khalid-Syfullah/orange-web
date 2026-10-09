export const SITE = {
  name: "Orange",
  tagline: "We build what comes next.",
  secondary: "Digital experiences. Engineered differently.",
  description:
    "Orange is an independent digital studio. We design and engineer the products, platforms and brand experiences that ambitious companies are measured by.",
  email: "hello@orange.studio",
  year: new Date().getFullYear(),
} as const;

export type Tone = "light" | "dark" | "orange";

export interface Chapter {
  id: string;
  number: string;
  label: string;
  tone: Tone;
}

export const CHAPTERS: readonly Chapter[] = [
  { id: "top", number: "01", label: "Index", tone: "light" },
  { id: "studio", number: "02", label: "Studio", tone: "light" },
  { id: "capabilities", number: "03", label: "Capabilities", tone: "light" },
  { id: "philosophy", number: "04", label: "Philosophy", tone: "dark" },
  { id: "process", number: "05", label: "Process", tone: "light" },
  { id: "contact", number: "06", label: "Contact", tone: "orange" },
];

export const STATS = [
  { value: 11, suffix: "", label: "Years of practice" },
  { value: 160, suffix: "+", label: "Products shipped" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 32, suffix: "", label: "Senior makers, no juniors" },
] as const;

export const SERVICES = [
  {
    number: "01",
    title: "Product Strategy",
    description:
      "Positioning, roadmaps and technical direction — decided before a single pixel is drawn.",
    tags: ["Discovery", "Roadmapping", "Prototyping"],
  },
  {
    number: "02",
    title: "Interface Design",
    description:
      "Design systems, motion and interaction with an editorial point of view and an engineer's rigour.",
    tags: ["UX", "Motion", "Design systems"],
  },
  {
    number: "03",
    title: "Web Engineering",
    description:
      "Fast, accessible, edge-native platforms built on modern foundations and made to scale quietly.",
    tags: ["Next.js", "WebGL", "Headless"],
  },
  {
    number: "04",
    title: "Brand Systems",
    description:
      "Identity, language and tooling that hold together across every screen, surface and decade.",
    tags: ["Identity", "Voice", "Guidelines"],
  },
  {
    number: "05",
    title: "Applied Intelligence",
    description:
      "Practical machine learning woven into products — assistive, measurable and never decorative.",
    tags: ["LLM products", "Search", "Automation"],
  },
] as const;

export const PRINCIPLES = [
  {
    number: "01",
    title: "Restraint",
    body: "Every element earns its place. What we remove matters as much as what we ship.",
  },
  {
    number: "02",
    title: "Precision",
    body: "Craft lives in the details nobody can name — a margin, an easing curve, ten milliseconds of latency.",
  },
  {
    number: "03",
    title: "Velocity",
    body: "Small senior teams, short loops and working software every single week.",
  },
  {
    number: "04",
    title: "Curiosity",
    body: "We prototype the strange idea first. Taste is trained by experiments, not by templates.",
  },
] as const;

export const MARQUEE = ["Restraint", "Precision", "Velocity", "Curiosity", "Craft"] as const;

export const PROCESS = [
  {
    number: "01",
    title: "Listen",
    time: "Weeks 1–2",
    body: "We immerse ourselves in your market, your users and your constraints. You get a sharp problem statement, not a slide deck.",
    outputs: ["Research synthesis", "Opportunity map", "Success metrics"],
  },
  {
    number: "02",
    title: "Define",
    time: "Weeks 3–4",
    body: "Direction becomes tangible: architecture, visual language and an interactive prototype you can put in front of real people.",
    outputs: ["Concept & prototype", "Technical architecture", "Delivery plan"],
  },
  {
    number: "03",
    title: "Build",
    time: "Weeks 5–12",
    body: "Design and engineering work as one team. Production code ships weekly, behind review, with performance budgets enforced.",
    outputs: ["Weekly releases", "Design system", "Production platform"],
  },
  {
    number: "04",
    title: "Evolve",
    time: "Ongoing",
    body: "Launch is the first data point. We measure, refine and extend — so the work keeps compounding long after day one.",
    outputs: ["Analytics & testing", "Roadmap support", "Team enablement"],
  },
] as const;

export const OFFICES = ["Oslo", "Berlin", "Singapore"] as const;
