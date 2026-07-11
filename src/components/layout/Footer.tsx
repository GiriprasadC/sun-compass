import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Youtube, GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/data/navLinks";
import { getDbData } from "@/lib/db";

export function Footer() {
  const { data: dbData } = useQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const contact = dbData?.contactInfo || {
    directorName: "Prof. Dr. R. Rajendran",
    directorSub: "Director, SUN Academic Research & Training",
    address: "No.104/1, A.K. Swamy Nagar, 7th Street, Kilpauk, Chennai – 600010",
    phone: "98403 41412",
    email: "rajendra1234@gmail.com",
    officeHours: "9:00 AM – 8:00 PM (All Days)"
  };

  const social = dbData?.socialLinks || {
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: ""
  };

  const socialChannels = [
    { Icon: Facebook, label: "Facebook", url: social.facebook },
    { Icon: Linkedin, label: "LinkedIn", url: social.linkedin },
    { Icon: Instagram, label: "Instagram", url: social.instagram },
    { Icon: Youtube, label: "YouTube", url: social.youtube },
  ].filter(item => item.url);

  return (
    <footer className="mt-24 border-t border-border bg-[oklch(0.98_0.01_149)]">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">SUN Academic</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Research &amp; Training — empowering educators, students and scholars with rigorous academic guidance.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {contact.address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:+91${contact.phone.replace(/\s+/g, "")}`} className="hover:text-primary">
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary break-all">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Follow</h4>
          <div className="mt-4 flex gap-3">
            {socialChannels.length === 0 ? (
              <span className="text-xs text-muted-foreground">No social profiles configured</span>
            ) : (
              socialChannels.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 SUN Academic Research &amp; Training. All Rights Reserved.</p>
          <p>Director: {contact.directorName}</p>
        </Container>
      </div>
    </footer>
  );
}
