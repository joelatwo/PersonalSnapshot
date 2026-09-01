export type EnergyFieldKey =
  | "sleep"
  | "recreationBalance"
  | "exploration"
  | "socialization"
  | "devEnergy"
  | "employeeEngagement"
  | "overall";

export type EnergyEntry = {
  date: string;
  sleep: number;
  recreationBalance: number;
  exploration: number;
  socialization: number;
  devEnergy: number;
  employeeEngagement: number;
  overall: number;
  comment: string;
};

export const ENERGY_FIELDS = [
  { key: "sleep", label: "Sleep", color: "#8b5cf6" },
  { key: "recreationBalance", label: "Recreation balance", color: "#10b981" },
  { key: "exploration", label: "Exploration", color: "#f59e0b" },
  { key: "socialization", label: "Socialization", color: "#3b82f6" },
  { key: "devEnergy", label: "Dev energy", color: "#ef4444" },
  { key: "employeeEngagement", label: "Employee engagement", color: "#14b8a6" },
  { key: "overall", label: "Overall", color: "#f97316" },
] as const;

export const STORAGE_KEY = "personal-snapshot-energy-tracker-v1";

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeEntry(
  entry: Partial<EnergyEntry> & { date?: string },
): EnergyEntry {
  const date = entry.date ?? formatDateKey(new Date());

  return {
    date,
    sleep: clampNumber(entry.sleep ?? 0),
    recreationBalance: clampNumber(entry.recreationBalance ?? 0),
    exploration: clampNumber(entry.exploration ?? 0),
    socialization: clampNumber(entry.socialization ?? 0),
    devEnergy: clampNumber(entry.devEnergy ?? 0),
    employeeEngagement: clampNumber(entry.employeeEngagement ?? 0),
    overall: clampNumber(entry.overall ?? 0),
    comment:
      typeof entry.comment === "string" ? entry.comment.slice(0, 160) : "",
  };
}

export function getEmptyEntry(date: string): EnergyEntry {
  return normalizeEntry({
    date,
    sleep: 0,
    recreationBalance: 0,
    exploration: 0,
    socialization: 0,
    devEnergy: 0,
    employeeEngagement: 0,
    overall: 0,
    comment: "",
  });
}

export function getEntryByDate(
  entries: EnergyEntry[],
  date: string,
): EnergyEntry | null {
  return entries.find((entry) => entry.date === date) ?? null;
}

export function upsertEntry(
  entries: EnergyEntry[],
  nextEntry: EnergyEntry,
): EnergyEntry[] {
  const merged = entries.filter((entry) => entry.date !== nextEntry.date);
  return [...merged, normalizeEntry(nextEntry)]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((entry) => isWithinLastMonth(entry.date));
}

export function readStoredEntries(): EnergyEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => normalizeEntry(entry))
      .filter((entry) => isWithinLastMonth(entry.date));
  } catch {
    return [];
  }
}

export function saveStoredEntries(entries: EnergyEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextEntries = entries
    .map((entry) => normalizeEntry(entry))
    .filter((entry) => isWithinLastMonth(entry.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
}

export function isWithinLastMonth(dateKey: string): boolean {
  const providedDate = new Date(`${dateKey}T12:00:00`);
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getDate() - 30);

  return providedDate >= monthAgo && providedDate <= now;
}

export function getLastMonthDates(): string[] {
  const today = new Date();
  const values: string[] = [];

  for (let index = 30; index >= 0; index -= 1) {
    const pointer = new Date(today);
    pointer.setDate(today.getDate() - index);
    values.push(formatDateKey(pointer));
  }

  return values;
}

export function getTrendSeriesForField(
  entries: EnergyEntry[],
  field: EnergyFieldKey,
): Array<{ date: string; value: number }> {
  const sortedEntries = [...entries].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  if (sortedEntries.length === 0) {
    return [];
  }

  const firstDate = new Date(`${sortedEntries[0].date}T12:00:00`);
  const lastDate = new Date(
    `${sortedEntries[sortedEntries.length - 1].date}T12:00:00`,
  );
  const byDate = new Map(
    sortedEntries.map((entry) => [entry.date, clampNumber(entry[field])]),
  );

  const values: Array<{ date: string; value: number }> = [];
  const cursor = new Date(firstDate);

  while (cursor <= lastDate) {
    const date = formatDateKey(cursor);
    values.push({
      date,
      value: byDate.get(date) ?? 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return values;
}

export function getAverageForField(
  entries: EnergyEntry[],
  field: EnergyFieldKey,
): number {
  const sortedEntries = [...entries].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const recentEntries = sortedEntries.slice(-3);

  if (recentEntries.length === 0) {
    return 0;
  }

  const total = recentEntries.reduce(
    (sum, entry) => sum + clampNumber(entry[field]),
    0,
  );
  return Number((total / recentEntries.length).toFixed(1));
}

function clampNumber(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(10, Math.max(0, Number(value.toFixed(1))));
}
