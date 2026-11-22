// R4 "Day, twilight, night" — pure logic, ported from
// docs/animations/designs/R4-DayTwilightNight.dc.html. Do not re-derive.
// Example day: sunrise 6:30 a.m. (390), sunset 7:30 p.m. (1170), minutes from midnight.

export interface DayNightState {
  period: "Day" | "Civil twilight" | "Night";
  sky: string;
  lightRequired: boolean;
  trainingRequired: boolean;
  caption: string;
  clock: string;
  sunFrac: number;
}

export function dayNightState(t: number): DayNightState {
  let period: DayNightState["period"], sky, caption, light, train;
  if (t >= 390 && t < 1170) {
    period = "Day";
    sky = "#e7f2f8"; // mist-blue
    light = false;
    train = false;
    caption = "Daylight. No lighting requirement.";
  } else if ((t >= 360 && t < 390) || (t >= 1170 && t < 1200)) {
    period = "Civil twilight";
    sky = "#6fa6c6"; // deep-ice-blue
    light = true;
    train = false;
    caption =
      "Civil twilight is the 30 minutes before official sunrise and after official sunset. The anti-collision light must be on and visible for 3 statute miles.";
  } else {
    period = "Night";
    sky = "#0e1114"; // jet-black
    light = true;
    train = true;
    caption =
      "Night. The light stays on, and the remote pilot must have completed the initial test or training after April 6, 2021.";
  }
  const h24 = Math.floor(t / 60);
  const m = t % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const clock = h12 + ":" + (m < 10 ? "0" + m : m) + (h24 < 12 ? " a.m." : " p.m.");
  const sunFrac = Math.min(1, Math.max(0, (t - 390) / 780));
  return { period, sky, lightRequired: light, trainingRequired: train, caption, clock, sunFrac };
}
