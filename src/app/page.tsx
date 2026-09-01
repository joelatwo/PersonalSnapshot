"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward, Save } from "@mui/icons-material";
import { SummaryCard } from "@/components/SummaryCard";
import { TrendChart } from "@/components/TrendChart";
import { EnergyFieldGrid } from "@/components/EnergyFieldGrid";
import {
  ENERGY_FIELDS,
  type EnergyEntry,
  type EnergyFieldKey,
  formatDateKey,
  getAverageForField,
  getEmptyEntry,
  getEntryByDate,
  getLastMonthDates,
  getTrendSeriesForField,
  readStoredEntries,
  saveStoredEntries,
  upsertEntry,
} from "@/lib/energyTracker";

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const todayKey = formatDateKey(today);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [entries, setEntries] = useState<EnergyEntry[]>(() => readStoredEntries());
  const [draft, setDraft] = useState<EnergyEntry>(() =>
    getEmptyEntry(formatDateKey(today)),
  );
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    const existing = getEntryByDate(entries, selectedDate);
    setDraft(existing ?? getEmptyEntry(selectedDate));
  }, [entries, selectedDate]);

  useEffect(() => {
    saveStoredEntries(entries);
  }, [entries]);

  const currentEntry = getEntryByDate(entries, selectedDate);

  const changeField = (field: EnergyFieldKey, value: number) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const handleSave = () => {
    const normalized = {
      ...draft,
      date: selectedDate,
      comment: draft.comment.trim(),
    };
    const nextEntries = upsertEntry(entries, normalized);
    setEntries(nextEntries);
    setDraft(normalized);
    setSavedMessage("Saved for this date.");
    window.setTimeout(() => setSavedMessage(null), 1800);
  };

  const handleDateChange = (offset: number) => {
    const nextDate = new Date(`${selectedDate}T12:00:00`);
    nextDate.setDate(nextDate.getDate() + offset);
    const normalized = formatDateKey(nextDate);
    setSelectedDate(normalized);
    const existing = getEntryByDate(entries, normalized);
    setDraft(existing ?? getEmptyEntry(normalized));
  };

  const monthDates = getLastMonthDates();
  const stats = useMemo(
    () =>
      ENERGY_FIELDS.map((field) => ({
        ...field,
        average: getAverageForField(entries, field.key),
        series: getTrendSeriesForField(entries, field.key),
      })),
    [entries],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        py: { xs: 3, sm: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Personal Energy Snapshot
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              One quick check-in per day, stored locally for the last 30 days.
            </Typography>
          </Box>

          {selectedDate === todayKey && !getEntryByDate(entries, todayKey) ? (
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.12)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "#0f172a" }}
                    >
                      Today
                    </Typography>
                    <Chip
                      label="Quick check-in"
                      size="small"
                      sx={{
                        borderRadius: 999,
                        backgroundColor: "rgba(99,102,241,0.1)",
                        color: "#4338ca",
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <EnergyFieldGrid
                    values={draft}
                    onChange={changeField}
                    onCommentChange={(comment) =>
                      setDraft((previous) => ({ ...previous, comment }))
                    }
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{
                        borderRadius: 999,
                        px: 2.5,
                        py: 1,
                        background: "linear-gradient(135deg, #111827, #475569)",
                        textTransform: "none",
                      }}
                    >
                      Save today
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : null}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {stats.map((field) => (
              <Box key={field.key}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 1,
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <CardContent>
                    <TrendChart
                      title={field.label}
                      values={field.series}
                      color={field.color}
                    />
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {stats.map((field) => (
              <Box key={field.key}>
                <SummaryCard
                  label={field.label}
                  value={field.average}
                  accent={field.color}
                />
              </Box>
            ))}
          </Box>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleDateChange(-1)}
                    aria-label="Previous day"
                    sx={{ border: "1px solid #dbe3ee" }}
                  >
                    <ArrowBack />
                  </IconButton>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      textAlign: "center",
                    }}
                  >
                    {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                      undefined,
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </Typography>

                  <IconButton
                    onClick={() => handleDateChange(1)}
                    aria-label="Next day"
                    sx={{ border: "1px solid #dbe3ee" }}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {monthDates.slice(-7).map((day) => {
                    const isSelected = day === selectedDate;
                    const hasEntry = Boolean(getEntryByDate(entries, day));
                    return (
                      <Chip
                        key={day}
                        label={new Date(`${day}T12:00:00`).toLocaleDateString(
                          undefined,
                          { day: "numeric" },
                        )}
                        color={hasEntry ? "primary" : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        onClick={() => setSelectedDate(day)}
                        sx={{
                          minWidth: 52,
                          borderRadius: 999,
                          fontWeight: 700,
                          backgroundColor: isSelected
                            ? "#111827"
                            : hasEntry
                              ? "rgba(99,102,241,0.1)"
                              : "transparent",
                          color: isSelected ? "#fff" : "#0f172a",
                          borderColor: isSelected ? "#111827" : "#dbe3ee",
                        }}
                      />
                    );
                  })}
                </Box>

                <EnergyFieldGrid
                  values={draft}
                  onChange={changeField}
                  onCommentChange={(comment) =>
                    setDraft((previous) => ({ ...previous, comment }))
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    pt: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {currentEntry
                      ? "This day is saved."
                      : "Not saved yet for this date."}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                      borderRadius: 999,
                      px: 2.5,
                      py: 1,
                      background: "linear-gradient(135deg, #111827, #475569)",
                      textTransform: "none",
                    }}
                  >
                    Save entry
                  </Button>
                </Box>

                {savedMessage ? (
                  <Alert severity="success">{savedMessage}</Alert>
                ) : null}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
