"use client";

import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { LAANC_CAPTIONS, LAANC_GRID_CEILINGS, laancScene } from "./logic/laanc";

// A3 — "Getting authorization" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/A3-GettingAuthorization.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };
const BL = "#1F4E9A";

export default function Laanc() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = laancScene(beat);
  const caption = LAANC_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* The map: Class D over a towered airport */}
        <rect x="20" y="44" width="384" height="320" fill="#FFFFFF" />
        <circle cx="212" cy="204" r="150" fill="rgba(31,78,154,0.08)" stroke={BL} strokeWidth="2.5" strokeDasharray="9 6" />
        <path d="M170 204h84" stroke="#0e1114" strokeWidth="9" strokeLinecap="round" />
        <path d="M178 204h68" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="212" y="188" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">
          Runway
        </text>
        <text x="212" y="36" fontSize="12" fontWeight="600" fill={BL} textAnchor="middle">
          Class D, surface up
        </text>
        {/* Facility-map grid */}
        <g style={{ opacity: o.grid, ...fade }}>
          {LAANC_GRID_CEILINGS.map((row, r) =>
            row.map((ceiling, c) => (
              <g key={`${r}-${c}`}>
                <rect x={20 + c * 64} y={44 + r * 64} width="64" height="64" fill="none" stroke="#8a9198" strokeWidth="1" />
                <text x={52 + c * 64} y={102 + r * 64} fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
                  {ceiling}
                </text>
              </g>
            ))
          )}
        </g>
        {/* Your square */}
        <g style={{ opacity: o.pin, ...fade }}>
          <rect x="276" y="108" width="64" height="64" fill="rgba(156,217,74,0.35)" stroke="#4f7d14" strokeWidth="2.5" />
        </g>
        {/* Arrows between the cards */}
        <g style={{ opacity: o.request, ...fade }}>
          <path d="M540 112v30M533 134l7 9 7-9" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g style={{ opacity: o.approval, ...fade }}>
          <path d="M540 236v24M533 252l7 9 7-9" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      {/* The drone in its square */}
      <div className="absolute left-[286px] top-[116px]" style={{ opacity: o.pin, ...fade }}>
        <Drone size={44} />
      </div>
      <div className="absolute left-[20px] bottom-[28px] text-[12px]" style={{ opacity: o.grid, ...fade }}>
        Numbers are feet AGL. Map is an example, not a real airport.
      </div>
      {/* Request card */}
      <div
        className="absolute left-[424px] top-[44px] w-[232px] box-border px-[12px] py-[10px] border-2 border-jet-black rounded-[12px] bg-white"
        style={{ opacity: o.pin, ...fade }}
      >
        <div className="text-[12px] font-semibold text-graphite">Your request, from an app</div>
        <div className="text-[15px] font-semibold leading-[1.3]">This square, up to 150 ft AGL</div>
      </div>
      {/* LAANC card */}
      <div
        className="absolute left-[424px] top-[156px] w-[232px] box-border px-[12px] py-[10px] rounded-[12px] bg-graphite text-white"
        style={{ opacity: o.request, ...fade }}
      >
        <div className="text-[15px] font-semibold">LAANC</div>
        <div className="text-[12px] leading-[1.35]">Checks the request against the facility map. No radio call.</div>
      </div>
      {/* Approval card */}
      <div
        className="absolute left-[424px] top-[270px] w-[232px] box-border px-[12px] py-[10px] rounded-[12px] bg-volt-green text-jet-black"
        style={{ opacity: o.approval, ...fade }}
      >
        <div className="text-[15px] font-semibold">Approved up to 200 ft AGL</div>
        <div className="text-[12px] leading-[1.35]">Near-real time, at or below the number in the square.</div>
      </div>
      {/* Further coordination */}
      <div
        className="absolute left-[424px] top-[352px] w-[232px] box-border px-[12px] py-[8px] rounded-[12px] bg-white text-[12px] leading-[1.35]"
        style={{ border: "1.5px dashed #0e1114", opacity: o.more, ...fade }}
      >
        Higher, or no LAANC here? A person reviews that request.
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Getting authorization"
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
      claim="In controlled airspace around an airport, get authorization before you fly: LAANC, or FAADroneZone."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.41"
      bogeymanLine="A zero in the square means no automatic approval there."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
