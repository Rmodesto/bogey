"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import AirspaceVisualizer from "@/components/AirspaceVisualizer";
import METARDecoder from "@/components/METARDecoder";

// Maps a LessonSection visualizer type to its component. Animation components
// load with next/dynamic so they stay out of the lesson page's first load.
// Types must match the VisualizerConfigSchema enum in src/lib/part107/schema.ts.

const AltitudeLimit = dynamic(() => import("./AltitudeLimit"));
const CloudBox = dynamic(() => import("./CloudBox"));
const DayTwilightNight = dynamic(() => import("./DayTwilightNight"));
const AglVsMsl = dynamic(() => import("./AglVsMsl"));
const CeilingToAltitude = dynamic(() => import("./CeilingToAltitude"));
const LoadFactor = dynamic(() => import("./LoadFactor"));
const CategorySorter = dynamic(() => import("./CategorySorter"));
const RemoteId = dynamic(() => import("./RemoteId"));
const ChartLineToShape = dynamic(() => import("./ChartLineToShape"));
const AirspaceStack = dynamic(() => import("./AirspaceStack"));
const TrafficPattern = dynamic(() => import("./TrafficPattern"));

function MetarDefault() {
  return <METARDecoder metarString="KMCO 121853Z 09008KT 10SM -RA SCT025 BKN040 18/14 A2990" />;
}

export const VISUALIZER_REGISTRY: Record<string, ComponentType> = {
  airspace: AirspaceVisualizer,
  metar: MetarDefault,
  "anim-altitude-limit": AltitudeLimit,
  "anim-cloud-box": CloudBox,
  "anim-day-twilight-night": DayTwilightNight,
  "anim-agl-vs-msl": AglVsMsl,
  "anim-ceiling-to-altitude": CeilingToAltitude,
  "anim-load-factor": LoadFactor,
  "anim-category-sorter": CategorySorter,
  "anim-remote-id": RemoteId,
  "anim-chart-line-to-shape": ChartLineToShape,
  "anim-airspace-stack": AirspaceStack,
  "anim-traffic-pattern": TrafficPattern,
};
