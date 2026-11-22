// L1 "Bank angle and load factor" — pure logic, ported from
// docs/animations/designs/L1-LoadFactor.dc.html. Do not re-derive.
// TODO(verify): load-factor values per bank angle cited to the Pilot's
// Handbook (FAA-H-8083-25); pending a check against the source.

export interface LoadFactorState {
  lf: string;
  load: string;
  lfNumber: number;
  caption: string;
}

export function loadFactorState(bank: number): LoadFactorState {
  const lf = 1 / Math.cos((bank * Math.PI) / 180);
  const load = (10 * lf).toFixed(1);
  return {
    lf: lf.toFixed(2),
    load,
    lfNumber: lf,
    caption:
      bank === 0
        ? "Wings level: the wing supports the aircraft weight and nothing more, 1 G."
        : "At " + bank + "° of bank in a level turn, the wing of a 10 lb aircraft supports about " + load + " lb.",
  };
}
