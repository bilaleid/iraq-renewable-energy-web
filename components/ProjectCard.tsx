import { Sun, MapPin } from "lucide-react";
import type { ProjectData } from "@/lib/projects";

export function ProjectCard({
  project,
  title,
  location,
  description,
  sectorLabel,
  capacityLabel,
}: {
  project: ProjectData;
  title: string;
  location: string;
  description: string;
  sectorLabel: string;
  capacityLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-green-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${project.gradient}`}
      >
        <Sun className="h-16 w-16 text-white/25" strokeWidth={1.25} />
        <span className="absolute end-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-green-900">
          {sectorLabel}
        </span>
        <span className="absolute bottom-3 start-3 rounded-full bg-brand-green-950/70 px-3 py-1 text-xs font-semibold text-white">
          {capacityLabel}: {project.capacity}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-brand-ink-900">{title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-green-700">
          <MapPin className="h-4 w-4" />
          {location}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink-600">
          {description}
        </p>
      </div>
    </div>
  );
}
