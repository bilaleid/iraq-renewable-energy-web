import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Factory,
  Building2,
  ShieldCheck,
  Wrench,
  LineChart,
  Sun,
} from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { CTABand } from "@/components/CTABand";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const stats = [
    { value: t("hero.stat1Value"), label: t("hero.stat1Label") },
    { value: t("hero.stat2Value"), label: t("hero.stat2Label") },
    { value: t("hero.stat3Value"), label: t("hero.stat3Label") },
    { value: t("hero.stat4Value"), label: t("hero.stat4Label") },
  ];

  const whyUs = [
    { icon: ShieldCheck, title: t("whyUs.item1Title"), desc: t("whyUs.item1Desc") },
    { icon: Sun, title: t("whyUs.item2Title"), desc: t("whyUs.item2Desc") },
    { icon: Wrench, title: t("whyUs.item3Title"), desc: t("whyUs.item3Desc") },
    { icon: LineChart, title: t("whyUs.item4Title"), desc: t("whyUs.item4Desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green-50 to-brand-sand-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-brand-gold-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -start-32 top-40 h-80 w-80 rounded-full bg-brand-green-500/20 blur-3xl"
        />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-brand-green-100 px-4 py-1.5 text-sm font-semibold text-brand-green-700">
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-brand-ink-900 sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink-600">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/consultation"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-green-800 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-green-800/20 transition-colors hover:bg-brand-green-700 sm:w-auto"
              >
                {t("hero.ctaPrimary")}
                <Arrow className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-green-800/20 bg-white px-7 py-3.5 text-sm font-bold text-brand-ink-900 transition-colors hover:bg-brand-green-100 sm:w-auto"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-green-800 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-brand-ink-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sectors */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={t("sectorsSection.title")}
            subtitle={t("sectorsSection.subtitle")}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-brand-green-900 p-9 text-white">
              <Factory className="h-10 w-10 text-brand-gold-300" />
              <h3 className="mt-6 text-xl font-bold">
                {t("sectorsSection.industrial.title")}
              </h3>
              <p className="mt-3 leading-relaxed text-brand-green-50/80">
                {t("sectorsSection.industrial.description")}
              </p>
            </div>
            <div className="rounded-3xl border border-brand-green-900/10 bg-white p-9">
              <Building2 className="h-10 w-10 text-brand-green-700" />
              <h3 className="mt-6 text-xl font-bold text-brand-ink-900">
                {t("sectorsSection.commercial.title")}
              </h3>
              <p className="mt-3 leading-relaxed text-brand-ink-600">
                {t("sectorsSection.commercial.description")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services preview */}
      <section className="bg-brand-green-50/60 py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={t("servicesSection.title")}
            subtitle={t("servicesSection.subtitle")}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.key}
                icon={service.icon}
                title={t(`servicesPage.list.${service.key}.title`)}
                description={t(`servicesPage.list.${service.key}.description`)}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green-800/20 bg-white px-6 py-3 text-sm font-bold text-brand-ink-900 transition-colors hover:bg-brand-green-100"
            >
              {t("servicesSection.viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading title={t("whyUs.title")} />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold-100 text-brand-gold-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-bold text-brand-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Projects preview */}
      <section className="bg-brand-green-50/60 py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={t("projectsSection.title")}
            subtitle={t("projectsSection.subtitle")}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.key}
                project={project}
                title={t(`projectsSection.items.${project.key}.title`)}
                location={t(`projectsSection.items.${project.key}.location`)}
                description={t(`projectsSection.items.${project.key}.description`)}
                sectorLabel={t(`projectsSection.${project.sector}`)}
                capacityLabel={t("projectsSection.capacity")}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green-800/20 bg-white px-6 py-3 text-sm font-bold text-brand-ink-900 transition-colors hover:bg-brand-green-100"
            >
              {t("projectsSection.viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <CTABand
        title={t("servicesPage.cta.title")}
        subtitle={t("servicesPage.cta.subtitle")}
        button={t("servicesPage.cta.button")}
      />
    </>
  );
}
