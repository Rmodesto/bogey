"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { SPECIAL_USE_CARDS, SPECIAL_USE_CAPTIONS, specialUseCardState } from "./logic/specialUse";

// A5 — "Special-use airspace" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/A5-SpecialUseGallery.dc.html.

export default function SpecialUse() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const caption = SPECIAL_USE_CAPTIONS[beat - 1];

  const stage = (
    <div className="absolute left-[14px] top-[14px] right-[14px] bottom-[14px] grid grid-cols-3 grid-rows-2 gap-[10px]">
      {SPECIAL_USE_CARDS.map((card, i) => {
        const state = specialUseCardState(i, beat);
        return (
          <div
            key={card.name}
            className="box-border p-[12px] rounded-[12px] bg-white flex flex-col gap-[6px]"
            style={{
              border: state.active ? "3px solid #0e1114" : "1.5px solid #e3e6ea",
              opacity: state.opacity,
              transition: "opacity 0.6s ease, transform 0.8s ease",
            }}
          >
            <div className="flex justify-between items-center gap-[6px]">
              <span className="text-[12px] font-semibold px-[8px] py-[2px] rounded-[6px] bg-graphite text-ice-blue">{card.code}</span>
              <span className="text-[12px] text-graphite">{card.kind}</span>
            </div>
            <div className="text-[16px] font-semibold leading-[1.2]">{card.name}</div>
            <div className="text-[12.5px] leading-[1.4]">{card.text}</div>
            {card.perm ? (
              <div className="mt-auto self-start flex items-center gap-[5px] px-[10px] py-[3px] border-2 border-jet-black rounded-full text-[12.5px] font-semibold">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2" strokeLinecap="round">
                  <rect x="3.5" y="7" width="9" height="6.5" rx="1" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
                </svg>
                <span>Permission required</span>
              </div>
            ) : (
              <div className="mt-auto self-start flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-volt-green text-[12.5px] font-semibold">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3.2 3.2L13 5" />
                </svg>
                <span>No permission needed</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <AnimationFrame
      title="Special-use airspace"
      category="Airspace"
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
      claim="Prohibited and restricted areas need permission from the using or controlling agency. The other four do not."
      sourceLabel="Part 107 rules"
      citation="AIM 3-4"
      bogeymanLine="LAANC does not cover these. It is for airspace around airports."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
