/** Shared by the contact form (instant feedback) and the API route (authoritative check). */

export const BUDGETS = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Not sure yet",
] as const;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 100 },
  message: { min: 10, max: 3000 },
} as const;

export type ContactField = "name" | "email" | "company" | "budget" | "message";
export type FieldErrors = Partial<Record<ContactField, string>>;

export interface ContactData {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

// Control characters, zero-width characters and bidi overrides have no place in a name or message.
const INVISIBLE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

/** Single-line fields: no line breaks (prevents header injection), collapsed whitespace. */
export function sanitizeLine(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").replace(INVISIBLE, "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Multi-line text: keeps paragraphs, drops invisible characters, caps blank lines. */
export function sanitizeText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function validateContact(
  raw: Record<string, unknown>,
): { ok: true; data: ContactData } | { ok: false; errors: FieldErrors } {
  const data: ContactData = {
    name: sanitizeLine(raw.name, LIMITS.name.max),
    email: sanitizeLine(raw.email, LIMITS.email.max).toLowerCase(),
    company: sanitizeLine(raw.company, LIMITS.company.max),
    budget: sanitizeLine(raw.budget, 40),
    message: sanitizeText(raw.message, LIMITS.message.max),
  };
  const errors: FieldErrors = {};

  if (!data.name) errors.name = "Please tell us your name.";
  else if (data.name.length < LIMITS.name.min) errors.name = "Your name looks a little short.";

  if (!data.email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(data.email)) errors.email = "That email address doesn’t look right.";

  if (data.budget && !(BUDGETS as readonly string[]).includes(data.budget)) errors.budget = "Please choose one of the options.";

  if (!data.message) errors.message = "Tell us a little about your project.";
  else if (data.message.length < LIMITS.message.min) errors.message = "A few more words would help us understand.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
