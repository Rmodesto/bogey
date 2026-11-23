"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import { latLongState } from "./logic/latLong";

// A8 — "Latitude and longitude" scrub animation. A chart tile spans 98°00′W
// to 97°10′W and 35°00′N to 35°30′N; two sliders walk a red crosshair one
// minute per tick, east and north.
// Geometry and copy ported from docs/animations/designs/A8-LatitudeAndLongitude.dc.html.

// The map rect: x 100–600 (10 px per minute of longitude), y 50–350
// (10 px per minute of latitude, north up).
const MAP_L = 100;
const MAP_R = 600;
const MAP_T = 50;
const MAP_B = 350;

// Minute ticks along the top and bottom edges: degree lines get 20-long
// ticks, every 5th minute 14, the rest 8 — matching the design artboard.
function edgeTickPath(): string {
  const d: string[] = [];
  for (let x = MAP_L; x <= MAP_R; x += 10) {
    if (x % 100 === 0) d.push(`M${x} 40v20`, `M${x} 340v20`);
    else if (x % 50 === 0) d.push(`M${x} 43v14`, `M${x} 343v14`);
    else d.push(`M${x} 46v8`, `M${x} 346v8`);
  }
  for (let y = MAP_T; y <= MAP_B; y += 10) {
    if (y % 100 === 50) d.push(`M90 ${y}h20`, `M390 ${y}h20`);
    else if (y % 50 === 0) d.push(`M93 ${y}h14`, `M393 ${y}h14`);
    else d.push(`M96 ${y}h8`, `M396 ${y}h8`);
  }
  return d.join("");
}
const TICKS_D = edgeTickPath();

export default function LatLong() {
  // x: minutes east of the 98° line; y: minutes north of the 35° line.
  const [x, setX] = useState(18);
  const [y, setY] = useState(12);
  const reducedMotion = useReducedMotion();

  const s = latLongState(x, y);
  const cx = MAP_L + x * 10;
  const cy = MAP_B - y * 10;
  const crossTransition = reducedMotion ? "none" : "left 0.1s linear, top 0.1s linear";

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        <rect x="100" y="50" width="500" height="300" fill="#FFFFFF" />
        <path d="M200 50v300M300 50v300M500 50v300M100 250h500M100 150h500" stroke="#e3e6ea" strokeWidth="1" />
        <path d="M100 50v300M400 50v300M100 350h500M100 50h500" stroke="#0e1114" strokeWidth="1.8" />
        <path d={TICKS_D} stroke="#0e1114" strokeWidth="1" />
        <text x="100" y="376" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          98°00′ W
        </text>
        <text x="400" y="376" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          97°30′ W
        </text>
        <text x="590" y="376" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          97°10′
        </text>
        <text x="92" y="354" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="end">
          35°00′ N
        </text>
        <text x="92" y="54" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="end">
          35°30′ N
        </text>
        <text x="350" y="400" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Longitude: the number gets smaller going east →
        </text>
        <path
          d="M34 300V110M28 120l6-10 6 10"
          stroke="#0e1114"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="24" y="205" fontSize="12" fill="#0e1114" textAnchor="middle" transform="rotate(-90 24 205)">
          Latitude: bigger going north
        </text>
      </svg>
      {/* Crosshair */}
      <div
        aria-hidden="true"
        className="absolute top-[50px] h-[300px] border-l-2 border-[#b42318]"
        style={{ left: cx, transition: reducedMotion ? "none" : "left 0.1s linear" }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[100px] w-[500px] border-t-2 border-[#b42318]"
        style={{ top: cy, transition: reducedMotion ? "none" : "top 0.1s linear" }}
      />
      <div
        aria-hidden="true"
        className="absolute w-[18px] h-[18px] mt-[-8px] ml-[-8px] rounded-full border-2 border-[#b42318] bg-white"
        style={{ left: cx, top: cy, transition: crossTransition }}
      />
      {/* Readout */}
      <div className="absolute left-[110px] top-[12px] text-[20px] font-semibold tabular-nums bg-white px-[6px] rounded-[3px]">
        {s.readout}
      </div>
      <div className="absolute right-[14px] top-[16px] text-[12px]">Each tick is 1 minute</div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="a8-x" className="text-[13px] font-semibold">
          Move west or east: {s.lon}
        </label>
        <input
          id="a8-x"
          type="range"
          min={0}
          max={50}
          step={1}
          value={x}
          aria-valuetext={s.xText}
          onChange={(e) => setX(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="a8-y" className="text-[13px] font-semibold">
          Move south or north: {s.lat}
        </label>
        <input
          id="a8-y"
          type="range"
          min={0}
          max={30}
          step={1}
          value={y}
          aria-valuetext={s.yText}
          onChange={(e) => setY(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Latitude and longitude"
      category="Airspace"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Latitude counts up going north. In the United States, longitude counts up going west. 60 minutes make one degree."
      sourceLabel="FAA chart guide"
      citation="FAA Aeronautical Chart Users' Guide"
      bogeymanLine="Find the labeled line first, then count the ticks the right way."
      liveAnnouncement={`${s.yText}, ${s.xText}. ${s.caption}`}
    />
  );
}
