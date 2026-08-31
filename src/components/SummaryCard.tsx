import { Box, Typography } from "@mui/material";

type SummaryCardProps = {
  label: string;
  value: number;
  accent: string;
};

export function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))",
        p: 2,
        minHeight: 110,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mt: 1,
          fontWeight: 800,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value.toFixed(1)}
      </Typography>
    </Box>
  );
}
