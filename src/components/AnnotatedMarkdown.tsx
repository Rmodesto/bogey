import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode, Children, isValidElement, cloneElement } from "react";

const GLOSSARY: Record<string, string> = {
  "14 CFR Part 107":
    "Federal regulation governing registration, certification, and operation of civil small UAS in the US.",
  "14 CFR 107.3":
    "Section defining core Part 107 terminology — sUAS, Remote PIC, Visual Observer, Control Station.",
  "14 CFR 107.5":
    "Section on falsification, reproduction, or alteration of certificates and records.",
  "14 CFR 107.9":
    "Section requiring accident reporting to the FAA within 10 days.",
  "49 U.S.C. §44809":
    "Federal statute providing the recreational flyer exception — requires passing the TRUST test.",
  "§44807":
    "Federal statute allowing the FAA to grant special exemptions for certain UAS operations.",
  "§44809":
    "Federal statute for recreational drone flying — requires TRUST test, no Part 107 certificate needed.",
  "Section 333":
    "Legacy FAA exemption authority for commercial UAS, largely replaced by Part 107.",
  "Part 107":
    "14 CFR Part 107 — the FAA's primary rule for small UAS (drone) operations under 55 lbs.",
  "Part 91":
    "General operating and flight rules for manned aircraft in the National Airspace System.",
  NAS: "National Airspace System — the US network of airspace, navigation facilities, airports, and ATC.",
  sUAS: "Small Unmanned Aircraft System — a drone under 55 lbs plus its controller and data links.",
  LAANC:
    "Low Altitude Authorization and Notification Capability — near-real-time airspace authorization.",
  COA: "Certificate of Waiver or Authorization — FAA permission for specific operations in controlled airspace.",
  ATC: "Air Traffic Control — facilities and personnel managing aircraft movement.",
  "Remote PIC":
    "Remote Pilot in Command — the certificated person with final authority over the flight.",
  TRUST:
    "The Recreational UAS Safety Test — required knowledge test for recreational drone pilots.",
  AGL: "Above Ground Level — altitude measured from the terrain directly below.",
  MSL: "Mean Sea Level — altitude measured from the average sea level datum.",
  METAR:
    "Meteorological Terminal Air Report — standard aviation weather observation format.",
  NOTAM:
    "Notice to Air Missions — time-critical info about airspace changes or hazards.",
  TFR: "Temporary Flight Restriction — a temporary area where flight is restricted or prohibited.",
  DroneZone:
    "FAA's online portal for UAS registration and airspace authorization requests.",
};

// Sort longest-first so "14 CFR Part 107" matches before "Part 107"
const GLOSSARY_KEYS = Object.keys(GLOSSARY).sort(
  (a, b) => b.length - a.length
);

const GLOSSARY_PATTERN = new RegExp(
  `(${GLOSSARY_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g"
);

function Tooltip({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <span className="group/tip relative inline">
      <span className="border-b border-dotted border-deep-ice-blue/50 cursor-help">
        {term}
      </span>
      <span className="invisible group-hover/tip:visible opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[13px] py-[8px] bg-graphite text-white text-[13px] leading-[1.6] rounded-[8px] w-max max-w-[233px] z-50 pointer-events-none shadow-lg">
        {definition}
        <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-graphite" />
      </span>
    </span>
  );
}

function annotateText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  GLOSSARY_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = GLOSSARY_PATTERN.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(before);
    const term = match[1];
    parts.push(
      <Tooltip
        key={`${match.index}-${term}`}
        term={term}
        definition={GLOSSARY[term]}
      />
    );
    lastIndex = match.index + match[0].length;
  }

  const rest = text.slice(lastIndex);
  if (rest) parts.push(rest);
  return parts.length > 0 ? parts : [text];
}

function processChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      const parts = annotateText(child);
      return parts.length === 1 && typeof parts[0] === "string"
        ? parts[0]
        : <>{parts}</>;
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children != null) {
      return cloneElement(child, {
        ...child.props,
        children: processChildren(child.props.children),
      });
    }
    return child;
  });
}

export default function AnnotatedMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children, ...props }) => (
          <p {...props}>{processChildren(children)}</p>
        ),
        li: ({ children, ...props }) => (
          <li {...props}>{processChildren(children)}</li>
        ),
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-[21px]">
            <table {...props} className="w-full text-[13px] border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children, ...props }) => (
          <th
            {...props}
            className="text-left font-semibold text-jet-black bg-fog-gray border border-divider-gray px-[13px] py-[8px]"
          >
            {processChildren(children)}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            {...props}
            className="text-graphite border border-divider-gray px-[13px] py-[8px] leading-[1.6] align-top"
          >
            {processChildren(children)}
          </td>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote {...props}>{processChildren(children)}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
