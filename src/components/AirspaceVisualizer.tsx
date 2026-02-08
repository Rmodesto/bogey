"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";

const layers = [
  { id: "G", label: "Class G", altitude: "Surface — 1,200 AGL", color: "bg-slate/30", h: 55, bottom: 0, description: "Uncontrolled airspace. No ATC communication required. Most Part 107 operations occur here." },
  { id: "E-lower", label: "Class E (lower)", altitude: "700/1,200 AGL — 14,500", color: "bg-ice-blue/20", h: 89, bottom: 55, description: "Controlled airspace. Part 107 operations in surface E areas require LAANC or waiver." },
  { id: "E-upper", label: "Class E (upper)", altitude: "14,500 — 17,999", color: "bg-ice-blue/25", h: 144, bottom: 144, description: "Upper Class E airspace. Extends up to but not including 18,000 MSL." },
  { id: "A", label: "Class A", altitude: "18,000 — 60,000 MSL", color: "bg-indigo-500/15", h: 233, bottom: "auto", top: 0, description: "Positive control airspace. IFR only. No Part 107 operations." },
];

const overlays = [
  { id: "B", label: "Class B", color: "bg-blue-500/20", style: { bottom: "20%", left: "35%", width: "30%", height: "40%" }, description: "Surrounds major airports. Requires ATC authorization for Part 107 ops. LAANC available at many Class B airports." },
  { id: "C", label: "Class C", color: "bg-purple-500/20", style: { bottom: "15%", left: "15%", width: "18%", height: "30%" }, description: "Surrounds airports with operational control towers and radar. Part 107 requires LAANC authorization." },
  { id: "D", label: "Class D", color: "bg-cyan-500/20", style: { bottom: "10%", left: "72%", width: "14%", height: "20%" }, description: "Surrounds airports with control towers. Extends from surface to ~2,500 AGL. LAANC authorization required for Part 107." },
];

export default function AirspaceVisualizer({
  selectedClass,
  onSelectClass,
  showLabels = true,
  interactive = true,
}: {
  selectedClass?: string;
  onSelectClass?: (cls: string) => void;
  showLabels?: boolean;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(selectedClass ?? null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleSelect = (id: string) => {
    if (!interactive) return;
    setSelected(id === selected ? null : id);
    onSelectClass?.(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !interactive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -2;
    setTilt({ x, y });
  };

  const allItems = [
    ...layers.map((l) => ({ ...l, kind: "layer" as const })),
    ...overlays.map((o) => ({ ...o, kind: "overlay" as const })),
  ];
  const selectedItem = allItems.find((i) => i.id === selected);

  return (
    <div className="flex gap-[21px] flex-col lg:flex-row">
      <div
        ref={containerRef}
        className="w-[610px] max-w-full aspect-square rounded-[13px] bg-gradient-to-b from-[#1a1f35] to-[#2a3f5f] relative overflow-hidden"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x * 2}deg) rotateY(${tilt.y * 2}deg)`,
          transition: "transform 0.1s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        {/* Horizontal layers */}
        {layers.map((layer, i) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.089 }}
            className={`absolute left-0 right-0 ${layer.color} ${
              interactive ? "cursor-pointer" : ""
            } ${hovered === layer.id ? "brightness-125 ring-1 ring-volt-green" : ""}`}
            style={{
              height: layer.h,
              ...(layer.top !== undefined ? { top: layer.top } : { bottom: layer.bottom }),
            }}
            onMouseEnter={() => setHovered(layer.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleSelect(layer.id)}
          >
            {showLabels && (
              <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-white/70 text-xs font-mono">
                {layer.label} — {layer.altitude}
              </span>
            )}
          </motion.div>
        ))}

        {/* B, C, D overlays */}
        {overlays.map((overlay, i) => (
          <motion.div
            key={overlay.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (layers.length + i) * 0.089 }}
            className={`absolute ${overlay.color} border border-white/20 rounded-[4px] ${
              interactive ? "cursor-pointer" : ""
            } ${hovered === overlay.id ? "brightness-125 ring-1 ring-volt-green" : ""}`}
            style={overlay.style}
            onMouseEnter={() => setHovered(overlay.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleSelect(overlay.id)}
          >
            {showLabels && (
              <span className="absolute inset-0 flex items-center justify-center text-white/70 text-xs font-mono">
                {overlay.label}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info panel */}
      {selectedItem && (
        <div className="bg-white rounded-[13px] border border-divider-gray p-[21px] w-[280px] max-w-full">
          <h4 className="font-semibold text-jet-black mb-[8px]">{selectedItem.label}</h4>
          {"altitude" in selectedItem && (
            <p className="text-xs text-slate font-mono mb-[8px]">{selectedItem.altitude}</p>
          )}
          <p className="text-sm text-slate leading-relaxed">{selectedItem.description}</p>
        </div>
      )}
    </div>
  );
}
