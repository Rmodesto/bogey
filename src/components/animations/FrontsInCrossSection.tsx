"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { FRONTS_CAPTIONS, FRONTS_CHANGES, frontsScene } from "./logic/frontsInCrossSection";

// W9 — "Fronts in cross-section" 6-beat loop animation. Cold front on the
// left, warm front on the right, built up one layer per beat.
// Layout and copy ported from docs/animations/designs/W9-FrontsInCrossSection.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function FrontsInCrossSection() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const v = frontsScene(beat);
  const caption = FRONTS_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Panels */}
        <rect x="14" y="44" width="316" height="300" rx="10" fill="#e7f2f8" stroke="#e3e6ea" />
        <rect x="342" y="44" width="316" height="300" rx="10" fill="#e7f2f8" stroke="#e3e6ea" />
        <path d="M14 320h316M342 320h316" stroke="#0e1114" strokeWidth="2" />
        {/* Cold front: the steep wedge */}
        <g style={{ opacity: v.oC1, ...fade }}>
          <path d="M14 320L14 200Q150 200 196 320Z" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
          <text x="70" y="290" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="start">
            Cold air
          </text>
          <text x="270" y="290" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="start">
            Warm air
          </text>
          <path d="M96 250h60M146 243l10 7-10 7" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M214 300V180M208 189l6-9 6 9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Cold front: the towering cloud */}
        <g style={{ opacity: v.oC2, ...fade }}>
          <path
            d="M178 170Q167 118 186 96Q193 60 216 66Q239 60 246 96Q265 118 254 170Z"
            fill="#FFFFFF"
            stroke="#0e1114"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M196 176l-5 14M210 176l-5 14M224 176l-5 14M238 176l-5 14" stroke="#6fa6c6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M214 120l-8 18h10l-8 18" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="172" y="60" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Narrow band, fast
          </text>
        </g>
        {/* Warm front: the shallow slope */}
        <g style={{ opacity: v.oW1, ...fade }}>
          <path d="M658 320L658 250Q520 270 430 320Z" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
          <text x="600" y="304" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="start">
            Cold air
          </text>
          <text x="366" y="304" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="start">
            Warm air
          </text>
          <path d="M400 290Q500 250 640 216" stroke="#b42318" strokeWidth="2.5" fill="none" />
          <path d="M626 212l14 3-8 12" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Warm front: the layered cloud */}
        <g style={{ opacity: v.oW2, ...fade }}>
          <rect x="430" y="206" width="214" height="20" rx="10" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <rect x="470" y="170" width="174" height="18" rx="9" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <rect x="520" y="134" width="124" height="16" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <path
            d="M452 234l-5 14M469 234l-5 14M486 234l-5 14M503 234l-5 14M520 234l-5 14M537 234l-5 14M554 234l-5 14M571 234l-5 14M588 234l-5 14M605 234l-5 14M622 234l-5 14"
            stroke="#6fa6c6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="500" y="60" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Wide area, slow
          </text>
        </g>
      </svg>
      <div className="absolute left-[14px] top-[14px] w-[316px] text-center text-[15px] font-semibold">Cold front</div>
      <div className="absolute left-[342px] top-[14px] w-[316px] text-center text-[15px] font-semibold">Warm front</div>
      {/* What changes when a front passes */}
      <div
        className="absolute left-[14px] right-[14px] bottom-[14px] flex gap-[8px] justify-center"
        style={{ opacity: v.oChg, ...fade }}
      >
        {FRONTS_CHANGES.map((name) => (
          <span
            key={name}
            className="text-[12.5px] font-semibold px-[10px] py-[3px] rounded-full bg-white"
            style={{ border: "1.5px solid #0e1114" }}
          >
            {name}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Fronts in cross-section"
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
      claim="Cold front: narrow, fast, showers and gusts. Warm front: wide, slow, steady rain and low cloud."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="Cold fronts hit hard and leave. Warm fronts settle in."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
