import { motion } from "framer-motion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, Landmark, Flag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDbData } from "@/lib/db";
import directorImg from "@/assets/director.jpg";

export function About() {
  const { data: dbData } = useSuspenseQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const about = dbData.about || {
    name: "Prof. Dr. R. Rajendran",
    designation: "Director, SUN Academic Research & Training, Chennai",
    bio: "A distinguished academician whose career took shape at Annamalai University, rising to Professor & Head of the Centre for Educational Management and Applied Science. Over three and a half decades, he has shaped generations of teachers, scholars and civil service aspirants across South India.",
    credentials: ["M.A.", "M.Ed.", "M.B.A.", "Ph.D.", "FBMS"],
    affiliations: ["NITTTR", "Ministry of Education", "Tamil Nadu Government"],
    bulletPoints: [
      "35+ years of teaching, research and academic experience.",
      "Guided 10 Candidates, 85 Research Scholars and numerous Ph.D. researchers."
    ],
    imageUrl: ""
  };

  const isValidUrl = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.trim();
    return cleanUrl.startsWith("/") || cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("data:");
  };

  const displayImage = isValidUrl(about.imageUrl) && about.imageUrl ? about.imageUrl.trim() : directorImg;
  const icons = [Building2, Landmark, Flag];

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
              src={displayImage}
              alt={`Prof. Dr. R. Rajendran — Director, SUN Academic Research & Training`}
              width={1024}
              height={1024}
              loading="lazy"
              className="h-[380px] md:h-[500px] w-full object-cover"
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
          <SectionHeading eyebrow="About Us" title={about.name} />
          <p className="mt-3 text-sm font-medium uppercase tracking-wider text-primary font-display">
            {about.designation}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {about.credentials.map((c) => (
              <span
                key={c}
                className="rounded-full border border-primary/20 bg-primary-tint px-3 py-1 text-xs font-semibold text-primary"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {about.bio}
          </p>

          {about.affiliations.length > 0 && (
            <div className="mt-6 space-y-2 text-sm text-foreground/90">
              <p className="font-semibold text-foreground">Worked with:</p>
              <div className="flex flex-wrap gap-3">
                {about.affiliations.map((org, index) => {
                  const OrgIcon = icons[index % icons.length];
                  return (
                    <span
                      key={org}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-soft"
                    >
                      <OrgIcon className="h-4 w-4 text-primary" />
                      {org}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {about.bulletPoints.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {about.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
