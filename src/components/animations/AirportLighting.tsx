"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { AIRPORT_LIGHTING_CAPTIONS, BEACON_ROWS, airportLightingScene } from "./logic/airportLighting";

// O11 — "Airport lighting" 6-beat loop animation on a jet-black night stage
// (stage background only; the frame stays light). One beacon pattern per
// beat, then the runway and taxiway edge lights. Every light names its color
// in words next to the dot: color is never the only signal.
// Layout and copy ported from docs/animations/designs/O11-AirportLighting.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

// Beacon dot fills by color word, as the design draws them.
const DOT_FILL: Record<string, string> = {
  White: "#FFFFFF",
  Green: "#30a46c",
  Yellow: "#f5d90a",
};

const STARS: [number, number][] = [
  [30, 20], [140, 34], [250, 14], [620, 24], [560, 60], [600, 150],
];

// Runway edge light positions, left and right of the trapezoid.
const EDGE_LIGHTS: [number, number][] = [
  [60, 300], [612, 300], [54, 320], [618, 320], [49, 340], [623, 340],
  [43, 360], [629, 360], [38, 380], [634, 380], [32, 400], [640, 400],
];

export default function AirportLighting() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = airportLightingScene(beat);
  const caption = AIRPORT_LIGHTING_CAPTIONS[beat - 1];
  const rowReveal = [o.o1, o.o2, o.o3, o.o4];

  const stage = (
    <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
      {STARS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="#8a9198" />
      ))}
      <text x="40" y="30" fontSize="12" fontWeight="600" fill="#a9cfe3" textAnchor="start">Rotating beacon</text>
      <text x="300" y="30" fontSize="12" fontWeight="600" fill="#a9cfe3" textAnchor="middle">What you see, in order</text>
      {/* One beacon pattern per beat, each color named in words */}
      {BEACON_ROWS.map((row, r) => {
        const labelY = 67 + r * 60;
        const dotY = 62 + r * 60;
        return (
          <g key={row.name} style={{ opacity: rowReveal[r], ...fade }}>
            <text x="40" y={labelY} fontSize="13" fontWeight="600" fill="#FFFFFF" textAnchor="start">{row.name}</text>
            {row.colors.map((color, c) => (
              <g key={`${row.name}-${c}`}>
                <circle cx={300 + c * 76} cy={dotY} r="13" fill={DOT_FILL[color]} opacity="0.3" />
                <circle cx={300 + c * 76} cy={dotY} r="8" fill={DOT_FILL[color]} />
                <text x={300 + c * 76} y={dotY + 30} fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="middle">
                  {color}
                </text>
              </g>
            ))}
          </g>
        );
      })}
      {/* Runway edge (white) and taxiway edge (blue) lights */}
      {/* TODO(verify): blue taxiway edge lights are not in the lesson text; the
          beacon patterns cite the AIM, which has not been opened. */}
      <g style={{ opacity: o.o5, ...fade }}>
        <path d="M60 300L612 300L640 400L32 400Z" fill="#2b2f33" />
        <path d="M336 310V396" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 10" />
        {EDGE_LIGHTS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#FFFFFF" />
        ))}
        <text x="336" y="290" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Runway edge lights: white</text>
        <circle cx="588" cy="284" r="4" fill="#3b82f6" />
        <circle cx="616" cy="284" r="4" fill="#3b82f6" />
        <text x="574" y="288" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="end">Taxiway edge: blue</text>
      </g>
    </svg>
  );

  return (
    <AnimationFrame
      title="Airport lighting"
      category="Operations"
      stage={stage}
      stageBg="#0e1114"
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
      claim="White and green: civilian airport. Two whites and a green: military."
      sourceLabel="FAA airport procedures"
      citation="AIM 2-1"
      bogeymanLine="Two quick whites means military. Give it room."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
