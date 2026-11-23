// A8 "Latitude and longitude" — pure logic for the crosshair scrub across a
// chart graticule tile between 98°00′W and 97°10′W, 35°00′N and 35°30′N.
// Ported from docs/animations/designs/A8-LatitudeAndLongitude.dc.html.
// Latitude numbers get bigger going north; in the US, longitude numbers get
// smaller going east. 60 minutes make one degree.

// x: minutes east of the 98°00′ line (slider 0–50).
// y: minutes north of the 35°00′ line (slider 0–30).

export interface LatLongState {
  lat: string;
  lon: string;
  readout: string;
  xText: string;
  yText: string;
  caption: string;
}

const pad = (n: number) => (n < 10 ? "0" : "") + n;

export function latLongState(x: number, y: number): LatLongState {
  const lonTotal = 98 * 60 - x;
  const lonD = Math.floor(lonTotal / 60);
  const lonM = lonTotal % 60;
  const lat = "35°" + pad(y) + "′ N";
  const lon = lonD + "°" + pad(lonM) + "′ W";
  const fromLine = x <= 30 ? x + " minutes east of the 98° line" : x - 30 + " minutes east of the 97°30′ line";
  return {
    lat,
    lon,
    readout: lat + ", " + lon,
    xText: "longitude " + lonD + " degrees " + lonM + " minutes west",
    yText: "latitude 35 degrees " + y + " minutes north",
    caption:
      "Latitude: " +
      y +
      " ticks north of the 35° line, so " +
      lat +
      ". Longitude: " +
      fromLine +
      ", and going east the number goes down, so " +
      lon +
      ".",
  };
}
