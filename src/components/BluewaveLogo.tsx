interface BluewaveLogoProps {
  className?: string;
  title?: string;
}

/**
 * Official Bluewave Academy mark — three stacked waves with a learning spark.
 * Pure SVG, inherits sizing from className.
 */
export const BluewaveLogo = ({ className, title = "Bluewave Academy" }: BluewaveLogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    role="img"
    aria-label={title}
    className={className}
  >
    <defs>
      <linearGradient id="bw-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="55%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
      <linearGradient id="bw-wave" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.95" />
        <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#bw-bg)" />
    <path
      d="M8 42 C 18 32, 26 52, 36 42 S 54 32, 58 42"
      fill="none"
      stroke="url(#bw-wave)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M8 32 C 18 22, 26 42, 36 32 S 54 22, 58 32"
      fill="none"
      stroke="url(#bw-wave)"
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path
      d="M8 22 C 18 14, 26 30, 36 22 S 54 14, 58 22"
      fill="none"
      stroke="url(#bw-wave)"
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.65"
    />
    <circle cx="50" cy="16" r="2.6" fill="hsl(48 96% 76%)" />
  </svg>
);

export default BluewaveLogo;
