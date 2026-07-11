import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      {/* Green blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.9 0.08 149) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-10 -z-10 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.94 0.05 149) 0%, transparent 65%)" }}
      />

      <Container className="grid items-center gap-12 pb-16 md:pb-24 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Chennai · Since 1989
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-foreground md:text-6xl lg:text-[4rem]">
            Empowering Research, Education &amp;{" "}
            <span className="text-primary">Professional Development</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            SUN Academic Research &amp; Training partners with educators, scholars and institutions to
            deliver rigorous doctoral guidance, teacher capacity building, psychological assessments
            and civil services coaching.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-hover hover:shadow-elevated"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-3xl border border-border shadow-elevated"
          >
            <img
              src={heroImg}
              alt="Academic research and training environment"
              width={1024}
              height={1024}
              className="h-auto w-full object-cover"
            />
          </motion.div>
          {/* Floating stat card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-white p-4 shadow-elevated sm:block">
            <div className="text-2xl font-bold text-primary">35+ years</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">of academic excellence</div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
