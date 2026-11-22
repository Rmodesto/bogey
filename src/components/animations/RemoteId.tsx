"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { REMOTE_ID_MODES, REMOTE_ID_MODE_LABELS } from "./logic/remoteId";

// R8 — "Remote ID broadcast" pick animation.
// Layout and copy ported from docs/animations/designs/R8-RemoteID.dc.html.

export default function RemoteId() {
  const [mode, setMode] = useState(0);

  const s = REMOTE_ID_MODES[mode];
  const pulseOpacity = mode === 2 ? 0 : 1;
  const friaOpacity = mode === 2 ? 1 : 0;

  const stage = (
    <>
      <style jsx global>{`
        @keyframes ring {
          0% {
            transform: scale(0.25);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .ring {
          animation: ring 2.4s linear infinite;
        }
        .ring2 {
          animation-delay: 0.8s;
        }
        .ring3 {
          animation-delay: 1.6s;
        }
        @media (prefers-reduced-motion: reduce) {
          .ring {
            animation: none;
            opacity: 0.5;
          }
          .ring2 {
            transform: scale(0.66);
          }
          .ring3 {
            transform: scale(0.33);
          }
        }
      `}</style>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* FRIA zone */}
      <div
        className="absolute left-[30px] bottom-[56px] w-[250px] h-[250px] box-border border-[2.5px] border-dashed border-[#4f7d14] bg-volt-lime/10"
        style={{ opacity: friaOpacity, transition: "opacity 0.3s linear" }}
      />
      <div
        className="absolute left-[38px] bottom-[284px] text-[12px] font-semibold text-[#33590a] bg-white px-[4px] rounded-[3px]"
        style={{ opacity: friaOpacity }}
      >
        FAA-recognized identification area
      </div>
      {/* Broadcast rings */}
      <div aria-hidden="true" className="absolute left-[62px] bottom-[150px] w-[180px] h-[180px]" style={{ opacity: pulseOpacity }}>
        {["", "ring2", "ring3"].map((extra) => (
          <div
            key={extra || "ring1"}
            className={`ring ${extra} absolute left-0 top-0 w-[180px] h-[180px] box-border rounded-full border-2 border-deep-ice-blue`}
          />
        ))}
      </div>
      {/* Drone */}
      <div className="absolute left-[120px] bottom-[228px] w-[64px] h-[24px]">
        <div className="absolute left-[-12px] bottom-0">
          <Drone />
        </div>
      </div>
      {/* Add-on module chip */}
      <div
        className="absolute left-[132px] bottom-[212px] w-[40px] h-[12px] rounded-[3px] bg-volt-green border-[1.5px] border-jet-black"
        style={{ opacity: mode === 1 ? 1 : 0 }}
      />
      <div className="absolute left-[96px] bottom-[190px] w-[112px] text-center text-[12px] font-semibold">{s.drone}</div>
      {/* Remote pilot */}
      <div className="absolute left-[70px] bottom-[56px] w-[14px] h-[40px] rounded-t-[7px] bg-jet-black" />
      <div className="absolute left-[66px] bottom-[96px] w-[22px] h-[22px] rounded-full bg-[#f0d6b4] border-2 border-jet-black box-border" />
      <div className="absolute left-[20px] bottom-[30px] text-[12px]">Remote pilot</div>
      {/* Bystander with phone */}
      <div className="absolute left-[250px] bottom-[56px] w-[14px] h-[40px] rounded-t-[7px] bg-slate" style={{ opacity: pulseOpacity }} />
      <div
        className="absolute left-[268px] bottom-[76px] w-[12px] h-[20px] rounded-[3px] bg-white border-2 border-jet-black box-border"
        style={{ opacity: pulseOpacity }}
      />
      <div className="absolute left-[170px] bottom-[30px] text-[12px]" style={{ opacity: pulseOpacity }}>
        A nearby phone receives the broadcast
      </div>
      {/* Broadcast contents panel */}
      <div className="absolute right-[12px] top-[12px] bottom-[68px] w-[330px] p-[12px] box-border bg-white rounded-[10px] flex flex-col gap-[6px]">
        <div className="text-[13px] font-semibold">{s.title}</div>
        {s.tags.map((g) => (
          <div
            key={g.label}
            className="text-[13px] px-[10px] py-[5px] rounded-[8px]"
            style={{
              border: g.highlight ? "2px solid #7fbf2e" : "1.5px solid #e3e6ea",
              background: g.highlight ? "#eaf6d8" : "#FFFFFF",
              fontWeight: g.highlight ? 600 : 400,
            }}
          >
            {g.label}
          </div>
        ))}
        <div className="mt-auto text-[12px] leading-[1.4] text-graphite">{s.note}</div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-wrap gap-[8px]" role="group" aria-label="Remote ID compliance mode">
      {REMOTE_ID_MODE_LABELS.map((l, n) => (
        <button
          key={l}
          type="button"
          aria-pressed={mode === n}
          onClick={() => setMode(n)}
          className={`min-h-[44px] px-[16px] rounded-full text-[14px] font-semibold cursor-pointer border-2 border-jet-black transition-colors ${
            mode === n ? "bg-jet-black text-white" : "bg-white text-jet-black"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <AnimationFrame
      title="Remote ID broadcast"
      category="Regulations"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Three ways to comply: built in, an add-on broadcast module, or flying inside an FAA-recognized identification area."
      sourceLabel="Remote ID rules"
      citation="14 CFR Part 89"
      bogeymanLine="It is a local radio broadcast. Not internet tracking, and not ADS-B."
      liveAnnouncement={`${REMOTE_ID_MODE_LABELS[mode]}. ${s.caption}`}
    />
  );
}
