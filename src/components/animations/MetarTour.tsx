"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { METAR_TOKENS, METAR_CAPTIONS, METAR_DECODES, metarScene, metarTokenStatus } from "./logic/metarTour";

// W1 — "METAR, group by group" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/W1-MetarGroupByGroup.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function MetarTour() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = metarScene(beat);
  const caption = METAR_CAPTIONS[beat - 1];

  const stage = (
    <>
      {/* The report, one chip per group */}
      <div className="absolute left-[14px] top-[14px] right-[14px] flex flex-wrap gap-[6px]">
        {METAR_TOKENS.map((t) => {
          const status = metarTokenStatus(t.group, beat);
          return (
            <span
              key={t.text}
              className="px-[6px] py-[5px] rounded-[8px] text-[14px] font-semibold text-jet-black"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                border: status === "active" ? "2px solid #0e1114" : "2px solid #e3e6ea",
                background: status === "active" ? "#9cd94a" : status === "past" ? "#eaf6d8" : "#FFFFFF",
                transition: "background 0.4s ease",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
      {/* One-line decode of the lit group */}
      <div className="absolute left-[14px] top-[54px] right-[14px] text-[15px] font-semibold min-h-[22px]">
        {METAR_DECODES[beat - 1]}
      </div>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Ground and altitude axis */}
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        <path d="M60 364V104" stroke="#0e1114" strokeWidth="2" />
        <text x="14" y="98" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
          ft AGL
        </text>
        <path d="M50 340h12M50 214h12M50 124h12" stroke="#0e1114" strokeWidth="1.5" />
        <text x="14" y="344" fontSize="12" fill="#0e1114" textAnchor="start">
          400
        </text>
        <text x="8" y="218" fontSize="12" fill="#0e1114" textAnchor="start">
          2,500
        </text>
        <text x="8" y="128" fontSize="12" fill="#0e1114" textAnchor="start">
          4,000
        </text>
        <path d="M62 340h596" stroke="#4f7d14" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="652" y="356" fontSize="12" fontWeight="600" fill="#33590a" textAnchor="end">
          Drone limit: 400 ft AGL
        </text>
        {/* Wind: the sock streams downwind (wind from the east blows it west) */}
        <g style={{ opacity: o.wind, ...fade }}>
          <path d="M120 364V286" stroke="#0e1114" strokeWidth="3" />
          <path d="M120 288L64 294L64 308L120 306Z" fill="#b42318" stroke="#0e1114" strokeWidth="1.5" />
          <path d="M102 290v17M84 292v15" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M300 300H210M222 292l-12 8 12 8" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="206" y="284" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            Wind from the east, 8 kt
          </text>
        </g>
        {/* Visibility and weather */}
        <g style={{ opacity: o.vis, ...fade }}>
          <path d="M400 312h240M400 304v16M640 304v16" stroke="#0e1114" strokeWidth="2" />
          <text x="520" y="302" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Visibility 10 SM
          </text>
          <path d="M448 252l-5 14M478 244l-5 14M508 256l-5 14M538 246l-5 14M568 254l-5 14" stroke="#6fa6c6" strokeWidth="2.5" strokeLinecap="round" />
          <text x="640" y="264" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="end">
            Light rain
          </text>
        </g>
        {/* Sky condition */}
        <g style={{ opacity: o.sky, ...fade }}>
          <rect x="110" y="197" width="110" height="34" rx="17" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <rect x="330" y="197" width="90" height="34" rx="17" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="232" y="218" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            SCT 2,500 ft
          </text>
          <rect x="100" y="106" width="150" height="36" rx="18" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <rect x="270" y="106" width="170" height="36" rx="18" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="452" y="128" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            BKN 4,000 ft: the ceiling
          </text>
        </g>
        {/* Temperature, dew point, altimeter */}
        <g style={{ opacity: o.temp, ...fade }}>
          <rect x="596" y="160" width="62" height="60" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="627" y="182" fontSize="14" fontWeight="600" fill="#0e1114" textAnchor="middle">
            18°C
          </text>
          <text x="627" y="198" fontSize="11" fill="#0e1114" textAnchor="middle">
            dew 14°C
          </text>
          <text x="627" y="213" fontSize="11" fill="#0e1114" textAnchor="middle">
            29.90 in
          </text>
        </g>
      </svg>
      {/* Verdict */}
      <div className="absolute left-[76px] bottom-[64px] flex" style={{ opacity: o.ok, ...fade }}>
        <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-volt-green text-jet-black text-[14px] font-semibold">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3.2 3.2L13 5" />
          </svg>
          <span>Within Part 107 weather limits</span>
        </div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="METAR, group by group"
      category="Weather"
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
      claim="Time is Zulu. Wind is in knots. Visibility is in statute miles. Cloud heights are feet AGL."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="BR is mist. Fog is FG."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
