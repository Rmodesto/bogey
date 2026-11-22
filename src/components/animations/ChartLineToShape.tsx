"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import { CHART_ITEMS } from "./logic/chartLineToShape";

// A2 — "Chart line to shape" pick animation.
// Layout and copy ported from docs/animations/designs/A2-ChartLineToShape.dc.html.
// TODO(verify): chart line styles pending a check against the FAA
// Aeronautical Chart Users' Guide.

export default function ChartLineToShape() {
  const [sel, setSel] = useState(0);

  const s = CHART_ITEMS[sel];

  const stage = (
    <>
      {/* Line pickers */}
      <div className="absolute left-[12px] top-[12px] bottom-[12px] w-[280px] flex flex-col gap-[8px]" role="group" aria-label="Chart line styles">
        <div className="text-[12px] font-semibold">On the chart</div>
        {CHART_ITEMS.map((it, n) => (
          <button
            key={it.line}
            type="button"
            aria-pressed={sel === n}
            onClick={() => setSel(n)}
            className="flex-1 flex items-center gap-[12px] px-[12px] rounded-[12px] cursor-pointer text-jet-black text-left bg-white"
            style={{ border: sel === n ? "3px solid #0e1114" : "1.5px solid #e3e6ea" }}
          >
            <span aria-hidden="true" className="shrink-0 w-[40px] h-[40px] box-border rounded-full" style={{ border: it.swatch }} />
            <span className="text-[14px] font-semibold">{it.line}</span>
          </button>
        ))}
      </div>
      {/* Side profile */}
      <div className="absolute left-[304px] top-[12px] right-[12px] bottom-[12px] rounded-[10px] bg-white overflow-hidden">
        <div className="absolute left-[12px] top-[10px] right-[12px] flex flex-col items-start gap-[6px]">
          <span className="text-[12px] font-semibold">In the sky, seen from the side</span>
          <span className="text-[20px] font-semibold">{s.cls}</span>
          {s.auth ? (
            <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-white text-jet-black border-2 border-jet-black text-[14px] font-semibold">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2" strokeLinecap="round">
                <rect x="3.5" y="7" width="9" height="6.5" rx="1" />
                <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
              </svg>
              <span>Authorization needed</span>
            </div>
          ) : (
            <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-volt-green text-jet-black text-[14px] font-semibold">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.2 3.2L13 5" />
              </svg>
              <span>No authorization needed</span>
            </div>
          )}
        </div>
        {/* Surface */}
        <div className="absolute left-0 right-0 bottom-0 h-[44px] bg-divider-gray border-t-2 border-jet-black" />
        <div className="absolute left-[12px] bottom-[14px] text-[11px]">Surface</div>
        {/* Airspace shape */}
        {s.rects.map((r, idx) => (
          <div
            key={idx}
            className="absolute box-border"
            style={{ left: r.l, bottom: r.b, width: r.w, height: r.h, border: r.bd, borderBottom: r.bb, background: r.bg }}
          />
        ))}
        {s.below && (
          <div className="absolute left-[12px] bottom-[54px] text-[12px] font-semibold text-[#33590a]">{s.below}</div>
        )}
      </div>
    </>
  );

  const controls = (
    <div className="text-[13px] text-graphite">Tap a line style to see the airspace it draws. Shapes are simplified and not to scale.</div>
  );

  return (
    <AnimationFrame
      title="Chart line to shape"
      category="Airspace"
      stage={stage}
      caption={s.cap}
      controls={controls}
      claim="Solid blue: B. Solid magenta: C. Dashed blue: D. Dashed magenta: Class E at the surface. Shaded magenta: Class E from 700 ft AGL."
      sourceLabel="FAA chart guide"
      citation="FAA Aeronautical Chart Users' Guide"
      bogeymanLine="Dashed magenta reaches the surface. Shaded magenta does not."
      liveAnnouncement={`${s.line}: ${s.cls}. ${s.cap}`}
    />
  );
}
