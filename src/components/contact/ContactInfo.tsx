import { User, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDbData } from "@/lib/db";

export function ContactInfo() {
  const { data: dbData } = useSuspenseQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const contact = dbData.contactInfo || {
    directorName: "Prof. Dr. R. Rajendran",
    directorSub: "Director, SUN Academic Research & Training",
    address: "No.104/1, A.K. Swamy Nagar, 7th Street, Kilpauk, Chennai – 600010",
    phone: "98403 41412",
    email: "rajendra1234@gmail.com",
    officeHours: "9:00 AM – 8:00 PM (All Days)"
  };

  const rows = [
    {
      Icon: User,
      label: "Director",
      value: contact.directorName,
      sub: contact.directorSub,
    },
    {
      Icon: MapPin,
      label: "Address",
      value: contact.address,
    },
    {
      Icon: Phone,
      label: "Phone",
      value: contact.phone,
      href: `tel:+91${contact.phone.replace(/\s+/g, "")}`,
    },
    {
      Icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      Icon: Clock,
      label: "Office Hours",
      value: contact.officeHours,
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-white p-7 shadow-soft">
      <h3 className="font-display text-xl font-bold text-foreground">Get in touch</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reach out to us for enquiries about our programmes.
      </p>
      <ul className="mt-6 space-y-5">
        {rows.map(({ Icon, label, value, sub, href }) => (
          <li key={label} className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              {href ? (
                <a href={href} className="mt-0.5 block break-words text-sm font-medium text-foreground hover:text-primary">
                  {value}
                </a>
              ) : (
                <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
              )}
              {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
