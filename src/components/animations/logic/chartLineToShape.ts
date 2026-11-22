// A2 "Chart line to shape" — pure item data, ported from
// docs/animations/designs/A2-ChartLineToShape.dc.html. Do not re-derive.
// TODO(verify): the chart line styles (which Class E floor each line and
// vignette means) are placeholders pending a check against the FAA
// Aeronautical Chart Users' Guide.

const BL = "#1F4E9A"; // chart-blue
const MG = "#8E1C5E"; // chart-magenta
const bF = "rgba(31,78,154,0.12)";
const mF = "rgba(142,28,94,0.12)";

export interface ChartRect {
  l: number;
  b: number;
  w: number;
  h: number;
  bd: string;
  bg: string;
  bb: string;
}

export interface ChartItem {
  line: string;
  swatch: string;
  cls: string;
  auth: boolean;
  below: string;
  cap: string;
  rects: ChartRect[];
}

const R = (l: number, b: number, w: number, h: number, bd: string, bg: string, bb?: string): ChartRect => ({
  l,
  b,
  w,
  h,
  bd,
  bg,
  bb: bb || bd,
});

export const CHART_ITEMS: ChartItem[] = [
  {
    line: "Solid blue",
    swatch: "3px solid " + BL,
    cls: "Class B",
    auth: true,
    below: "",
    cap: "Solid blue lines outline Class B: stacked tiers that widen with height around the busiest airports. Only the inner tier reaches the surface.",
    rects: [
      R(150, 44, 60, 250, "2.5px solid " + BL, bF),
      R(115, 130, 130, 164, "2.5px solid " + BL, bF),
      R(75, 210, 210, 84, "2.5px solid " + BL, bF),
    ],
  },
  {
    line: "Solid magenta",
    swatch: "3px solid " + MG,
    cls: "Class C",
    auth: true,
    below: "",
    cap: "Solid magenta lines outline Class C: an inner core from the surface and a wider shelf above it.",
    rects: [R(145, 44, 70, 190, "2.5px solid " + MG, mF), R(95, 120, 170, 114, "2.5px solid " + MG, mF)],
  },
  {
    line: "Dashed blue",
    swatch: "3px dashed " + BL,
    cls: "Class D",
    auth: true,
    below: "",
    cap: "A dashed blue line outlines Class D: a single cylinder from the surface around a smaller towered airport.",
    rects: [R(125, 44, 110, 130, "2.5px dashed " + BL, bF)],
  },
  {
    line: "Dashed magenta",
    swatch: "3px dashed " + MG,
    cls: "Class E from the surface",
    auth: true,
    below: "",
    cap: "A dashed magenta line means Class E begins at the surface. When it is designated for an airport, it needs authorization.",
    rects: [R(110, 44, 140, 150, "2.5px dashed " + MG, mF)],
  },
  {
    line: "Shaded magenta band",
    swatch: "9px solid rgba(142,28,94,0.35)",
    cls: "Class E from 700 ft AGL",
    auth: false,
    below: "Class G below 700 ft AGL",
    cap: "A soft magenta band means Class E starts at 700 ft AGL. Below it is Class G, so a drone at 400 ft AGL or lower needs no authorization.",
    rects: [R(20, 124, 320, 170, "none", mF, "6px solid rgba(142,28,94,0.4)")],
  },
];
