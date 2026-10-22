"use client";

import { Button } from "@/components/reusable/button";
import { useState, type ReactNode } from "react";

// how many amenities show before the "+N more" toggle
const LIMIT = 9;

const Svg = ({ children }: { children: ReactNode }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    {children}
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  wifi: (
    <>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </>
  ),
  pool: (
    <>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </>
  ),
  spa: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  fitness: (
    <>
      <path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11" />
    </>
  ),
  restaurant: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  roomService: (
    <>
      <path d="M3 18h18" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <path d="M12 7V4M10 4h4" />
    </>
  ),
  bar: (
    <>
      <path d="M8 22h8M12 11v11M19 3H5l7 8 7-8Z" />
    </>
  ),
  coffee: (
    <>
      <path d="M10 2v2M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    </>
  ),
  parking: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  shuttle: (
    <>
      <path d="M8 6v6M16 6v6M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  pet: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </>
  ),
  concierge: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
};

// first match wins; anything unmatched gets the check icon
const ICON_RULES: [RegExp, keyof typeof ICONS][] = [
  [/wi-?fi|internet/, "wifi"],
  [/pool|swim/, "pool"],
  [/\bspa\b|wellness|sauna/, "spa"],
  [/fitness|gym/, "fitness"],
  [/room service/, "roomService"],
  [/restaurant|dining|breakfast/, "restaurant"],
  [/\bbar\b|lounge/, "bar"],
  [/coffee|\btea\b/, "coffee"],
  [/parking/, "parking"],
  [/shuttle|airport|transfer/, "shuttle"],
  [/\bpet\b|pet[- ]friendly/, "pet"],
  [/concierge|reception/, "concierge"],
];

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  const rule = ICON_RULES.find(([re]) => re.test(n));
  return ICONS[rule ? rule[1] : "check"];
};

export const HotelAmenities = ({ amenities }: { amenities: string[] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!amenities?.length) return null;

  const hidden = amenities.length - LIMIT;
  const visible =
    expanded || hidden <= 0 ? amenities : amenities.slice(0, LIMIT);

  return (
    <ul className="columns-1 gap-x-10 text-sm sm:columns-2 md:text-base">
      {visible.map((name) => (
        <li
          key={name}
          className="mb-6 flex break-inside-avoid items-center gap-2 font-medium"
        >
          <Svg>{getIcon(name)}</Svg>
          <span>{name}</span>
        </li>
      ))}

      {hidden > 0 && (
        <li className="mb-6 break-inside-avoid">
          <Button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            label={expanded ? "Show less" : `+${hidden} more`}
            className="text-sm font-semibold text-salmon-100 md:text-base"
          />
        </li>
      )}
    </ul>
  );
};
