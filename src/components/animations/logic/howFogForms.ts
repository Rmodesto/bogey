// W8 "How fog forms" — pure logic for the hours-after-sunset scrub.
// Ported from docs/animations/designs/W8-HowFogForms.dc.html. Do not re-derive.
// Temperature starts at 22°C at sunset and falls 1° per hour to the 14°C dew
// point; the fog layer thickens as the spread closes below 5°.

export interface FogFormsState {
  h: number;
  hText: string;
  temp: number;
  spread: number;
  mx: number; // graph cursor x in stage px
  fog: number; // fog layer opacity
  legal: boolean; // "Fog unlikely" badge
  notLegal: boolean;
  fogWord: string; // red badge text: "Fog likely" or "Fog"
  caption: string;
}

export function fogFormsState(h: number): FogFormsState {
  const temp = Math.max(14, 22 - h);
  const spread = temp - 14;
  let caption;
  let word = "";
  if (spread >= 5)
    caption =
      "The ground is cooling after sunset. The temperature is still " +
      spread +
      "° above the dew point, so the air is not close to saturated.";
  else if (spread >= 3) caption = "The spread is down to " + spread + "° and still closing. Fog is not here yet, but it is coming.";
  else if (spread >= 1) {
    caption = "A spread of " + spread + "° and closing: fog or low cloud is likely.";
    word = "Fog likely";
  } else {
    caption = "Temperature has met the dew point. The air is saturated and fog has formed.";
    word = "Fog";
  }
  return {
    h,
    hText: h + " hours after sunset, spread " + spread + " degrees",
    temp,
    spread,
    mx: 60 + h * 30,
    fog: spread >= 5 ? 0 : (5 - spread) * 0.17,
    legal: spread >= 3,
    notLegal: spread < 3,
    fogWord: word,
    caption,
  };
}
