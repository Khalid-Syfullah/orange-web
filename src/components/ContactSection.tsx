"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/animations/MagneticButton";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { BUDGETS, LIMITS, validateContact, type ContactField, type FieldErrors } from "@/lib/contact";
import { OFFICES, SITE } from "@/lib/constants";

type Status = "idle" | "submitting" | "success" | "error";
type Values = Record<ContactField, string>;

const EMPTY: Values = { name: "", email: "", company: "", budget: "", message: "" };
const INPUT =
  "field-input w-full appearance-none rounded-none border-0 border-b border-paper/30 bg-transparent py-3 text-[clamp(18px,1.6vw,24px)] text-paper placeholder:text-paper/40 focus:outline-none";

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + animated underline + linked error message. */
function Field({ id, label, optional, error, children, className = "" }: FieldProps) {
  return (
    <div className={`group relative pb-3 ${className}`}>
      <label htmlFor={id} className="label flex items-baseline justify-between text-paper/70 transition-colors duration-500 group-focus-within:text-orange">
        <span>{label}</span>
        {optional && <span className="text-paper/50 normal-case tracking-normal">Optional</span>}
      </label>
      <div className="relative">
        {children}
        {/* Focus underline sweeps in from the left */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-expo group-focus-within:scale-x-100 ${
            error ? "scale-x-100 bg-[#ff8a7a]" : "bg-orange"
          }`}
        />
      </div>
      <p id={`${id}-error`} className="mt-2 min-h-5 text-sm text-[#ff8a7a]">
        {error}
      </p>
    </div>
  );
}

export default function ContactSection() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Spam trap: when the form first became interactive.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const id = (f: string) => `${uid}-${f}`;
  const describe = (f: ContactField) => (errors[f] ? `${id(f)}-error` : undefined);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as ContactField;
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    // Once a field has shown an error, re-check it as the user types.
    if (errors[field]) {
      const check = validateContact(next);
      setErrors((prev) => ({ ...prev, [field]: check.ok ? undefined : check.errors[field] }));
    }
  };

  const focusFirstInvalid = (errs: FieldErrors) => {
    const first = (["name", "email", "company", "budget", "message"] as const).find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError("");

    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("error");
      setFormError(`Please check ${Object.keys(check.errors).length === 1 ? "one field" : "a few fields"} and try again.`);
      focusFirstInvalid(check.errors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.data, website: honeypot, startedAt: startedAt.current }),
      });
      const result: { ok?: boolean; error?: string; errors?: FieldErrors } = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        setStatus("success");
        setValues(EMPTY);
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      if (result.errors) {
        setErrors(result.errors);
        setFormError("Please check the highlighted fields.");
        focusFirstInvalid(result.errors);
      } else {
        setFormError(result.error ?? "Something went wrong. Please try again.");
      }
      setStatus("error");
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setFormError("");
    startedAt.current = Date.now();
  };

  const submitting = status === "submitting";

  return (
    <section
      id="contact"
      data-tone="dark"
      aria-labelledby="contact-title"
      className="relative overflow-x-clip bg-ink pb-24 pt-28 text-paper md:pb-40 md:pt-44"
    >
      <div className="container-x">
        {/* Chapter heading */}
        <div className="h-px bg-paper/30" />
        <div className="label flex items-center justify-between py-4">
          <p>Chapter 04</p>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 bg-orange" />
            Let’s Talk
          </p>
        </div>

        <TextReveal
          as="h2"
          id="contact-title"
          text={"Have something\nin mind?"}
          highlight={["mind"]}
          highlightClassName="text-orange"
          lineClasses={["", "md:ml-[12vw]"]}
          className="mt-10 font-display text-[clamp(38px,10.6vw,200px)] font-bold leading-[0.9] tracking-[-0.055em] md:mt-16"
        />

        <div className="mt-16 grid grid-cols-12 items-end gap-x-4 gap-y-10 md:mt-28 md:gap-x-6">
          <TextReveal
            as="p"
            text={"Let’s make it\nhappen."}
            highlight={["happen"]}
            highlightClassName="text-orange"
            className="col-span-12 font-display text-[clamp(32px,5.4vw,96px)] font-semibold leading-[0.96] tracking-[-0.045em] md:col-span-6 lg:col-span-7"
          />
          <ScrollReveal className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            <p className="lede max-w-[34ch] text-paper/80">
              Whether you’re building something new or reimagining what already exists, we’d love to hear your idea.
            </p>
            <div className="mt-8">
              <MagneticButton
                href="#contact-form"
                variant="orange"
                onClick={() => setTimeout(() => formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus({ preventScroll: true }), 900)}
              >
                Start a conversation
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>

        {/* Form */}
        <div id="contact-form" className="mt-24 grid grid-cols-12 gap-x-4 gap-y-14 border-t border-paper/25 pt-12 md:mt-40 md:gap-x-6 md:pt-16">
          <div className="col-span-12 space-y-10 md:col-span-4">
            <div>
              <p className="label mb-3 text-paper/60">Prefer email?</p>
              <a
                href={`mailto:${SITE.email}`}
                className="group relative inline-flex min-h-11 items-center break-all font-display text-[clamp(20px,2vw,30px)] font-semibold tracking-tight"
              >
                {SITE.email}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-orange transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            </div>
            <div>
              <p className="label mb-3 text-paper/60">Response time</p>
              <p className="lede text-paper/80">Within two working days.</p>
            </div>
            <div>
              <p className="label mb-3 text-paper/60">Studios</p>
              <p className="lede text-paper/80">{OFFICES.join(" · ")}</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6">
            {status === "success" ? (
              <div ref={successRef} tabIndex={-1} role="status" className="scroll-mt-32 outline-none">
                <span className="grid size-14 place-items-center bg-orange text-ink">
                  <Check aria-hidden="true" className="size-7" />
                </span>
                <h3 className="mt-8 font-display text-[clamp(32px,4.4vw,72px)] font-bold leading-[0.98] tracking-[-0.04em]">
                  Thank you. <span className="text-orange">We’ll be in touch.</span>
                </h3>
                <p className="lede mt-5 max-w-[38ch] text-paper/80">
                  Your inquiry is with us. Expect a personal reply within two working days.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="label mt-8 min-h-11 border-b border-paper/60 pb-0.5 transition-colors duration-300 hover:border-orange hover:text-orange"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-x-8 sm:grid-cols-2">
                <Field id={id("name")} label="Full name" error={errors.name}>
                  <input
                    id={id("name")}
                    name="name"
                    value={values.name}
                    onChange={onChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={describe("name")}
                    autoComplete="name"
                    maxLength={LIMITS.name.max}
                    className={INPUT}
                  />
                </Field>
                <Field id={id("email")} label="Email address" error={errors.email}>
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={onChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={describe("email")}
                    autoComplete="email"
                    maxLength={LIMITS.email.max}
                    className={INPUT}
                  />
                </Field>
                <Field id={id("company")} label="Company" optional error={errors.company}>
                  <input
                    id={id("company")}
                    name="company"
                    value={values.company}
                    onChange={onChange}
                    aria-invalid={!!errors.company}
                    aria-describedby={describe("company")}
                    autoComplete="organization"
                    maxLength={LIMITS.company.max}
                    className={INPUT}
                  />
                </Field>
                <Field id={id("budget")} label="Estimated budget" optional error={errors.budget}>
                  <select
                    id={id("budget")}
                    name="budget"
                    value={values.budget}
                    onChange={onChange}
                    aria-invalid={!!errors.budget}
                    aria-describedby={describe("budget")}
                    className={`${INPUT} cursor-pointer pr-8 [color-scheme:dark] ${values.budget ? "" : "text-paper/40"}`}
                  >
                    <option value="">Select a range</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 size-5 -translate-y-1/2 text-paper/60" />
                </Field>
                <Field id={id("message")} label="Project description" error={errors.message} className="sm:col-span-2">
                  <textarea
                    data-lenis-prevent
                    id={id("message")}
                    name="message"
                    value={values.message}
                    onChange={onChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={describe("message")}
                    rows={4}
                    maxLength={LIMITS.message.max}
                    className={`${INPUT} resize-none`}
                  />
                </Field>

                {/* Honeypot: invisible to people, tempting to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-5 sm:col-span-2">
                  <MagneticButton type="submit" variant="orange" disabled={submitting} loading={submitting}>
                    {submitting ? "Sending…" : "Send inquiry"}
                  </MagneticButton>
                  <p role={status === "error" ? "alert" : "status"} className="min-h-6 text-base text-[#ff8a7a]">
                    {status === "error" ? formError : submitting ? <span className="text-paper/70">Sending your message…</span> : ""}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
