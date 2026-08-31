import {
  BookOpen,
  Briefcase,
  Compass,
  Footprints,
  GraduationCap,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ProgramIcon, StatIcon } from "@/lib/content";

const programIcons: Record<ProgramIcon, LucideIcon> = {
  book: BookOpen,
  steps: Footprints,
  briefcase: Briefcase,
  compass: Compass,
  shield: ShieldCheck,
  community: HeartHandshake,
};

const statIcons: Record<StatIcon, LucideIcon> = {
  smile: Smile,
  users: Users,
  graduation: GraduationCap,
  globe: Globe,
};

export function programIcon(name: ProgramIcon): LucideIcon {
  return programIcons[name];
}

export function statIcon(name: StatIcon): LucideIcon {
  return statIcons[name];
}
