import type { LucideIcon } from "lucide-react";

export function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-brand-green-900/10 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-800 text-white transition-colors group-hover:bg-brand-gold-400 group-hover:text-brand-green-950">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-brand-ink-900">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-brand-ink-600">
        {description}
      </p>
    </div>
  );
}
