"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, Globe } from "lucide-react";
import { LogoWordmark } from "./Logo";
import { Container } from "./Container";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-green-900/10 bg-brand-sand-50/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" onClick={() => setOpen(false)}>
          <LogoWordmark siteName={t("meta.siteNameShort")} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-green-800 text-white"
                    : "text-brand-ink-900 hover:bg-brand-green-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={pathname}
            locale={otherLocale}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-green-800/20 px-3.5 py-2 text-sm font-medium text-brand-ink-900 transition-colors hover:bg-brand-green-100"
          >
            <Globe className="h-4 w-4" />
            {otherLocale === "ar" ? "العربية" : "English"}
          </Link>
          <Link
            href="/consultation"
            className="rounded-full bg-brand-gold-400 px-4.5 py-2 text-sm font-semibold text-brand-green-950 shadow-sm transition-colors hover:bg-brand-gold-300"
          >
            {t("nav.cta")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full p-2 text-brand-ink-900 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-brand-green-900/10 bg-brand-sand-50 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-brand-ink-900 hover:bg-brand-green-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-base font-medium text-brand-ink-900 hover:bg-brand-green-100"
            >
              <Globe className="h-4 w-4" />
              {otherLocale === "ar" ? "العربية" : "English"}
            </Link>
            <Link
              href="/consultation"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-gold-400 px-4 py-3 text-center text-base font-semibold text-brand-green-950"
            >
              {t("nav.cta")}
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
