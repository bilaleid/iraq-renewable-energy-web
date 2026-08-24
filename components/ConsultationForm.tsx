"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Lock } from "lucide-react";

const inputClasses =
  "w-full rounded-xl border border-brand-green-900/15 bg-white px-4 py-3 text-sm text-brand-ink-900 placeholder:text-brand-ink-600/50 focus:border-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-600/20";

const labelClasses = "mb-1.5 block text-sm font-semibold text-brand-ink-900";

export function ConsultationForm() {
  const t = useTranslations("consultation.form");
  const tc = useTranslations("contactPage.form");
  const locale = useLocale();

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [projectType, setProjectType] = useState("industrial");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      locale,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      projectType,
      siteLocation: String(data.get("siteLocation") ?? ""),
      monthlyBill: String(data.get("monthlyBill") ?? ""),
      preferredDate: String(data.get("preferredDate") ?? ""),
      notes: String(data.get("notes") ?? ""),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.siteLocation) {
      setError(t("errorRequired"));
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(result.error || t("errorGeneric"));
      }

      window.location.href = result.url;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("errorGeneric"));
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-brand-green-900/10 bg-white p-7 shadow-sm sm:p-9"
    >
      <h3 className="text-xl font-bold text-brand-ink-900">{t("title")}</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            {tc("name")} *
          </label>
          <input id="name" name="name" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="company" className={labelClasses}>
            {tc("company")}
          </label>
          <input id="company" name="company" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            {tc("email")} *
          </label>
          <input id="email" name="email" type="email" required dir="ltr" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>
            {tc("phone")} *
          </label>
          <input id="phone" name="phone" type="tel" required dir="ltr" className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>{t("projectType")} *</label>
          <div className="flex gap-2">
            {(["industrial", "commercial"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setProjectType(type)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  projectType === type
                    ? "border-brand-green-800 bg-brand-green-800 text-white"
                    : "border-brand-green-900/15 bg-white text-brand-ink-900 hover:bg-brand-green-100"
                }`}
              >
                {t(`projectType${type === "industrial" ? "Industrial" : "Commercial"}`)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="siteLocation" className={labelClasses}>
            {t("siteLocation")} *
          </label>
          <input id="siteLocation" name="siteLocation" required className={inputClasses} />
        </div>

        <div>
          <label htmlFor="monthlyBill" className={labelClasses}>
            {t("monthlyBill")}
          </label>
          <input id="monthlyBill" name="monthlyBill" type="number" min="0" dir="ltr" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="preferredDate" className={labelClasses}>
            {t("preferredDate")}
          </label>
          <input id="preferredDate" name="preferredDate" type="date" dir="ltr" className={inputClasses} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClasses}>
            {t("notes")}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder={t("notesPlaceholder")}
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
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-400 px-6 py-4 text-sm font-bold text-brand-green-950 shadow-lg transition-colors hover:bg-brand-gold-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? t("processing") : t("payButton")}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-brand-ink-600">
        <Lock className="h-3.5 w-3.5" />
        {t("secureNote")}
      </p>
    </form>
  );
}
