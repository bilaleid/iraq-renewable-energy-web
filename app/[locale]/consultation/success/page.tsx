import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";

export default function ConsultationSuccessPage() {
  const t = useTranslations("consultationResult");

  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-brand-ink-900">
          {t("successTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-brand-ink-600">
          {t("successDesc")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green-800 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-700"
        >
          {t("backHome")}
        </Link>
      </Container>
    </section>
  );
}
