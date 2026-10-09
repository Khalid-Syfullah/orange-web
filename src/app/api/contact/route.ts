import { NextResponse } from "next/server";
import { validateContact, type ContactData } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Contact endpoint.
 *
 * Required environment variables (server only — never exposed to the browser):
 *   RESEND_API_KEY       API key for the Resend email API
 *   CONTACT_TO_EMAIL     where enquiries are delivered
 *   CONTACT_FROM_EMAIL   verified sender, e.g. "Orange <enquiries@your-domain.com>"
 *
 * In development, with those unset, submissions are logged to the server console instead.
 */

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 1_500; // faster than any human; bots post instantly
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Per-instance sliding window. On serverless / multi-instance hosts, back this with a shared
// store (Redis, Upstash, KV) — the logic stays the same.
const hits = new Map<string, number[]>();

function rateLimit(ip: string): number {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  return 0;
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function json(body: Record<string, unknown>, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function deliver(data: ContactData): Promise<"sent" | "logged" | "unconfigured"> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] email not configured — logging submission:\n", data);
      return "logged";
    }
    return "unconfigured";
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company || "—"],
    ["Budget", data.budget || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}\n`;
  const html = `<table cellpadding="6" style="font:15px/1.5 system-ui,sans-serif">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: data.email, subject: `New enquiry — ${data.name}`, text, html }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
  return "sent";
}

export async function POST(req: Request) {
  // 1. Origin + content checks
  if (!sameOrigin(req)) return json({ ok: false, error: "Forbidden." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported request." }, 415);
  }

  // 2. Rate limit
  const retryAfter = rateLimit(clientIp(req));
  if (retryAfter) {
    return json(
      { ok: false, error: "You’ve sent a few messages already. Please try again in a little while." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  // 3. Parse with a hard size cap
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "Message too large." }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("bad shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // 4. Spam traps: honeypot is answered with a convincing success so bots learn nothing
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });
  const filledIn = Date.now() - Number(body.startedAt);
  if (!Number.isFinite(filledIn) || filledIn < MIN_FILL_MS || filledIn > MAX_FILL_MS) {
    return json({ ok: false, error: "That was a little quick — please take a moment and try again." }, 400);
  }

  // 5. Validate + sanitise
  const result = validateContact(body);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 400);
  if ((result.data.message.match(/https?:\/\//gi) ?? []).length > 3) {
    return json({ ok: false, errors: { message: "Please include no more than three links." } }, 400);
  }

  // 6. Deliver
  try {
    const outcome = await deliver(result.data);
    if (outcome === "unconfigured") {
      console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are not set.");
      return json({ ok: false, error: "Our contact form is temporarily unavailable." }, 503);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return json({ ok: false, error: "We couldn’t send your message just now." }, 502);
  }
}

// Anything but POST is not allowed.
export function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405, { Allow: "POST" });
}
