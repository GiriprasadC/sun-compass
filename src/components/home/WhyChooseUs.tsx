import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDbData } from "@/lib/db";
import { AnimatedCounter } from "./AnimatedCounter";
import * as Icons from "lucide-react";

export function WhyChooseUs() {
  const { data: dbData } = useQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const stats = dbData?.stats || [];

  return (
    <section className="bg-primary-tint/40 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A legacy of academic mentorship"
          description="Decades of proven guidance across research, teacher training and student assessment."
          align="center"
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const IconComponent = (Icons as any)[s.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-soft transition-all hover:shadow-elevated md:p-8"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary-tint text-primary">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
