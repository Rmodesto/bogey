"use client";

// Legality is signaled by fill + icon + text, never color alone.
export default function LegalBadge({ legal }: { legal: boolean }) {
  return legal ? (
    <div className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-volt-green text-jet-black text-[14px] font-semibold">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8.5l3.2 3.2L13 5" />
      </svg>
      <span>Legal</span>
    </div>
  ) : (
    <div className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-white text-[#b42318] border-2 border-[#b42318] text-[14px] font-semibold">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b42318" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
      <span>Not legal</span>
    </div>
  );
}
