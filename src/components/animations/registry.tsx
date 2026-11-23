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
const Groundspeed = dynamic(() => import("./Groundspeed"));
const AlcoholGates = dynamic(() => import("./AlcoholGates"));
const LatLong = dynamic(() => import("./LatLong"));
const LineOfSight = dynamic(() => import("./LineOfSight"));
const OverPeople = dynamic(() => import("./OverPeople"));
const ReportOrNot = dynamic(() => import("./ReportOrNot"));
const MovingVehicle = dynamic(() => import("./MovingVehicle"));
const NightLights = dynamic(() => import("./NightLights"));
const LostLink = dynamic(() => import("./LostLink"));
const NightIllusions = dynamic(() => import("./NightIllusions"));
const PreflightWalkaround = dynamic(() => import("./PreflightWalkaround"));
const Laanc = dynamic(() => import("./Laanc"));
const SpecialUse = dynamic(() => import("./SpecialUse"));
const TfrMtr = dynamic(() => import("./TfrMtr"));
const MetarTour = dynamic(() => import("./MetarTour"));
const BatteryFailure = dynamic(() => import("./BatteryFailure"));
const NightVision = dynamic(() => import("./NightVision"));
const RegistrationAndMarking = dynamic(() => import("./RegistrationAndMarking"));
const RightOfWay = dynamic(() => import("./RightOfWay"));
const CertificateTimeline = dynamic(() => import("./CertificateTimeline"));
const InvisibleHazards = dynamic(() => import("./InvisibleHazards"));
const TafTimeline = dynamic(() => import("./TafTimeline"));
const DensityAltitude = dynamic(() => import("./DensityAltitude"));
const StableVsUnstable = dynamic(() => import("./StableVsUnstable"));
const ThunderstormLifeCycle = dynamic(() => import("./ThunderstormLifeCycle"));
const WindAroundObstacles = dynamic(() => import("./WindAroundObstacles"));
const HowFogForms = dynamic(() => import("./HowFogForms"));
const FrontsInCrossSection = dynamic(() => import("./FrontsInCrossSection"));
const CenterOfGravity = dynamic(() => import("./CenterOfGravity"));
const AngleOfAttackAndStall = dynamic(() => import("./AngleOfAttackAndStall"));
const HeavyHotAndHigh = dynamic(() => import("./HeavyHotAndHigh"));
const RunwayNumbersAndSigns = dynamic(() => import("./RunwayNumbersAndSigns"));
const BuildACtafCall = dynamic(() => import("./BuildACtafCall"));
const HazardousAttitudes = dynamic(() => import("./HazardousAttitudes"));
const RiskCheckOnAJob = dynamic(() => import("./RiskCheckOnAJob"));
const AirportLighting = dynamic(() => import("./AirportLighting"));
const RadioLineOfSight = dynamic(() => import("./RadioLineOfSight"));

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
  "anim-groundspeed": Groundspeed,
  "anim-alcohol-gates": AlcoholGates,
  "anim-lat-long": LatLong,
  "anim-line-of-sight": LineOfSight,
  "anim-over-people": OverPeople,
  "anim-report-or-not": ReportOrNot,
  "anim-moving-vehicle": MovingVehicle,
  "anim-night-lights": NightLights,
  "anim-lost-link": LostLink,
  "anim-night-illusions": NightIllusions,
  "anim-preflight": PreflightWalkaround,
  "anim-laanc": Laanc,
  "anim-special-use": SpecialUse,
  "anim-tfr-mtr": TfrMtr,
  "anim-metar-tour": MetarTour,
  "anim-battery-failure": BatteryFailure,
  "anim-night-vision": NightVision,
  "anim-registration": RegistrationAndMarking,
  "anim-right-of-way": RightOfWay,
  "anim-certificate-timeline": CertificateTimeline,
  "anim-invisible-hazards": InvisibleHazards,
  "anim-taf-timeline": TafTimeline,
  "anim-density-altitude": DensityAltitude,
  "anim-stable-unstable": StableVsUnstable,
  "anim-thunderstorm": ThunderstormLifeCycle,
  "anim-wind-obstacles": WindAroundObstacles,
  "anim-fog": HowFogForms,
  "anim-fronts": FrontsInCrossSection,
  "anim-center-of-gravity": CenterOfGravity,
  "anim-angle-of-attack": AngleOfAttackAndStall,
  "anim-heavy-hot-high": HeavyHotAndHigh,
  "anim-runway-signs": RunwayNumbersAndSigns,
  "anim-ctaf-call": BuildACtafCall,
  "anim-hazardous-attitudes": HazardousAttitudes,
  "anim-risk-loop": RiskCheckOnAJob,
  "anim-airport-lighting": AirportLighting,
  "anim-radio-los": RadioLineOfSight,
};
