"use client";

// Head-and-shoulders portrait for the summary card, copied from the design
// files. Separate from src/components/Bogeyman.tsx on purpose.
export default function BogeymanPortrait() {
  return (
    <svg aria-hidden="true" width="48" height="52" viewBox="0 0 48 52" fill="none" className="shrink-0">
      <path d="M5 52C5 45 13 41.5 24 41.5C35 41.5 43 45 43 52Z" fill="#a9cfe3" />
      <path d="M19 41.5L24 47L29 41.5" stroke="#6fa6c6" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="29" y="45.5" width="9" height="4.5" rx="1.5" fill="#9cd94a" />
      <rect x="20" y="33" width="8" height="9" fill="#dcbf98" />
      <path d="M12 14Q12 6 24 6Q36 6 36 14L36 26Q36 31 31.5 34.5L27.5 37.5Q24 39.5 20.5 37.5L16.5 34.5Q12 31 12 26Z" fill="#f0d6b4" />
      <path d="M10.5 17Q9.5 3 24 3Q38.5 3 37.5 17L35 13.5Q24 9.5 13 13.5Z" fill="#2b2f33" stroke="#8a9198" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="7" y="15" width="5.5" height="11.5" rx="2" fill="#2b2f33" stroke="#8a9198" strokeWidth="0.8" />
      <rect x="35.5" y="15" width="5.5" height="11.5" rx="2" fill="#2b2f33" stroke="#8a9198" strokeWidth="0.8" />
      <path d="M12.5 16L35.5 16L34.5 23Q30 25.8 26 22.6L24 21.6L22 22.6Q18 25.8 13.5 23Z" fill="#6fa6c6" stroke="#2b2f33" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M15 18L21.5 18" stroke="#e7f2f8" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M27.5 19.5h5" stroke="#9cd94a" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M20.5 30.5Q24 32.6 27.5 30.5" stroke="#2b2f33" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9.5 26Q10.5 33.5 18.5 34" stroke="#8a9198" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19.5" cy="34" r="1.7" fill="#9cd94a" />
    </svg>
  );
}
