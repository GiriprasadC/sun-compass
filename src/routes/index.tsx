import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard, type Service } from "@/components/services/ServiceCard";
import { ServiceModal } from "@/components/services/ServiceModal";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { getDbData } from "@/lib/db";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: dbData } = useQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const services = dbData?.services || [];
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />

      {/* Services Section on Homepage */}
      <section id="services" className="py-20 md:py-28 bg-slate-50/50 border-t border-b border-border/50">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Programmes designed for scholars and educators"
            description="Four core service areas — each led with 35+ years of academic rigour and mentorship."
            align="center"
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-12"
          >
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} onOpen={() => setActiveService(s)} />
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Contact Section on Homepage */}
      <section id="contact" className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Contact Us"
            title="We'd love to hear from you"
            description="Reach out for programme enquiries, doctoral guidance, or institutional partnerships."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3 mt-12">
            <ContactInfo />
            <EnquiryForm />
            <MapEmbed />
          </div>
        </Container>
      </section>

      <ServiceModal
        service={activeService}
        open={activeService !== null}
        onOpenChange={(o) => !o && setActiveService(null)}
      />
    </>
  );
}
