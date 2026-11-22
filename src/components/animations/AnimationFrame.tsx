"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import BogeymanPortrait from "./BogeymanPortrait";

// Shared chrome for every lesson animation: header with category chip, a
// design-space stage that scales down to narrow viewports, caption, controls
// slot, and the dark summary card with the Bogeyman line.

export const STAGE_W = 672;
export const STAGE_H = 420;

// Scales a 672x420 design-space stage to the container width via transform,
// so animation layouts keep their absolute-pixel geometry from the designs.
function ScaledStage({
  children,
  dark,
  height = STAGE_H,
  bg,
}: {
  children: ReactNode;
  dark: boolean;
  height?: number;
  bg?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / STAGE_W));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full" style={{ height: height * scale }}>
      <div
        className={`relative rounded-[12px] overflow-hidden ${
          dark ? "bg-graphite border border-slate/30" : "bg-mist-blue border border-divider-gray"
        }`}
        style={{
          width: STAGE_W,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          ...(bg ? { background: bg, transition: "background 0.4s linear" } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function AnimationFrame({
  title,
  category,
  stage,
  caption,
  controls,
  claim,
  sourceLabel,
  citation,
  bogeymanLine,
  liveAnnouncement,
  dark = false,
  stageHeight,
  stageBg,
}: {
  title: string;
  category: string;
  stage: ReactNode;
  caption: string;
  controls: ReactNode;
  claim: string;
  sourceLabel: string;
  citation: string;
  bogeymanLine: string;
  liveAnnouncement: string;
  dark?: boolean;
  stageHeight?: number;
  stageBg?: string;
}) {
  return (
    <div
      data-citation={citation}
      className={`flex flex-col gap-[14px] rounded-[13px] p-[21px] sm:p-[24px] ${
        dark ? "bg-jet-black text-white" : "bg-fog-gray text-jet-black"
      }`}
    >
      <style jsx global>{`
        @keyframes bprop {
          0%,
          100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(0.12);
          }
        }
        .pblade {
          transform-box: fill-box;
          transform-origin: center;
          animation: bprop 0.5s linear infinite;
        }
        .pdisc {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .fly .pblade {
          animation-duration: 0.1s;
        }
        .fly .pdisc {
          opacity: 0.65;
        }
        @media (prefers-reduced-motion: reduce) {
          .pblade {
            animation: none;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center gap-[16px]">
        <h2 className="m-0 text-[24px] font-semibold">{title}</h2>
        <span className="text-[13px] font-semibold px-[12px] py-[6px] rounded-[8px] tabular-nums bg-graphite text-ice-blue">
          {category}
        </span>
      </div>

      {/* Stage */}
      <ScaledStage dark={dark} height={stageHeight} bg={stageBg}>{stage}</ScaledStage>

      {/* Caption */}
      <p className="m-0 text-[15px] leading-[1.4] min-h-[42px]">{caption}</p>

      {/* Live region for assistive tech */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-[16px]">{controls}</div>

      {/* Summary card */}
      <div
        className={`mt-auto p-[16px] rounded-[12px] flex flex-col gap-[12px] text-white ${
          dark ? "bg-graphite" : "bg-jet-black"
        }`}
      >
        <div className="flex justify-between items-start gap-[16px]">
          <p className="m-0 text-[18px] font-semibold leading-[1.35]">{claim}</p>
          <span
            className={`shrink-0 text-[12px] font-semibold px-[10px] py-[6px] rounded-[8px] whitespace-nowrap tabular-nums text-ice-blue ${
              dark ? "bg-jet-black" : "bg-graphite"
            }`}
          >
            {sourceLabel}
          </span>
        </div>
        <div className="flex items-center gap-[10px]">
          <BogeymanPortrait />
          <p className="m-0 px-[12px] py-[8px] bg-volt-mist border-2 border-volt-green rounded-[13px] text-graphite text-[13px] leading-[1.5]">
            {bogeymanLine}
          </p>
        </div>
      </div>
    </div>
  );
}
