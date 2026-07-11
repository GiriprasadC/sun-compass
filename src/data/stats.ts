import { Award, Users, GraduationCap, BookOpen, type LucideIcon } from "lucide-react";

export type Stat = { label: string; value: number; suffix: string; icon: LucideIcon };

export const stats: Stat[] = [
  { label: "Years Experience", value: 35, suffix: "+", icon: Award },
  { label: "Research Scholars Guided", value: 85, suffix: "+", icon: Users },
  { label: "Ph.D Candidates", value: 10, suffix: "+", icon: GraduationCap },
  { label: "Students Trained", value: 1000, suffix: "+", icon: BookOpen },
];
