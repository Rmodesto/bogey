"use client";

// The shared stage drone, path data copied from R1-AltitudeLimit.dc.html.
// `flying` blurs the propellers into discs; reduced motion shows static blades.
export default function Drone({
  size = 88,
  flying = false,
  dark = false,
}: {
  size?: number;
  flying?: boolean;
  dark?: boolean;
}) {
  const ink = dark ? "#ffffff" : "#0e1114"; // jet-black / white
  const arm = dark ? "#8a9198" : "#2b2f33"; // slate / graphite
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={(size * 40) / 88}
      viewBox="0 0 88 40"
      fill="none"
      className={flying ? "fly" : ""}
    >
      <rect x="42.5" y="3" width="3" height="6" fill={ink} />
      <ellipse className="pdisc" cx="44" cy="2.6" rx="11" ry="2.6" fill="#9cd94a" />
      <rect className="pblade" x="33" y="1.3" width="22" height="2.6" rx="1.3" fill="#9cd94a" stroke={ink} strokeWidth="1.2" />
      <ellipse className="pdisc" cx="16" cy="6.5" rx="14" ry="2.6" fill="#9cd94a" />
      <rect className="pblade" x="2" y="5.2" width="28" height="2.6" rx="1.3" fill="#9cd94a" stroke={ink} strokeWidth="1.2" />
      <ellipse className="pdisc" cx="72" cy="6.5" rx="14" ry="2.6" fill="#9cd94a" />
      <rect className="pblade" x="58" y="5.2" width="28" height="2.6" rx="1.3" fill="#9cd94a" stroke={ink} strokeWidth="1.2" />
      <rect x="13" y="8" width="6" height="8" rx="2" fill={ink} />
      <rect x="69" y="8" width="6" height="8" rx="2" fill={ink} />
      <path d="M17 14L34 17M71 14L54 17" stroke={arm} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M36 25L29 37M52 25L59 37M24 37.5h10M54 37.5h10" stroke={ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="40.5" y="25" width="7" height="4" fill={ink} />
      <circle cx="44" cy="32" r="4.5" fill={arm} stroke={ink} strokeWidth="1.5" />
      <circle cx="44" cy="32" r="1.7" fill="#a9cfe3" />
      <rect x="33" y="8" width="22" height="18" rx="4" fill="#a9cfe3" stroke={ink} strokeWidth="2" />
      <rect x="36.5" y="12" width="15" height="6" rx="2" fill="#0e1114" />
      <circle cx="50" cy="22" r="1.7" fill="#9cd94a" />
    </svg>
  );
}
