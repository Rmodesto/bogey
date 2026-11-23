"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import {
  STABLE_UNSTABLE_CAPTIONS,
  STABLE_UNSTABLE_ROWS,
  STABLE_UNSTABLE_TRAP,
  stableUnstableScene,
} from "./logic/stableVsUnstable";

// W5 — "Stable and unstable air" 6-beat loop animation. Two sky panels up
// top; the comparison rows fade in one per beat, then the trap line.
// Layout and copy ported from docs/animations/designs/W5-StableVsUnstable.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function StableVsUnstable() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = stableUnstableScene(beat);
  const caption = STABLE_UNSTABLE_CAPTIONS[beat - 1];
  const rowOpacity = [o.o2, o.o3, o.o4, o.o5];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Panels */}
        <rect x="116" y="40" width="262" height="150" rx="10" fill="#e7f2f8" stroke="#e3e6ea" />
        <rect x="390" y="40" width="262" height="150" rx="10" fill="#e7f2f8" stroke="#e3e6ea" />
        <path d="M116 172h262M390 172h262" stroke="#0e1114" strokeWidth="2" />
        {/* Stable: flat layers, haze, steady rain */}
        <rect x="136" y="62" width="222" height="22" rx="11" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <rect x="150" y="92" width="196" height="20" rx="10" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <rect x="116" y="120" width="262" height="52" fill="#8a9198" opacity="0.25" />
        <path
          d="M160 124l-5 14M177 124l-5 14M194 124l-5 14M211 124l-5 14M228 124l-5 14M245 124l-5 14M262 124l-5 14M279 124l-5 14M296 124l-5 14M313 124l-5 14M330 124l-5 14M347 124l-5 14"
          stroke="#6fa6c6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Unstable: towering cloud, showers, updrafts */}
        <path
          d="M470 150Q455 101 480 82Q490 46 520 52Q550 46 560 82Q585 101 570 150Z"
          fill="#FFFFFF"
          stroke="#0e1114"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M492 154l-5 14M510 154l-5 14M528 154l-5 14M546 154l-5 14" stroke="#6fa6c6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M430 150V90M424 99l6-9 6 9" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M610 150V90M604 99l6-9 6 9" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute left-[116px] top-[14px] w-[262px] text-center text-[15px] font-semibold">Stable air</div>
      <div className="absolute left-[390px] top-[14px] w-[262px] text-center text-[15px] font-semibold">Unstable air</div>
      {/* Comparison rows */}
      <div className="absolute left-[20px] right-[20px] top-[204px] flex flex-col gap-[8px]">
        {STABLE_UNSTABLE_ROWS.map((row, i) => (
          <div
            key={row.label}
            className="grid items-center gap-[10px]"
            style={{ gridTemplateColumns: "96px 1fr 1fr", opacity: rowOpacity[i], ...fade }}
          >
            <div className="text-[12px] font-semibold text-graphite">{row.label}</div>
            <div className="px-[10px] py-[6px] rounded-[8px] bg-white text-[13.5px] font-semibold" style={{ border: "1.5px solid #0e1114" }}>
              {row.stable}
            </div>
            <div className="px-[10px] py-[6px] rounded-[8px] bg-white text-[13.5px] font-semibold" style={{ border: "1.5px solid #0e1114" }}>
              {row.unstable}
            </div>
          </div>
        ))}
      </div>
      {/* The trap */}
      <div
        className="absolute left-[20px] right-[20px] bottom-[12px] text-[12.5px] font-semibold text-[#b42318] text-center"
        style={{ opacity: o.o6, ...fade }}
      >
        {STABLE_UNSTABLE_TRAP}
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Stable and unstable air"
      category="Weather"
      stage={stage}
      stageBg="#f6f8fa"
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
      claim="Stable: layered cloud, smooth air, steady rain, poor visibility. Unstable: towering cloud, bumps, showers, good visibility."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="Hazy and calm, or clear and bumpy. Pick which one today is."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
