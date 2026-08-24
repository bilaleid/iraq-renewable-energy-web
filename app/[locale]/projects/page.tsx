import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { CTABand } from "@/components/CTABand";

export default function ProjectsPage() {
  const t = useTranslations();

  return (
    <>
      <section className="bg-gradient-to-b from-brand-green-50 to-brand-sand-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("projectsPage.eyebrow")}
            title={t("projectsPage.title")}
            subtitle={t("projectsPage.subtitle")}
          />
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <ProjectsGrid />
        </Container>
      </section>

      <CTABand
        title={t("projectsPage.cta.title")}
        subtitle={t("projectsPage.cta.subtitle")}
        button={t("projectsPage.cta.button")}
        href="/contact"
      />
    </>
  );
}
