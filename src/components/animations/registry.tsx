"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import AirspaceVisualizer from "@/components/AirspaceVisualizer";
import METARDecoder from "@/components/METARDecoder";

// Maps a LessonSection visualizer type to its component. Animation components
// load with next/dynamic so they stay out of the lesson page's first load.
// Types must match the VisualizerConfigSchema enum in src/lib/part107/schema.ts.

const AltitudeLimit = dynamic(() => import("./AltitudeLimit"));

function MetarDefault() {
  return <METARDecoder metarString="KMCO 121853Z 09008KT 10SM -RA SCT025 BKN040 18/14 A2990" />;
}

export const VISUALIZER_REGISTRY: Record<string, ComponentType> = {
  airspace: AirspaceVisualizer,
  metar: MetarDefault,
  "anim-altitude-limit": AltitudeLimit,
};
