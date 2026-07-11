import { motion } from "framer-motion";
import { Building2, Landmark, Flag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import directorImg from "@/assets/director.jpg";

const credentials = ["M.A.", "M.Ed.", "M.B.A.", "Ph.D.", "FBMS"];

const affiliations = [
  { Icon: Building2, label: "NITTTR" },
  { Icon: Landmark, label: "Ministry of Education" },
  { Icon: Flag, label: "Tamil Nadu Government" },
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
            <img
              src={directorImg}
              alt="Prof. Dr. R. Rajendran — Director, SUN Academic Research & Training"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute -bottom-8 -right-8 -z-10 h-40 w-40 rounded-3xl bg-primary-tint"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeading eyebrow="About Us" title="Prof. Dr. R. Rajendran" />
          <p className="mt-3 text-sm font-medium uppercase tracking-wider text-primary">
            Director, SUN Academic Research &amp; Training, Chennai
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {credentials.map((c) => (
              <span
                key={c}
                className="rounded-full border border-primary/20 bg-primary-tint px-3 py-1 text-xs font-semibold text-primary"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            A distinguished academician whose career took shape at Annamalai University, rising to
            Professor &amp; Head of the Centre for Educational Management and Applied Science. Over
            three and a half decades, he has shaped generations of teachers, scholars and civil
            service aspirants across South India.
          </p>

          <div className="mt-6 space-y-2 text-sm text-foreground/90">
            <p className="font-semibold text-foreground">Worked with:</p>
            <div className="flex flex-wrap gap-3">
              {affiliations.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-soft"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              35+ years of teaching, research and academic experience.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Guided 10 Candidates, 85 Research Scholars and numerous Ph.D. researchers.
            </li>
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
