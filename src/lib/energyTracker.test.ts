import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLastMonthDates,
  getTrendSeriesForField,
  isWithinLastMonth,
} from "@/lib/energyTracker";

describe("one-month tracking window", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps today's entry when the check-in happens before noon", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T08:00:00"));

    expect(isWithinLastMonth("2026-09-14")).toBe(true);
  });

  it("treats the same calendar date consistently throughout the day", () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-09-14T08:00:00"));
    const morningResult = isWithinLastMonth("2026-09-14");

    vi.setSystemTime(new Date("2026-09-14T20:00:00"));
    const eveningResult = isWithinLastMonth("2026-09-14");

    expect(morningResult).toBe(true);
    expect(eveningResult).toBe(true);
    expect(morningResult).toBe(eveningResult);
  });

  it("keeps yesterday but rejects tomorrow", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T15:00:00"));

    expect(isWithinLastMonth("2026-09-13")).toBe(true);
    expect(isWithinLastMonth("2026-09-15")).toBe(false);
  });

  it("returns exactly the configured 30 calendar days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T15:00:00"));

    const dates = getLastMonthDates();

    expect(dates).toHaveLength(30);
    expect(dates[0]).toBe("2026-08-16");
    expect(dates.at(-1)).toBe("2026-09-14");
  });

  it("keeps the trend series aligned to the first and last saved entry within the month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T15:00:00"));

    const series = getTrendSeriesForField(
      [
        {
          date: "2026-09-14",
          sleep: 8,
          recreationBalance: 0,
          exploration: 0,
          socialization: 0,
          devEnergy: 0,
          employeeEngagement: 0,
          overall: 0,
          comment: "",
        },
      ],
      "sleep",
    );

    expect(series).toEqual([{ date: "2026-09-14", value: 8 }]);
  });

  it("fills a missing day between two saved entries with zero", () => {
    const series = getTrendSeriesForField(
      [
        {
          date: "2026-09-12",
          sleep: 6,
          recreationBalance: 0,
          exploration: 0,
          socialization: 0,
          devEnergy: 0,
          employeeEngagement: 0,
          overall: 0,
          comment: "",
        },
        {
          date: "2026-09-14",
          sleep: 8,
          recreationBalance: 0,
          exploration: 0,
          socialization: 0,
          devEnergy: 0,
          employeeEngagement: 0,
          overall: 0,
          comment: "",
        },
      ],
      "sleep",
    );

    expect(series).toEqual([
      { date: "2026-09-12", value: 6 },
      { date: "2026-09-13", value: 0 },
      { date: "2026-09-14", value: 8 },
    ]);
  });
});