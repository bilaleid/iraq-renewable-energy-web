"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";

const inputClasses =
  "w-full rounded-xl border border-brand-green-900/15 bg-white px-4 py-3 text-sm text-brand-ink-900 placeholder:text-brand-ink-600/50 focus:border-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-600/20";

const labelClasses = "mb-1.5 block text-sm font-semibold text-brand-ink-900";

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || t("errorGeneric"));
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("errorGeneric"));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-brand-green-900/10 bg-white p-9 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-bold text-brand-ink-900">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-brand-ink-600">{t("successDesc")}</p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-brand-green-900/10 bg-white p-7 shadow-sm sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelClasses}>
            {t("name")} *
          </label>
          <input id="c-name" name="name" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="c-company" className={labelClasses}>
            {t("company")}
          </label>
          <input id="c-company" name="company" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="c-email" className={labelClasses}>
            {t("email")} *
          </label>
          <input id="c-email" name="email" type="email" required dir="ltr" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="c-phone" className={labelClasses}>
            {t("phone")} *
          </label>
          <input id="c-phone" name="phone" type="tel" required dir="ltr" className={inputClasses} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-sector" className={labelClasses}>
            {t("sector")}
          </label>
          <select id="c-sector" name="sector" defaultValue="industrial" className={inputClasses}>
            <option value="industrial">{t("sectorIndustrial")}</option>
            <option value="commercial">{t("sectorCommercial")}</option>
            <option value="other">{t("sectorOther")}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className={labelClasses}>
            {t("message")} *
          </label>
          <textarea
            id="c-message"
            name="message"
            required
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={inputClasses}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green-800 px-6 py-4 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
