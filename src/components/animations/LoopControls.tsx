"use client";

// Shared controls row for the 6-beat loop animations (A1, O1):
// play/pause, Replay, Back, Next, beat dots, beat label.

const pill =
  "min-h-[44px] px-[16px] rounded-full text-[14px] font-semibold cursor-pointer border-2 border-jet-black bg-white text-jet-black";

export default function LoopControls({
  beat,
  totalBeats,
  playing,
  onToggle,
  onReplay,
  onPrev,
  onNext,
}: {
  beat: number;
  totalBeats: number;
  playing: boolean;
  onToggle: () => void;
  onReplay: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-[10px] w-full">
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={onToggle}
        className="w-[44px] h-[44px] rounded-full border-2 border-volt-green bg-volt-green cursor-pointer flex items-center justify-center"
      >
        {playing ? (
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="#0e1114">
            <rect x="3" y="2" width="3.5" height="12" />
            <rect x="9.5" y="2" width="3.5" height="12" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="#0e1114">
            <path d="M4 2l10 6-10 6z" />
          </svg>
        )}
      </button>
      <button type="button" onClick={onReplay} className={pill}>
        Replay
      </button>
      <button type="button" onClick={onPrev} className={pill}>
        Back
      </button>
      <button type="button" onClick={onNext} className={pill}>
        Next
      </button>
      <div aria-hidden="true" className="flex items-center gap-[8px] ml-[8px]">
        {Array.from({ length: totalBeats }, (_, n) => n + 1).map((n) => (
          <span
            key={n}
            className="h-[10px] rounded-[5px]"
            style={{
              width: n === beat ? 22 : 10,
              background: n <= beat ? "#0e1114" : "#c3c9d0",
              transition: "width 0.3s ease",
            }}
          />
        ))}
      </div>
      <span className="ml-auto text-[13px] tabular-nums">
        Beat {beat} of {totalBeats}
      </span>
    </div>
  );
}
