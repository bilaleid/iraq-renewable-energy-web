export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="var(--brand-green-800)" />
      <path
        d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
        fill="var(--brand-green-600)"
      />
      <circle cx="20" cy="19" r="6.5" fill="var(--brand-gold-400)" />
      <path
        d="M20 10.5V13M27.5 19H25M20 27.5V25M12.5 19H15M25.3 13.7L23.5 15.5M25.3 24.3L23.5 22.5M14.7 13.7L16.5 15.5M14.7 24.3L16.5 22.5"
        stroke="var(--brand-gold-100)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoWordmark({
  siteName,
  className = "",
}: {
  siteName: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-lg font-bold leading-tight tracking-tight text-brand-ink-900">
        {siteName}
      </span>
    </div>
  );
}
