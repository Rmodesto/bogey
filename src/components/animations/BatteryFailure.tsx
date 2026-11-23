"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { BATTERY_CAPTIONS, BATTERY_RULES, batteryScene } from "./logic/batteryFailure";

// O5 — "Lithium battery failure" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/O5-LithiumBatteryFailure.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };
const RED = "#b42318";
const CELLS = [
  { x: 54, cx: 97, label: "Cell 1" },
  { x: 158, cx: 201, label: "Cell 2" },
  { x: 262, cx: 305, label: "Cell 3" },
];
// Flame over each cell, shifted to its position.
const flamePath = (x: number) =>
  `M${x} 104q-22 -30 0 -62q6 22 20 30q16 18 0 40q-10 10 -20 -8z`;

export default function BatteryFailure() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = batteryScene(beat);
  const caption = BATTERY_CAPTIONS[beat - 1];
  const hot = [o.hot1, o.hot2, o.hot3];
  const fire = [o.fire1, o.fire2, o.fire3];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Pack cutaway */}
        <rect x="36" y="96" width="330" height="236" rx="14" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        {/* The swollen cell bulges past its case */}
        <ellipse cx="97" cy="215" rx="58" ry="104" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" style={{ opacity: o.swell, ...fade }} />
        {CELLS.map((cell, i) => (
          <g key={cell.label}>
            <rect x={cell.x} y="120" width="86" height="190" rx="8" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
            <rect x={cell.x} y="120" width="86" height="190" rx="8" fill={RED} style={{ opacity: hot[i], ...fade }} />
            <rect x={cell.x + 30} y="108" width="26" height="12" fill="#0e1114" />
            <text x={cell.cx} y="222" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
              {cell.label}
            </text>
          </g>
        ))}
        <ellipse cx="97" cy="215" rx="58" ry="104" fill={RED} style={{ opacity: o.hotSwell, ...fade }} />
        {/* Damage cracks */}
        <g style={{ opacity: o.damage, ...fade }}>
          <path d="M70 150l14 16-10 10 18 14-8 12" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M122 262l-14 20h12l-8 20" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Vented smoke */}
        <g style={{ opacity: o.vent, ...fade }}>
          <circle cx="78" cy="78" r="12" fill="#8a9198" opacity="0.7" />
          <circle cx="104" cy="58" r="16" fill="#8a9198" opacity="0.55" />
          <circle cx="84" cy="34" r="13" fill="#8a9198" opacity="0.4" />
        </g>
        {/* Fire, cell to cell */}
        {CELLS.map((cell, i) => (
          <path
            key={cell.label}
            d={flamePath(cell.cx - 5)}
            fill={RED}
            stroke="#0e1114"
            strokeWidth="1.5"
            style={{ opacity: fire[i], ...fade }}
          />
        ))}
        <text x="201" y="352" fontSize="12" fill="#0e1114" textAnchor="middle">
          Battery pack, cut away
        </text>
      </svg>
      <div
        className="absolute left-[50px] top-[316px] text-[12px] font-semibold text-white px-[8px] py-[1px] rounded-[6px]"
        style={{ background: RED, opacity: o.runaway, ...fade }}
      >
        Thermal runaway
      </div>
      {/* Handling rules */}
      <div
        className="absolute left-[392px] top-[96px] w-[260px] box-border p-[14px] rounded-[12px] bg-white border-2 border-jet-black flex flex-col gap-[10px]"
        style={{ opacity: o.rules, ...fade }}
      >
        {BATTERY_RULES.map((rule) => (
          <div key={rule} className="flex gap-[8px] text-[13px] leading-[1.35]">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#0e1114"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-[1px]"
            >
              <path d="M3 8.5l3.2 3.2L13 5" />
            </svg>
            <span>{rule}</span>
          </div>
        ))}
      </div>
      {/* Stage name */}
      <div
        className="absolute left-[392px] top-[96px] w-[260px] text-[14px] font-semibold leading-[1.4]"
        style={{ opacity: o.stage, ...fade }}
      >
        {o.stageName}
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Lithium battery failure"
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
      claim="Swollen, dented, punctured, or leaking: take the battery out of service."
      sourceLabel="FAA safety guidance"
      citation="FAA-G-8082-22"
      bogeymanLine="If one burns, cool it with water and keep back. It can reignite."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
