import { Box, Typography } from "@mui/material";

type TrendChartProps = {
  title: string;
  values: Array<{ date: string; value: number }>;
  color: string;
};

export function TrendChart({ title, values, color }: TrendChartProps) {
  const width = 320;
  const height = 120;
  const padding = 18;
  const latestValue = values.at(-1)?.value ?? 0;

  if (!values.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data yet
      </Typography>
    );
  }

  const maxValue = 10;
  const minValue = 0;
  const xStep =
    values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  const yGuides = [0, 2, 4, 6, 8, 10];
  const dayLabels = ["S", "M", "T", "W", "TH", "F", "S"];

  const linePoints = values
    .map((point, index) => {
      const x = padding + index * xStep;
      const y =
        height -
        padding -
        ((point.value - minValue) / (maxValue - minValue || 1)) *
          (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${linePoints} ${width - padding},${height - padding} ${padding},${height - padding}`;

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
          {latestValue.toFixed(1)}
        </Typography>
      </Box>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="120"
        role="img"
        aria-label={`${title} trend`}
      >
        {yGuides.map((value) => {
          const y =
            height -
            padding -
            ((value - minValue) / (maxValue - minValue || 1)) *
              (height - padding * 2);
          return (
            <g key={value}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="1"
              />
              <text
                x={4}
                y={y + 4}
                fill="#64748b"
                fontSize="9"
                fontWeight="700"
              >
                {value}
              </text>
              <text
                x={width - 22}
                y={y + 4}
                fill="#64748b"
                fontSize="9"
                fontWeight="700"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill={`${color}22`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((point, index) => {
          const x = padding + index * xStep;
          const y =
            height -
            padding -
            ((point.value - minValue) / (maxValue - minValue || 1)) *
              (height - padding * 2);
          return (
            <circle
              key={`${point.date}-${index}`}
              cx={x}
              cy={y}
              r={5}
              fill={color}
              stroke="white"
              strokeWidth="2.5"
            />
          );
        })}
        {values.map((point, index) => {
          const x = padding + index * xStep;
          const label =
            dayLabels[new Date(`${point.date}T12:00:00`).getDay() % 7] ?? "S";
          return (
            <text
              key={`${point.date}-label-${index}`}
              x={x}
              y={height - 4}
              textAnchor="middle"
              fill="#64748b"
              fontSize="12.5"
              fontWeight="700"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </Box>
  );
}
