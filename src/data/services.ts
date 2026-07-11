import { GraduationCap, BookOpenCheck, BrainCircuit, Landmark, type LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  items: string[];
  methodology?: string[];
  duration?: string;
  venue?: string;
  timing?: string;
};

export const services: Service[] = [
  {
    id: "teachers-training",
    icon: GraduationCap,
    title: "Teachers Training Programme",
    summary:
      "Capacity-building workshops for educators — covering pedagogy, life skills, leadership and classroom management.",
    items: [
      "Counselling for Student Development",
      "Soft Skill Training",
      "Employability Skills",
      "Leadership and Motivation",
      "Capacity Building",
      "Adolescent Characteristics",
      "Life Skills",
      "Managing Stress at Work",
      "Work-Life Balance",
      "Classroom Management",
      "Effective Teaching Methodology",
      "Emotional Intelligence",
    ],
    methodology: ["Lecture Presentation", "Group Discussion", "Case Study Analysis"],
    duration: "1–3 Days",
    venue: "Host Institution",
    timing: "9:00 AM – 4:00 PM",
  },
  {
    id: "phd-assistance",
    icon: BookOpenCheck,
    title: "Ph.D. Assistance",
    summary:
      "End-to-end doctoral research support — from topic selection and proposal writing to viva preparation and publication.",
    items: [
      "Research Topic Selection",
      "Ph.D Proposal Writing",
      "Literature Review",
      "Questionnaire Development",
      "Tool Validation",
      "Research Methodology",
      "Data Collection",
      "SPSS Analysis",
      "Hypothesis Testing",
      "Thesis Editing",
      "Synopsis Preparation",
      "Plagiarism Checking",
      "Viva Preparation",
      "Research Paper Publication Support",
    ],
  },
  {
    id: "psychological-assessment",
    icon: BrainCircuit,
    title: "Psychological Assessment of Students",
    summary:
      "Standardised assessments to understand students' cognitive, emotional and career profiles.",
    items: [
      "IQ Assessment",
      "Memory Assessment (MQ)",
      "Emotional Intelligence (EQ)",
      "Personality Assessment",
      "Creativity Assessment",
      "Motivation Assessment",
      "Career Assessment",
    ],
  },
  {
    id: "ias-coaching",
    icon: Landmark,
    title: "IAS Coaching",
    summary:
      "Focused civil services preparation with foundation coaching, Psychology optional and interview guidance.",
    items: [
      "Foundation Coaching",
      "Psychology Optional",
      "Study Materials",
      "Mock Tests",
      "Interview Guidance",
    ],
  },
];
