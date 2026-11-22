"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { AIRSPACE_STACK_CAPTIONS, airspaceStackLayers } from "./logic/airspaceStack";

// A1 — "Airspace stack" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/A1-AirspaceStack.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };
const BL = "#1F4E9A";
const MG = "#8E1C5E";
const bF = "rgba(31,78,154,0.12)";
const mF = "rgba(142,28,94,0.12)";

export default function AirspaceStack() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = airspaceStackLayers(beat);
  const caption = AIRSPACE_STACK_CAPTIONS[beat - 1];

  const volume = (left: number, bottom: number, width: number, height: number, color: string, bg: string, dashed = false) => (
    <div
      className="absolute box-border"
      style={{
        left,
        bottom,
        width,
        height,
        border: `2.5px ${dashed ? "dashed" : "solid"} ${color}`,
        background: bg,
        transformOrigin: "bottom",
        transform: `scaleY(${o.volumes})`,
        opacity: o.volumes,
        ...fade,
      }}
    />
  );

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[44px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Class G stratum */}
      <div className="absolute left-0 right-0 bottom-[44px] h-[40px] bg-fog-gray border-t-[1.5px] border-slate" style={{ opacity: o.layers, ...fade }} />
      {/* Drone band */}
      <div
        className="absolute left-0 right-0 bottom-[44px] h-[14px] border-t-[1.5px] border-[#4f7d14]"
        style={{
          background: "repeating-linear-gradient(135deg, rgba(127,191,46,0.55) 0 4px, rgba(127,191,46,0.15) 4px 9px)",
          opacity: o.droneBand,
          ...fade,
        }}
      />
      <div className="absolute left-[12px] bottom-[62px] text-[12px] font-semibold" style={{ opacity: o.layers, ...fade }}>
        Class G
      </div>
      <div className="absolute left-[12px] bottom-[92px] text-[12px] font-semibold" style={{ opacity: o.layers, ...fade }}>
        Class E
      </div>
      {/* Class D cylinder */}
      {volume(80, 44, 110, 110, BL, bF, true)}
      <div className="absolute left-[80px] bottom-[160px] w-[110px] text-center text-[13px] font-semibold" style={{ color: BL, opacity: o.volumes, ...fade }}>
        Class D
      </div>
      {/* Class C core + shelf */}
      {volume(225, 110, 140, 104, MG, mF)}
      {volume(260, 44, 70, 170, MG, mF)}
      <div className="absolute left-[225px] bottom-[220px] w-[140px] text-center text-[13px] font-semibold" style={{ color: MG, opacity: o.volumes, ...fade }}>
        Class C
      </div>
      {/* Class B tiers */}
      {volume(410, 210, 190, 134, BL, bF)}
      {volume(440, 120, 130, 224, BL, bF)}
      {volume(470, 44, 70, 300, BL, bF)}
      <div className="absolute left-[410px] bottom-[350px] w-[190px] text-center text-[13px] font-semibold" style={{ color: BL, opacity: o.volumes, ...fade }}>
        Class B
      </div>
      {/* Airport labels */}
      <div className="absolute left-[80px] bottom-[14px] w-[110px] text-center text-[11px]">Small towered airport</div>
      <div className="absolute left-[225px] bottom-[14px] w-[140px] text-center text-[11px]">Medium airport</div>
      <div className="absolute left-[410px] bottom-[14px] w-[190px] text-center text-[11px]">Major airport</div>
      {/* Authorization legend */}
      <div className="absolute left-[12px] top-[12px] flex flex-col gap-[6px]" style={{ opacity: o.badges, ...fade }}>
        <div className="flex items-center gap-[8px] text-[13px]">
          <span className="flex items-center gap-[5px] px-[10px] py-[3px] border-2 border-jet-black rounded-full bg-white font-semibold">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2" strokeLinecap="round">
              <rect x="3.5" y="7" width="9" height="6.5" rx="1" />
              <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
            </svg>
            <span>Authorization needed</span>
          </span>
          <span>B, C, D, and Class E at the surface around an airport</span>
        </div>
        <div className="flex items-center gap-[8px] text-[13px]">
          <span className="flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-volt-green text-jet-black font-semibold">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3.2 3.2L13 5" />
            </svg>
            <span>None needed</span>
          </span>
          <span>Class G, and Class E that starts above the surface</span>
        </div>
      </div>
      <div
        className="absolute right-[10px] bottom-[62px] text-[12px] font-semibold text-[#33590a] bg-white px-[4px] rounded-[3px]"
        style={{ opacity: o.droneBand, ...fade }}
      >
        Where drones fly: surface to 400 ft AGL
      </div>
      <div className="absolute right-[10px] bottom-[26px] text-[11px]">Heights not to scale</div>
    </>
  );

  return (
    <AnimationFrame
      title="Airspace stack"
      category="Airspace"
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
      claim="Class B, C, D, and surface Class E around an airport need ATC authorization first. Class G does not."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.41"
      bogeymanLine="Authorization comes from LAANC, not from a radio call."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
