import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ConsultationForm } from "@/components/ConsultationForm";
import { CONSULTATION_FEE_USD } from "@/lib/config";

export default function ConsultationPage() {
  const t = useTranslations("consultation");

  const includes = [t("include1"), t("include2"), t("include3"), t("include4")];

  return (
    <section className="bg-gradient-to-b from-brand-green-50 to-brand-sand-50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-brand-green-900 p-8 text-white">
              <p className="text-sm font-semibold text-brand-green-50/70">
                {t("feeLabel")}
              </p>
              <p className="mt-2 text-4xl font-extrabold text-brand-gold-300">
                ${CONSULTATION_FEE_USD}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-green-50/70">
                {t("feeNote")}
              </p>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-brand-gold-300">
                {t("includesTitle")}
              </h3>
              <ul className="mt-4 space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-brand-green-50/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ConsultationForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
