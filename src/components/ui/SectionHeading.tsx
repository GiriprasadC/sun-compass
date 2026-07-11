import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", "max-w-3xl", align === "center" && "mx-auto", className)}>
      {eyebrow && (
        <div className={cn("mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary")}>
          <span className="inline-block h-[2px] w-8 bg-primary" aria-hidden />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  );
}
