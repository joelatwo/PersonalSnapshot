import { Box, Slider, Stack, Typography } from "@mui/material";

type TrackerSliderProps = {
  label: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
};

const sliderMarks = [0, 2, 4, 6, 8, 10].map((mark) => ({
  value: mark,
  label: `${mark}`,
}));

export function TrackerSlider({
  label,
  value,
  color,
  onChange,
}: TrackerSliderProps) {
  return (
    <Box sx={{ py: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#0f172a" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: color,
            minWidth: 28,
            textAlign: "right",
          }}
        >
          {value}/10
        </Typography>
      </Box>
      <Slider
        value={value}
        onChange={(_, nextValue) =>
          onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)
        }
        min={0}
        max={10}
        step={1}
        marks={sliderMarks}
        valueLabelDisplay="auto"
        valueLabelFormat={(nextValue) => `${nextValue}/10`}
        sx={{
          color,
          "& .MuiSlider-thumb": {
            width: 18,
            height: 18,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.9)",
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
    </Box>
  );
}
