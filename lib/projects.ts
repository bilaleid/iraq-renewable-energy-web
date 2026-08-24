export type Sector = "industrial" | "commercial";

export type ProjectData = {
  key: string;
  sector: Sector;
  capacity: string;
  year: string;
  gradient: string;
};

export const projects: ProjectData[] = [
  {
    key: "p1",
    sector: "industrial",
    capacity: "5.0 MW",
    year: "2023",
    gradient: "from-brand-green-800 to-brand-green-600",
  },
  {
    key: "p2",
    sector: "commercial",
    capacity: "800 kW",
    year: "2024",
    gradient: "from-brand-gold-500 to-brand-gold-300",
  },
  {
    key: "p3",
    sector: "industrial",
    capacity: "2.0 MW",
    year: "2022",
    gradient: "from-brand-green-700 to-brand-green-500",
  },
  {
    key: "p4",
    sector: "commercial",
    capacity: "500 kW",
    year: "2024",
    gradient: "from-brand-gold-600 to-brand-gold-400",
  },
  {
    key: "p5",
    sector: "industrial",
    capacity: "1.2 MW",
    year: "2023",
    gradient: "from-brand-green-900 to-brand-green-700",
  },
  {
    key: "p6",
    sector: "industrial",
    capacity: "3.0 MW",
    year: "2025",
    gradient: "from-brand-green-800 to-brand-gold-400",
  },
];
