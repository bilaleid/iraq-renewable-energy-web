import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Container } from "./Container";

export function CTABand({
  title,
  subtitle,
  button,
  href = "/consultation",
}: {
  title: string;
  subtitle: string;
  button: string;
  href?: string;
}) {
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-brand-green-950 py-16 sm:py-20">
      <Container className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-br from-brand-green-800 to-brand-green-700 px-8 py-12 text-center sm:px-14 lg:flex-row lg:text-start">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-xl text-brand-green-50/80">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-gold-400 px-7 py-3.5 text-sm font-bold text-brand-green-950 shadow-lg transition-colors hover:bg-brand-gold-300"
        >
          {button}
          <Arrow className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
