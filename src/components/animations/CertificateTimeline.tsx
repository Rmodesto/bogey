"use client";

import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { CERTIFICATE_TIMELINE_CAPTIONS, certificateTimelineScene } from "./logic/certificateTimeline";

// R14 — "Certificate timeline" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/R14-CertificateTimeline.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function CertificateTimeline() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = certificateTimelineScene(beat);
  const caption = CERTIFICATE_TIMELINE_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Timeline */}
        <path d="M40 150H640" stroke="#0e1114" strokeWidth="3" />
        <path d="M630 142l12 8-12 8" stroke="#0e1114" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Age 14 */}
        <g style={{ opacity: o.age14, ...fade }}>
          <circle cx="100" cy="150" r="12" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
          <text x="100" y="120" fontSize="15" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Age 14
          </text>
          <text x="100" y="186" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
            May take
          </text>
          <text x="100" y="202" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
            the test
          </text>
        </g>
        {/* Age 16 */}
        <g style={{ opacity: o.age16, ...fade }}>
          <circle cx="230" cy="150" r="12" fill="#9cd94a" stroke="#0e1114" strokeWidth="2" />
          <text x="230" y="120" fontSize="15" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Age 16
          </text>
          <text x="230" y="186" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
            May hold the
          </text>
          <text x="230" y="202" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
            certificate
          </text>
        </g>
        {/* The certificate does not expire */}
        <g style={{ opacity: o.cert, ...fade }}>
          <rect x="170" y="36" width="120" height="58" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="230" y="60" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Remote Pilot
          </text>
          <text x="230" y="78" fontSize="12" fontWeight="600" fill="#33590a" textAnchor="middle">
            Does not expire
          </text>
          <path d="M290 150H640" stroke="#9cd94a" strokeWidth="9" opacity="0.6" />
        </g>
        {/* 24-calendar-month spans */}
        <g style={{ opacity: o.loop, ...fade }}>
          <path d="M230 150v70" stroke="#0e1114" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M400 150v70" stroke="#0e1114" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M570 150v70" stroke="#0e1114" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M234 240H396M388 234l8 6-8 6" stroke="#0e1114" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M404 240H566M558 234l8 6-8 6" stroke="#0e1114" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="315" y="262" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            24 calendar months
          </text>
          <text x="485" y="262" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            24 calendar months
          </text>
          <circle cx="400" cy="150" r="9" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <circle cx="570" cy="150" r="9" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        </g>
        {/* Recurrent training markers */}
        <g style={{ opacity: o.train, ...fade }}>
          <text x="400" y="124" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Recurrent training
          </text>
          <text x="570" y="124" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Recurrent training
          </text>
        </g>
      </svg>
      {/* Bottom cards */}
      <div className="absolute left-[40px] right-[40px] bottom-[30px] flex gap-[12px]">
        <div
          className="flex-1 box-border px-[12px] py-[10px] rounded-[12px] bg-volt-mist border-2 border-volt-green text-[13px] leading-[1.4]"
          style={{ opacity: o.train, ...fade }}
        >
          <span className="font-semibold">Recurrent training:</span> online and free. Not a test at a testing center.
        </div>
        <div
          className="flex-1 box-border px-[12px] py-[10px] rounded-[12px] bg-white text-[13px] leading-[1.4]"
          style={{ border: "2px dashed #b42318", color: "#b42318", opacity: o.lapse, ...fade }}
        >
          <span className="font-semibold">Training overdue:</span> you may not act as pilot in command until it is done.
        </div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Certificate timeline"
      category="Regulations"
      stage={stage}
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
      claim="The certificate never expires. Recurrent training is due every 24 calendar months."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.61; 14 CFR 107.65"
      bogeymanLine="Training, not a test. Online, and free."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
