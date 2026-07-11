import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

export type Service = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  items: string[];
  methodology?: string[];
  duration?: string;
  venue?: string;
  timing?: string;
};

type Props = { service: Service; onOpen: () => void };

export function ServiceCard({ service, onOpen }: Props) {
  const Icon = (Icons as any)[service.icon] || Icons.HelpCircle;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      }}
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col rounded-3xl border border-border bg-white p-7 shadow-soft transition-all hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-foreground">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary transition-all hover:gap-2.5"
      >
        Learn More
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
