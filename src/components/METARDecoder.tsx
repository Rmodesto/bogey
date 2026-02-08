"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Clock, Wind, Eye, CloudRain, Cloud, Thermometer } from "lucide-react";

interface DecodedField {
  icon: typeof MapPin;
  label: string;
  raw: string;
  value: string;
  description: string;
}

function decodeMetar(metar: string): DecodedField[] {
  const parts = metar.trim().split(/\s+/);
  const fields: DecodedField[] = [];

  if (parts.length >= 1) {
    fields.push({
      icon: MapPin,
      label: "Station",
      raw: parts[0],
      value: parts[0],
      description: `Weather observation station identifier (ICAO code)`,
    });
  }
  if (parts.length >= 2) {
    const dt = parts[1];
    const day = dt.slice(0, 2);
    const hour = dt.slice(2, 4);
    const min = dt.slice(4, 6);
    fields.push({
      icon: Clock,
      label: "Date/Time",
      raw: dt,
      value: `Day ${day}, ${hour}:${min} UTC`,
      description: "Observation date and time in Zulu (UTC)",
    });
  }
  if (parts.length >= 3) {
    const w = parts[2];
    const dir = w.slice(0, 3);
    const speed = w.slice(3, 5);
    const unit = w.includes("G") ? `gusting ${w.split("G")[1].replace("KT", "")}` : "";
    fields.push({
      icon: Wind,
      label: "Wind",
      raw: w,
      value: `${dir}° at ${parseInt(speed)} knots ${unit}`.trim(),
      description: "Wind direction (true north) and speed in knots",
    });
  }
  if (parts.length >= 4) {
    fields.push({
      icon: Eye,
      label: "Visibility",
      raw: parts[3],
      value: `${parts[3].replace("SM", "")} statute miles`,
      description: "Prevailing visibility in statute miles",
    });
  }
  // Weather phenomena
  const wxIdx = parts.findIndex((p) => /^[-+]?(RA|SN|FG|BR|HZ|TS|DZ|SH)/.test(p));
  if (wxIdx !== -1) {
    const wx = parts[wxIdx];
    const intensity = wx.startsWith("-") ? "Light" : wx.startsWith("+") ? "Heavy" : "Moderate";
    fields.push({
      icon: CloudRain,
      label: "Weather",
      raw: wx,
      value: `${intensity} precipitation`,
      description: "Current weather phenomena at the station",
    });
  }
  // Clouds
  const cloudParts = parts.filter((p) => /^(FEW|SCT|BKN|OVC|CLR|SKC)\d*/.test(p));
  if (cloudParts.length > 0) {
    const decoded = cloudParts
      .map((c) => {
        const type = c.slice(0, 3);
        const alt = parseInt(c.slice(3)) * 100;
        const names: Record<string, string> = { FEW: "Few", SCT: "Scattered", BKN: "Broken", OVC: "Overcast", CLR: "Clear", SKC: "Clear" };
        return `${names[type] ?? type} at ${alt.toLocaleString()} ft`;
      })
      .join(", ");
    fields.push({
      icon: Cloud,
      label: "Clouds",
      raw: cloudParts.join(" "),
      value: decoded,
      description: "Cloud coverage and ceiling heights in feet AGL",
    });
  }
  // Temp/Dewpoint
  const tempPart = parts.find((p) => /^M?\d{2}\/M?\d{2}$/.test(p));
  if (tempPart) {
    const [t, d] = tempPart.split("/").map((v) => {
      const neg = v.startsWith("M");
      return (neg ? "-" : "") + parseInt(v.replace("M", ""));
    });
    fields.push({
      icon: Thermometer,
      label: "Temp/Dew",
      raw: tempPart,
      value: `${t}°C / ${d}°C`,
      description: "Temperature and dewpoint in Celsius. Close values indicate fog potential.",
    });
  }

  return fields;
}

const staggerDelays = [89, 144, 233, 377, 610, 987, 1597];

export default function METARDecoder({
  metarString,
  autoReveal = true,
  interactive = true,
  onComplete,
}: {
  metarString: string;
  autoReveal?: boolean;
  interactive?: boolean;
  onComplete?: () => void;
}) {
  const fields = decodeMetar(metarString);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-[610px] w-full bg-mist-blue rounded-[13px] p-[34px] border-2 border-ice-blue">
      {/* Raw METAR */}
      <div className="bg-graphite text-volt-green font-mono text-[15px] tracking-wider p-[21px] rounded-[8px] mb-[21px] overflow-x-auto">
        {metarString}
      </div>

      {/* Decoded cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[13px]">
        {fields.map((field, i) => {
          const Icon = field.icon;
          const isExpanded = expanded === field.label;
          return (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 13 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: autoReveal ? staggerDelays[i] / 1000 : 0 }}
              className={`bg-white border border-ice-blue rounded-[8px] p-[13px] ${
                interactive ? "cursor-pointer hover:border-deep-ice-blue" : ""
              } ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              onClick={() => {
                if (!interactive) return;
                setExpanded(isExpanded ? null : field.label);
                if (i === fields.length - 1) onComplete?.();
              }}
            >
              <div className="flex items-center gap-[8px] mb-[8px]">
                <Icon className="w-4 h-4 text-deep-ice-blue shrink-0" />
                <span className="text-xs text-slate font-medium">{field.label}</span>
              </div>
              <p className="font-mono text-sm text-jet-black mb-[4px]">{field.raw}</p>
              <p className="text-xs text-slate">{field.value}</p>
              {isExpanded && (
                <p className="text-xs text-slate mt-[8px] pt-[8px] border-t border-divider-gray">
                  {field.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
