type InstagramIconProps = {
  size?: number;
  className?: string;
};

/**
 * Instagram glyph from the approved mockups. Lucide 1.x no longer ships brand icons, so it is
 * drawn here with the same 24px grid and stroke as the Lucide icons used elsewhere.
 */
export function InstagramIcon({ size = 20, className }: InstagramIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
