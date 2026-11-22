"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Shared 6-beat loop chassis for A1/O1, ported from the design files:
// auto-advance every 2600 ms, stop on the last beat; Back/Next pause;
// with reduced motion, start on the last beat and do not auto-advance.
export function useBeatLoop(totalBeats = 6, intervalMs = 2600) {
  const reducedMotion = useReducedMotion();
  const [beat, setBeat] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // useReducedMotion resolves on the client; apply the design's
  // reduced-motion start state once it is known.
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    if (reducedMotion) {
      setBeat(totalBeats);
      setPlaying(false);
    }
  }, [reducedMotion, initialized, totalBeats]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setBeat((b) => {
        if (b >= totalBeats) {
          setPlaying(false);
          return b;
        }
        return b + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [playing, totalBeats, intervalMs]);

  return {
    beat,
    playing,
    toggle: () => {
      if (!playing && beat >= totalBeats) {
        setBeat(1);
        setPlaying(true);
      } else {
        setPlaying(!playing);
      }
    },
    replay: () => {
      setBeat(1);
      setPlaying(true);
    },
    prev: () => {
      setBeat(Math.max(1, beat - 1));
      setPlaying(false);
    },
    next: () => {
      setBeat(Math.min(totalBeats, beat + 1));
      setPlaying(false);
    },
  };
}
