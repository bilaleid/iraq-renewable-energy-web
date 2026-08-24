import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoWordmark } from "./Logo";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations();

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const services = [
    t("servicesPage.list.s1.title"),
    t("servicesPage.list.s2.title"),
    t("servicesPage.list.s3.title"),
    t("servicesPage.list.s5.title"),
  ];

  return (
    <footer className="border-t border-brand-green-900/10 bg-brand-green-950 text-brand-green-50">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoWordmark
            siteName={t("meta.siteNameShort")}
            className="[&_span]:text-white"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-green-50/70">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold-300">
            {t("footer.quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-green-50/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold-300">
            {t("footer.servicesTitle")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service} className="text-sm text-brand-green-50/80">
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-gold-300">
            {t("footer.contactTitle")}
          </h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-2.5 text-sm text-brand-green-50/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-300" />
              {t("contactPage.address")}
            </li>
            <li className="flex items-start gap-2.5 text-sm text-brand-green-50/80">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-300" />
              <span dir="ltr">{t("contactPage.phone")}</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-brand-green-50/80">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-300" />
              {t("contactPage.email")}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-brand-green-50/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t("meta.siteName")} — {t("footer.rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
