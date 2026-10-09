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
  { id: "built", number: "—", label: "Built to stand out", tone: "light" },
  { id: "built-dark", number: "—", label: "Built to stand out", tone: "dark" },
  { id: "philosophy", number: "04", label: "Philosophy", tone: "dark" },
  { id: "process", number: "05", label: "Process", tone: "light" },
  { id: "contact", number: "06", label: "Contact", tone: "dark" },
];

/** Primary navigation — each entry points at an existing chapter. */
export const NAV_LINKS = [
  { id: "studio", number: "01", label: "The Idea" },
  { id: "capabilities", number: "02", label: "What We Do" },
  { id: "philosophy", number: "03", label: "How We Think" },
  { id: "contact", number: "04", label: "Let\u2019s Talk" },
] as const;

export const SERVICES = [
  {
    number: "01",
    title: "Software Engineering",
    description:
      "We architect and develop scalable digital products built for performance, reliability, and growth.",
    tags: ["Architecture", "Platforms", "Cloud & APIs"],
  },
  {
    number: "02",
    title: "Web Experiences",
    description:
      "We create visually compelling, fast, and accessible web experiences that leave a lasting impression.",
    tags: ["Next.js", "Motion & WebGL", "Accessibility"],
  },
  {
    number: "03",
    title: "Artificial Intelligence",
    description:
      "We transform complex challenges into intelligent solutions using modern AI and machine learning.",
    tags: ["LLM products", "Search & retrieval", "Automation"],
  },
  {
    number: "04",
    title: "Product Design",
    description:
      "We combine research, strategy, and visual design to create intuitive digital experiences.",
    tags: ["Research", "Interaction", "Design systems"],
  },
  {
    number: "05",
    title: "Digital Strategy",
    description:
      "We help ambitious businesses translate technology into meaningful competitive advantages.",
    tags: ["Roadmaps", "Technology advisory", "Growth"],
  },
] as const;

export const PROCESS = [
  {
    number: "01",
    title: "Discover",
    body: "Understand the problem, audience, and opportunity.",
  },
  {
    number: "02",
    title: "Design",
    body: "Translate ideas into intuitive, purposeful experiences.",
  },
  {
    number: "03",
    title: "Engineer",
    body: "Build robust, scalable, and maintainable solutions.",
  },
  {
    number: "04",
    title: "Evolve",
    body: "Measure, improve, and continuously innovate.",
  },
] as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/orange-studio" },
  { label: "Instagram", href: "https://www.instagram.com/orange.studio" },
  { label: "X", href: "https://x.com/orangestudio" },
  { label: "GitHub", href: "https://github.com/orange-studio" },
] as const;

export const OFFICES = ["Oslo", "Berlin", "Singapore"] as const;
