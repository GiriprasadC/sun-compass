import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceModal } from "@/components/services/ServiceModal";
import { services, type Service } from "@/data/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SUN Academic Research & Training" },
      {
        name: "description",
        content:
          "Ph.D. assistance, teachers training programmes, psychological assessment of students and IAS coaching — from SUN Academic, Chennai.",
      },
      { property: "og:title", content: "Services — SUN Academic Research & Training" },
      {
        property: "og:description",
        content:
          "Explore our four core programmes: Ph.D. assistance, teachers training, psychological assessment and IAS coaching.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [active, setActive] = useState<Service | null>(null);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Programmes designed for scholars and educators"
            description="Four core service areas — each led with 35+ years of academic rigour and mentorship."
            align="center"
          />
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} onOpen={() => setActive(s)} />
            ))}
          </motion.div>
        </Container>
      </section>

      <ServiceModal
        service={active}
        open={active !== null}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </>
  );
}
