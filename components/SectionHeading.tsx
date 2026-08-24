export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`mx-auto max-w-2xl ${
        align === "center" ? "text-center" : "text-start"
      }`}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-green-100 px-4 py-1.5 text-sm font-semibold text-brand-green-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-ink-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-brand-ink-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
