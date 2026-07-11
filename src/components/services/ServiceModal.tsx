import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Clock, MapPin, Sun } from "lucide-react";
import type { Service } from "@/data/services";

type Props = { service: Service | null; open: boolean; onOpenChange: (o: boolean) => void };

export function ServiceModal({ service, open, onOpenChange }: Props) {
  if (!service) return null;
  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-tint text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle className="font-display text-2xl">{service.title}</DialogTitle>
          <DialogDescription className="text-base">{service.summary}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              What we cover
            </h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {service.methodology && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Methodology
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.methodology.map((m) => (
                  <span key={m} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground/80">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(service.duration || service.venue || service.timing) && (
            <div className="grid gap-3 rounded-2xl bg-primary-tint/60 p-4 sm:grid-cols-3">
              {service.duration && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Duration</div>
                    <div className="text-muted-foreground">{service.duration}</div>
                  </div>
                </div>
              )}
              {service.venue && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Venue</div>
                    <div className="text-muted-foreground">{service.venue}</div>
                  </div>
                </div>
              )}
              {service.timing && (
                <div className="flex items-start gap-2 text-sm">
                  <Sun className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Timing</div>
                    <div className="text-muted-foreground">{service.timing}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
