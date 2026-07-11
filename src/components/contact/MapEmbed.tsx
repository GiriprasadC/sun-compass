import { useSuspenseQuery } from "@tanstack/react-query";
import { getDbData } from "@/lib/db";

export function MapEmbed() {
  const { data: dbData } = useSuspenseQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const contactInfo = dbData.contactInfo;
  const address = contactInfo?.address || "A.K. Swamy Nagar, Kilpauk, Chennai 600010";
  const mapSrc = contactInfo?.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="h-full min-h-[360px] overflow-hidden rounded-3xl border border-border shadow-soft">
      <iframe
        title="SUN Academic Research & Training — Location Map"
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[360px] w-full border-0"
      />
    </div>
  );
}
