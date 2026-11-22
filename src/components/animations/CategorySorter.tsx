"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { DRONES, CATEGORY_TESTS, sorterFeedback } from "./logic/categorySorter";

// R6 — "Category sorter" pick animation.
// Layout and copy ported from docs/animations/designs/R6-CategorySorter.dc.html.

export default function CategorySorter() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(0);

  const d = DRONES[i];
  const { right, feedback } = sorterFeedback(i, pick);

  const stage = (
    <div className="w-full h-full box-border p-[16px] flex flex-col gap-[14px]">
      {/* Spec card */}
      <div className="flex items-center gap-[16px] px-[16px] py-[12px] rounded-[12px] bg-mist-blue">
        <div className="shrink-0">
          <Drone size={110} />
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="text-[14px] font-semibold">Drone {i + 1} of 4</div>
          <div className="flex flex-wrap gap-[8px]">
            {d.chips.map((c) => (
              <span key={c} className="text-[13px] px-[10px] py-[4px] border-[1.5px] border-jet-black rounded-full bg-white">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Category bins */}
      <div className="grid grid-cols-4 gap-[12px] grow" role="group" aria-label="Pick a category">
        {[1, 2, 3, 4].map((n) => {
          const mine = pick === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={mine}
              onClick={() => setPick(n)}
              className="flex flex-col items-start text-left gap-[6px] p-[12px] rounded-[12px] cursor-pointer text-jet-black"
              style={{
                border: mine && right ? "2px solid #7fbf2e" : mine ? "2px dashed #b42318" : "2px solid #0e1114",
                background: mine && right ? "#eaf6d8" : "#FFFFFF",
              }}
            >
              <span className="text-[17px] font-semibold">Category {n}</span>
              <span className="text-[13px] leading-[1.35]">{CATEGORY_TESTS[n - 1]}</span>
              <span className="mt-auto text-[13px] font-semibold" style={{ color: mine && right ? "#33590a" : "#b42318" }}>
                {mine && right ? "Correct" : mine ? "Not this one" : ""}
              </span>
            </button>
          );
        })}
      </div>
      {/* Feedback */}
      <div
        className="min-h-[44px] flex items-center px-[12px] py-[8px] rounded-[12px] text-[14px] font-medium leading-[1.4]"
        style={{
          border: pick && right ? "2px solid #7fbf2e" : pick ? "2px dashed #b42318" : "2px solid #e3e6ea",
          color: pick && !right ? "#b42318" : "#0e1114",
          background: pick && right ? "#eaf6d8" : "#FFFFFF",
        }}
      >
        {feedback}
      </div>
    </div>
  );

  const controls = (
    <>
      <span className="text-[14px] font-semibold tabular-nums">Drone {i + 1} of 4</span>
      <button
        type="button"
        onClick={() => {
          setI((i + 1) % 4);
          setPick(0);
        }}
        className="min-h-[44px] px-[16px] ml-auto rounded-full text-[14px] font-semibold cursor-pointer border-2 border-volt-green bg-volt-green text-jet-black hover:bg-volt-lime hover:border-volt-lime transition-colors"
      >
        {i === 3 ? "Start over" : "Next drone"}
      </button>
    </>
  );

  return (
    <AnimationFrame
      title="Category sorter"
      category="Regulations"
      stage={stage}
      stageBg="#FFFFFF"
      caption="Read the spec chips, then pick the category. A wrong pick tells you which requirement the drone fails."
      controls={controls}
      claim="Flight over people is allowed in four categories. No waiver is needed when the drone meets one."
      sourceLabel="Part 107 rules"
      citation="14 CFR Part 107 Subpart D"
      bogeymanLine="11 goes with Category 2, 25 with Category 3."
      liveAnnouncement={feedback}
    />
  );
}
