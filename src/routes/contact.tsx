import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { MapEmbed } from "@/components/contact/MapEmbed";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SUN Academic Research & Training" },
      {
        name: "description",
        content:
          "Get in touch with SUN Academic Research & Training in Kilpauk, Chennai. Call 98403 41412 or send an enquiry.",
      },
      { property: "og:title", content: "Contact — SUN Academic Research & Training" },
      {
        property: "og:description",
        content: "Kilpauk, Chennai · 9:00 AM – 8:00 PM (All Days) · 98403 41412",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <SectionHeading
            eyebrow="Contact Us"
            title="We'd love to hear from you"
            description="Reach out for programme enquiries, doctoral guidance, or institutional partnerships."
            align="center"
          />
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <ContactInfo />
            <EnquiryForm />
            <MapEmbed />
          </div>
        </Container>
      </section>
    </>
  );
}
