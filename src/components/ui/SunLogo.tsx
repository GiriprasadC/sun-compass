import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function SunLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-label="SUN Academic Research & Training logo"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill="currentColor" opacity="0.1" />

      {/* Sun rays */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = -180 + i * (180 / 14);
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + 16 * Math.cos(rad);
        const y1 = 38 + 16 * Math.sin(rad);
        const x2 = 32 + 28 * Math.cos(rad);
        const y2 = 38 + 28 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}

      {/* Sun semicircle */}
      <path
        d="M16 38 A16 16 0 0 1 48 38"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16 38 A16 16 0 0 1 48 38"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />

      {/* Horizontal baseline */}
      <line x1="12" y1="38" x2="52" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Lotus / leaf motif */}
      {/* Center petal */}
      <path
        d="M32 36 C32 28 32 24 32 20 C34 24 34 28 34 36 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M32 36 C32 28 32 24 32 20 C30 24 30 28 30 36 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Left petals */}
      <path
        d="M30 36 C27 30 24 26 22 24 C24 28 26 32 30 36 Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M28 37 C24 33 20 30 18 29 C20 33 24 35 28 37 Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Right petals */}
      <path
        d="M34 36 C37 30 40 26 42 24 C40 28 38 32 34 36 Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M36 37 C40 33 44 30 46 29 C44 33 40 35 36 37 Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
