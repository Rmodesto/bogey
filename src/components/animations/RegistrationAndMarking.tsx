"use client";

import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import {
  REGISTRATION_CAPTIONS,
  REGISTRATION_NUMBER,
  REGISTRATION_WEIGHT_LABEL,
  registrationScene,
} from "./logic/registrationAndMarking";

// R10 — "Registration and marking" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/R10-RegistrationAndMarking.dc.html.
// TODO(verify): the 3-year registration period and the external-marking rule,
// pending a check against 14 CFR Part 48.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function RegistrationAndMarking() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const o = registrationScene(beat);
  const caption = REGISTRATION_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Ground */}
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        {/* Scale */}
        <rect x="70" y="300" width="250" height="64" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <rect x="56" y="288" width="278" height="14" rx="4" fill="#2b2f33" />
        <rect x="150" y="316" width="90" height="32" rx="5" fill="#0e1114" />
        <text x="195" y="338" fontSize="15" fontWeight="600" fill="#9cd94a" textAnchor="middle">
          {REGISTRATION_WEIGHT_LABEL}
        </text>
        <text x="195" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Scale
        </text>
        {/* The drone on the scale */}
        <g transform="translate(85 188)">
          <Drone size={220} />
        </g>
        {/* Registration number on an outside surface */}
        <g style={{ opacity: o.num, ...fade }}>
          <rect x="158" y="236" width="74" height="18" rx="3" fill="#FFFFFF" stroke="#0e1114" strokeWidth="1.5" />
          <text x="195" y="249" fontSize="10" fontWeight="700" fill="#0e1114" textAnchor="middle">
            {REGISTRATION_NUMBER}
          </text>
          <path d="M232 245h52" stroke="#0e1114" strokeWidth="1.5" />
          <text x="288" y="241" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            On an outside
          </text>
          <text x="288" y="256" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            surface, legible
          </text>
        </g>
        {/* Battery-bay callout */}
        <g style={{ opacity: o.bay, ...fade }}>
          <rect x="96" y="120" width="120" height="50" rx="6" fill="#FFFFFF" stroke="#b42318" strokeWidth="2" strokeDasharray="6 5" />
          <text x="156" y="141" fontSize="11" fontWeight="600" fill="#b42318" textAnchor="middle">
            Inside the battery
          </text>
          <text x="156" y="156" fontSize="11" fontWeight="600" fill="#b42318" textAnchor="middle">
            bay: does not count
          </text>
        </g>
      </svg>
      {/* Rule cards */}
      <div className="absolute left-[380px] top-[28px] w-[270px] flex flex-col gap-[10px]">
        <div
          className="box-border px-[12px] py-[10px] rounded-[12px] bg-white border-[1.5px] border-divider-gray text-[13px] leading-[1.4]"
          style={{ opacity: o.rec, ...fade }}
        >
          <div className="font-semibold">Recreational flying only</div>
          0.55 lb or less: no registration needed.
        </div>
        <div
          className="box-border px-[12px] py-[10px] rounded-[12px] bg-graphite text-white text-[13px] leading-[1.4]"
          style={{ opacity: o.p107, ...fade }}
        >
          <div className="font-semibold text-ice-blue">Any Part 107 flight</div>
          Register it, whatever it weighs.
        </div>
        <div
          className="box-border px-[12px] py-[10px] rounded-[12px] bg-white border-2 border-jet-black text-[13px] leading-[1.4]"
          style={{ opacity: o.card, ...fade }}
        >
          <div className="font-semibold">Registration</div>
          One per aircraft. Lasts 3 years, then renew.
        </div>
        <div className="self-start" style={{ opacity: o.done, ...fade }}>
          <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-volt-green text-jet-black text-[14px] font-semibold">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3.2 3.2L13 5" />
            </svg>
            <span>Registered and marked</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Registration and marking"
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
      claim="Every drone flown under Part 107 must be registered and marked on the outside, whatever it weighs."
      sourceLabel="FAA registration rules"
      citation="14 CFR 107.13; 14 CFR Part 48"
      bogeymanLine="The 0.55-pound exception is for recreational flying only."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
