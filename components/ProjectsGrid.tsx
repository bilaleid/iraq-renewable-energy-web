"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProjectCard } from "./ProjectCard";
import { projects, type Sector } from "@/lib/projects";

export function ProjectsGrid() {
  const t = useTranslations();
  const [filter, setFilter] = useState<Sector | "all">("all");

  const filters: { key: Sector | "all"; label: string }[] = [
    { key: "all", label: t("projectsPage.filterAll") },
    { key: "industrial", label: t("projectsPage.filterIndustrial") },
    { key: "commercial", label: t("projectsPage.filterCommercial") },
  ];

  const visible = projects.filter((p) => filter === "all" || p.sector === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              filter === f.key
                ? "bg-brand-green-800 text-white"
                : "bg-white text-brand-ink-900 hover:bg-brand-green-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
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

      <p className="mt-10 text-center text-xs text-brand-ink-600/70">
        {t("projectsSection.note")}
      </p>
    </div>
  );
}
