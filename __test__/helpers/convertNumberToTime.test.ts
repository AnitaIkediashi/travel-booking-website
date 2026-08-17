import { convertMinutesToTime, formatDateTime, formatDuration, getDuration } from "@/helpers/convertNumberToTime";


describe("convertMinutesToTime", () => {
  it("formats midnight correctly", () => {
    expect(convertMinutesToTime(0)).toBe("12:00 AM");
  });

  it("formats noon correctly", () => {
    expect(convertMinutesToTime(720)).toBe("12:00 PM");
  });

  it("formats a morning time with padded minutes", () => {
    expect(convertMinutesToTime(90)).toBe("01:30 AM");
  });

  it("formats an evening time correctly", () => {
    expect(convertMinutesToTime(1339)).toBe("10:19 PM");
  });

  it("wraps past 24 hours back to the start of day", () => {
    expect(convertMinutesToTime(1440)).toBe("12:00 AM");
  });

  it("formats one minute before midnight", () => {
    expect(convertMinutesToTime(1439)).toBe("11:59 PM");
  });

  it("pads hours 1-9 with a leading zero", () => {
    expect(convertMinutesToTime(300)).toBe("05:00 AM");
  });

  it("does not pad double-digit hours", () => {
    expect(convertMinutesToTime(600)).toBe("10:00 AM");
  });
});

describe("formatDuration", () => {
  it("formats a duration with hours and minutes", () => {
    expect(formatDuration(125)).toBe("2h5m");
  });

  it("formats a duration under an hour", () => {
    expect(formatDuration(45)).toBe("0h45m");
  });

  it("formats an exact hour with 0 minutes", () => {
    expect(formatDuration(120)).toBe("2h0m");
  });

  it("returns N/A for undefined", () => {
    expect(formatDuration(undefined as unknown as number)).toBe("N/A");
  });

  it("returns N/A for Infinity", () => {
    expect(formatDuration(Infinity)).toBe("N/A");
  });

  it("returns N/A for 0 (documenting current falsy-check behavior)", () => {
    // NOTE: this may not be intentional -- 0 is a valid duration.
    // Flag/fix if 0-minute durations should render as "0h0m" instead.
    expect(formatDuration(0)).toBe("N/A");
  });
});

describe("formatDateTime", () => {
  it("formats a date to a lowercase 12-hour time string in UTC", () => {
    const date = new Date("2024-06-15T14:30:00Z");
    expect(formatDateTime(date)).toBe("02:30 pm");
  });

  it("formats midnight UTC correctly", () => {
    const date = new Date("2024-06-15T00:00:00Z");
    expect(formatDateTime(date)).toBe("12:00 am");
  });

  it("returns empty string for undefined", () => {
    expect(formatDateTime(undefined)).toBe("");
  });
});

describe("getDuration", () => {
  it("calculates duration correctly for a same-day flight", () => {
    const departure = new Date("2024-06-15T10:00:00Z");
    const arrival = new Date("2024-06-15T12:30:00Z");
    expect(getDuration(departure, arrival)).toBe("2h 30m");
  });

  it("calculates duration correctly across midnight", () => {
    const departure = new Date("2024-06-15T23:00:00Z");
    const arrival = new Date("2024-06-16T01:15:00Z");
    expect(getDuration(departure, arrival)).toBe("2h 15m");
  });

  it("returns 0h 0m for identical departure and arrival", () => {
    const date = new Date("2024-06-15T10:00:00Z");
    expect(getDuration(date, date)).toBe("0h 0m");
  });

  it("returns empty string when departure is missing", () => {
    expect(getDuration(undefined, new Date())).toBe("");
  });

  it("returns empty string when arrival is missing", () => {
    expect(getDuration(new Date(), undefined)).toBe("");
  });

  it("returns empty string when both are missing", () => {
    expect(getDuration(undefined, undefined)).toBe("");
  });

  it("documents current behavior when arrival is before departure (negative duration)", () => {
    // NOTE: likely a real bug -- bad/reversed data currently produces
    // a nonsensical negative duration string instead of being guarded against.
    const departure = new Date("2024-06-15T12:00:00Z");
    const arrival = new Date("2024-06-15T10:00:00Z");
    expect(getDuration(departure, arrival)).toBe("-2h 0m");
  });
});
