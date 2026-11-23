// R14 "Certificate timeline" — pure beat data, ported from
// docs/animations/designs/R14-CertificateTimeline.dc.html. Do not re-derive.

export const CERTIFICATE_TIMELINE_CAPTIONS = [
  "At 14 you may take the knowledge test.",
  "At 16 you may hold the Remote Pilot Certificate. It is not issued before then.",
  "The certificate itself does not expire.",
  "What does run out is knowledge recency. To act as remote pilot in command, you must have tested or trained within the previous 24 calendar months.",
  "You keep current with recurrent training, which is online and free. There is no recurrent test.",
  "Let the training lapse and you may not act as pilot in command until you complete it. The certificate stays valid.",
];

export const TEST_AGE = 14;
export const CERTIFICATE_AGE = 16;
export const RECENCY_MONTHS_LABEL = "24 calendar months";

export interface CertificateTimelineScene {
  age14: number; // "Age 14, may take the test" marker (o14)
  age16: number; // "Age 16, may hold the certificate" marker (o16)
  cert: number; // certificate card + does-not-expire bar (oCert)
  loop: number; // 24-calendar-month spans and markers (oLoop)
  train: number; // "Recurrent training" labels + green card (oTrain)
  lapse: number; // "Training overdue" card (oLapse)
}

export function certificateTimelineScene(beat: number): CertificateTimelineScene {
  return {
    age14: 1,
    age16: beat >= 2 ? 1 : 0,
    cert: beat >= 3 ? 1 : 0,
    loop: beat >= 4 ? 1 : 0,
    train: beat >= 5 ? 1 : 0,
    lapse: beat >= 6 ? 1 : 0,
  };
}
