import {
  Factory,
  Building2,
  Wrench,
  LineChart,
  Battery,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

export type ServiceData = {
  key: string;
  icon: LucideIcon;
};

export const services: ServiceData[] = [
  { key: "s1", icon: Factory },
  { key: "s2", icon: Building2 },
  { key: "s3", icon: ClipboardCheck },
  { key: "s4", icon: Wrench },
  { key: "s5", icon: LineChart },
  { key: "s6", icon: Battery },
];
