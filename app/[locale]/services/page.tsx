import { useTranslations } from "next-intl";
import { Search, PenTool, Truck, Settings } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { CTABand } from "@/components/CTABand";
import { services } from "@/lib/services";

export default function ServicesPage() {
  const t = useTranslations();

  const steps = [
    { icon: Search, title: t("servicesPage.process.step1Title"), desc: t("servicesPage.process.step1Desc") },
    { icon: PenTool, title: t("servicesPage.process.step2Title"), desc: t("servicesPage.process.step2Desc") },
    { icon: Truck, title: t("servicesPage.process.step3Title"), desc: t("servicesPage.process.step3Desc") },
    { icon: Settings, title: t("servicesPage.process.step4Title"), desc: t("servicesPage.process.step4Desc") },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-brand-green-50 to-brand-sand-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("servicesPage.eyebrow")}
            title={t("servicesPage.title")}
            subtitle={t("servicesPage.subtitle")}
          />
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.key}
                icon={service.icon}
                title={t(`servicesPage.list.${service.key}.title`)}
                description={t(`servicesPage.list.${service.key}.description`)}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-green-50/60 py-20 sm:py-24">
        <Container>
          <SectionHeading
            title={t("servicesPage.processTitle")}
            subtitle={t("servicesPage.processSubtitle")}
          />
          <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-800 text-white">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-4 block text-sm font-bold text-brand-gold-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-bold text-brand-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-600">
                  {step.desc}
                </p>
              </div>
            ))}
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
