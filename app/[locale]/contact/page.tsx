import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contactPage");

  const info = [
    { icon: MapPin, label: t("address") },
    { icon: Phone, label: t("phone"), dir: "ltr" as const },
    { icon: Mail, label: t("email") },
    { icon: Clock, label: t("hours") },
  ];

  return (
    <section className="bg-gradient-to-b from-brand-green-50 to-brand-sand-50 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-brand-green-900 p-8 text-white">
              <h3 className="text-lg font-bold">{t("infoTitle")}</h3>
              <ul className="mt-6 space-y-5">
                {info.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold-300">
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <span dir={item.dir} className="mt-1.5 text-sm text-brand-green-50/90">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
