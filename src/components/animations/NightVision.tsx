"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { NIGHT_VISION_CAPTIONS, nightVisionScene } from "./logic/nightVision";

// O6 — "Night vision" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/O6-NightVision.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

// Rods ring the retina (radius 118 from the eye's center), leaving a gap
// where the cones sit on the visual axis.
const ROD_ANGLES = [-80, -70, -60, -50, -40, -30, -20, 20, 30, 40, 50, 60, 70, 80];
const CONES = [
  { cx: 316.2, cy: 194.5 },
  { cx: 317.6, cy: 204.7 },
  { cx: 318.0, cy: 215.0 },
  { cx: 317.6, cy: 225.3 },
  { cx: 316.2, cy: 235.5 },
];

export default function NightVision() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = nightVisionScene(beat);
  const caption = NIGHT_VISION_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* The eye */}
        <circle cx="200" cy="215" r="130" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2.5" />
        <ellipse cx="86" cy="215" rx="16" ry="34" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
        <text x="200" y="372" fontSize="12" fill="#0e1114" textAnchor="middle">
          The eye, seen from the side
        </text>
        <text x="60" y="160" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          Lens
        </text>
        <text x="300" y="104" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          Retina
        </text>
        {/* Light rays */}
        <path d="M20 215H318" stroke="#9cd94a" strokeWidth="3" strokeDasharray="8 6" style={{ opacity: o.axis, ...fade }} />
        <path d="M20 176L86 204L306 262" stroke="#9cd94a" strokeWidth="3" strokeDasharray="8 6" fill="none" style={{ opacity: o.offRay, ...fade }} />
        {/* Cones at the center */}
        <g style={{ opacity: o.cones, ...fade }}>
          {CONES.map((c) => (
            <circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r="4.5" fill="#6fa6c6" stroke="#0e1114" strokeWidth="1" />
          ))}
          <text x="340" y="219" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            Cones: center
          </text>
        </g>
        {/* Rods all around */}
        <g style={{ opacity: o.rods, ...fade }}>
          {ROD_ANGLES.map((a) => {
            const cx = 200 + 118 * Math.cos((a * Math.PI) / 180);
            const cy = 215 + 118 * Math.sin((a * Math.PI) / 180);
            return (
              <rect
                key={a}
                x={cx - 6}
                y={cy - 2.5}
                width="12"
                height="5"
                rx="2"
                fill="#2b2f33"
                transform={`rotate(${a} ${cx} ${cy})`}
              />
            );
          })}
          <text x="322" y="300" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            Rods: all around
          </text>
        </g>
        {/* The night sky demo */}
        <rect x="446" y="60" width="206" height="200" rx="10" fill="#0e1114" />
        <text x="549" y="82" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">
          What you see at night
        </text>
        <circle cx="549" cy="160" r="18" fill="#9cd94a" style={{ opacity: o.glow, ...fade }} />
        <circle cx="549" cy="160" r="6" fill="#9cd94a" style={{ opacity: o.dot, ...fade }} />
        <g style={{ opacity: o.lookCenter, ...fade }}>
          <circle cx="549" cy="160" r="26" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="549" y="240" fontSize="12" fill="#FFFFFF" textAnchor="middle">
            Looking straight at it
          </text>
        </g>
        <g style={{ opacity: o.lookOff, ...fade }}>
          <circle cx="601" cy="136" r="16" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="549" y="240" fontSize="12" fill="#FFFFFF" textAnchor="middle">
            Looking just beside it
          </text>
        </g>
      </svg>
      {/* Dark adaptation */}
      <div className="absolute left-[446px] top-[280px] w-[206px]" style={{ opacity: o.clock, ...fade }}>
        <div className="text-[12px] font-semibold mb-[4px]">Dark adaptation: about 30 minutes</div>
        <div className="h-[14px] rounded-[4px] bg-white overflow-hidden" style={{ border: "1.5px solid #0e1114" }}>
          <div className="w-full h-full bg-volt-green" />
        </div>
        <div className="text-[12px] mt-[6px] leading-[1.35]">A bright white light resets it. Use dim red light.</div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Night vision"
      category="Operations"
      stage={stage}
      caption={caption}
      controls={
        <LoopControls
          beat={beat}
          totalBeats={6}
          playing={loop.playing}
          onToggle={loop.toggle}
          onReplay={loop.replay}
          onPrev={loop.prev}
          onNext={loop.next}
        />
      }
      claim="At night, look slightly to the side of what you want to see, and give your eyes about 30 minutes to adapt."
      sourceLabel="FAA pilot handbook"
      citation="FAA-G-8082-22"
      bogeymanLine="One look at a bright phone screen and you start over."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
