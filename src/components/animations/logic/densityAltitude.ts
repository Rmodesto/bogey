// W4 "Density altitude" — pure logic for the elevation + temperature scrub.
// Ported from docs/animations/designs/W4-DensityAltitude.dc.html. Do not re-derive.
// The density-altitude sum is the lesson's formula: pressure altitude +
// 120 x (temperature minus standard temperature), with standard temperature
// 15°C at sea level falling 2°C per 1,000 ft.

export interface DensityAltitudeState {
  e: number;
  t: number;
  eText: string;
  tText: string;
  elevText: string;
  daText: string;
  std: number;
  da: number;
  feel: string;
  dot: string; // air-molecule background-size, px  // ILLUSTRATIVE
  perf: number; // climb-and-lift bar percent        // ILLUSTRATIVE
  perfW: string;
  perfFill: string;
  dB: number; // drone bottom offset in stage px     // ILLUSTRATIVE
  caption: string;
}

// The design's number format: U+2212 minus, en-US thousands separators.
const fmt = (n: number) => (n < 0 ? "−" : "") + Math.abs(n).toLocaleString("en-US");

export function densityAltitudeState(e: number, t: number): DensityAltitudeState {
  const std = 15 - (2 * e) / 1000;
  const da = Math.round(e + 120 * (t - std));
  // ILLUSTRATIVE: the bar and molecule spacing show direction, not real figures.
  const perf = Math.max(8, Math.min(100, 100 - da / 140));
  const diff = da - e;
  return {
    e,
    t,
    eText: e + " feet elevation",
    tText: t + " degrees Celsius",
    elevText: fmt(e),
    daText: fmt(da),
    std,
    da,
    feel:
      diff > 200
        ? "The drone performs as if it were " + fmt(diff) + " ft higher than it is."
        : diff < -200
          ? "Colder than standard: the air is denser, and performance is better."
          : "Close to standard conditions.",
    dot: Math.max(14, Math.min(46, 20 + da / 450)).toFixed(1) + "px", // ILLUSTRATIVE
    perf,
    perfW: perf + "%",
    perfFill: perf < 45 ? "#b42318" : "#9cd94a",
    dB: 70 + perf * 1.6, // ILLUSTRATIVE
    caption:
      "Pressure altitude " +
      fmt(e) +
      " ft. Standard temperature there is " +
      std +
      "°C and it is " +
      t +
      "°C, a difference of " +
      fmt(t - std) +
      "°C. " +
      fmt(e) +
      " + (120 × " +
      fmt(t - std) +
      ") = " +
      fmt(da) +
      " ft.",
  };
}
