"use client";

import { useState } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ArrowDownIcon } from "@/components/icons/arrow_down"; // adjust path
import { HOTEL_SORT_OPTIONS, HotelSortValue } from "@/types/hotel_type";

type HotelSortByProps = {
  sortBy: HotelSortValue;
  onChange: (value: HotelSortValue) => void;
};

export const HotelSortBy = ({ sortBy, onChange }: HotelSortByProps) => {
  const [open, setOpen] = useState(false);

  const items: MenuProps["items"] = HOTEL_SORT_OPTIONS.map((option) => ({
    key: option.value,
    label: (
      <div className="flex items-center justify-between gap-6 py-1 font-montserrat text-sm">
        <span
          className={
            sortBy === option.value ? "text-blackish-green font-semibold" : ""
          }
        >
          {option.label}
        </span>
        {sortBy === option.value && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blackish-green"
            />
          </svg>
        )}
      </div>
    ),
  }));

  const current = HOTEL_SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <Dropdown
      trigger={["click"]}
      onOpenChange={setOpen}
      menu={{
        items,
        selectable: true,
        selectedKeys: [sortBy],
        onClick: ({ key }) => onChange(key as HotelSortValue),
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-montserrat text-blackish-green"
      >
        Sort by <span className="font-semibold">{current?.label}</span>
        <span
          className={`inline-flex transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ArrowDownIcon />
        </span>
      </button>
    </Dropdown>
  );
};
