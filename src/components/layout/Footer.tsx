import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Youtube, GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/data/navLinks";

export function Footer() {
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
              No.104/1, A.K. Swamy Nagar, 7th Street, Kilpauk, Chennai – 600010
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+919840341412" className="hover:text-primary">98403 41412</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:rajendra1234@gmail.com" className="hover:text-primary break-all">
                rajendra1234@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Follow</h4>
          <div className="mt-4 flex gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 SUN Academic Research &amp; Training. All Rights Reserved.</p>
          <p>Director: Prof. Dr. R. Rajendran</p>
        </Container>
      </div>
    </footer>
  );
}
