"use client";

import { motion } from "motion/react";

type Mood = "neutral" | "happy" | "warning" | "celebrating";

export default function Bogeyman({
  message,
  mood = "neutral",
  talking = false,
}: {
  message?: string;
  mood?: Mood;
  talking?: boolean;
}) {
  const headContent = (
    <div className="h-[89px] w-[89px] rounded-full bg-[#f0d6b4] relative mx-auto flex items-center justify-center">
      {/* Headset band */}
      <div className="absolute -top-[6px] left-[10px] right-[10px] h-[8px] bg-graphite rounded-full" />
      {/* Headset ear cups */}
      <div className="absolute top-[12px] -left-[6px] w-[14px] h-[20px] bg-graphite rounded-[4px]" />
      <div className="absolute top-[12px] -right-[6px] w-[14px] h-[20px] bg-graphite rounded-[4px]" />
      {/* Sunglasses */}
      <div className="w-[60px] h-[18px] bg-deep-ice-blue rounded-[4px] mt-[4px]" />
      {/* Smile */}
      <div className="absolute bottom-[18px] w-[24px] h-[8px] border-b-2 border-graphite rounded-b-full" />
    </div>
  );

  const bubbleBorder = mood === "warning" ? "border-red-400" : "border-volt-green";
  const bubbleBg = mood === "warning" ? "bg-red-50" : "bg-volt-mist";

  return (
    <div className="w-[233px] flex flex-col items-center">
      {/* Character */}
      <div className="relative flex flex-col items-center">
        {/* Head */}
        {talking ? (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.61 }}
          >
            {headContent}
          </motion.div>
        ) : (
          headContent
        )}

        {/* Torso */}
        <div className="h-[144px] w-[70px] bg-ice-blue rounded-t-[8px] rounded-b-[4px] relative mt-[-4px] flex flex-col items-center pt-[13px]">
          {/* Badge */}
          <div className="bg-volt-green text-jet-black text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]">
            107
          </div>
          {/* Arms */}
          <div className="absolute top-[21px] -left-[12px] w-[12px] h-[55px] bg-ice-blue rounded-l-[4px]" />
          <div className="absolute top-[21px] -right-[12px] w-[12px] h-[55px] bg-ice-blue rounded-r-[4px]" />
        </div>

        {/* Legs */}
        <div className="h-[89px] flex gap-[8px] mt-[-2px]">
          <div className="w-[24px] bg-graphite rounded-b-[4px] flex flex-col justify-end">
            <div className="h-[21px] bg-jet-black rounded-[4px]" />
          </div>
          <div className="w-[24px] bg-graphite rounded-b-[4px] flex flex-col justify-end">
            <div className="h-[21px] bg-jet-black rounded-[4px]" />
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      {message && (
        <div className={`${bubbleBg} border-2 ${bubbleBorder} rounded-[13px] p-[13px] max-w-[233px] mt-[21px] relative`}>
          {/* Pointer triangle */}
          <div
            className={`absolute -top-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] ${
              mood === "warning" ? "border-b-red-400" : "border-b-volt-green"
            }`}
          />
          <p className="text-sm text-jet-black leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
