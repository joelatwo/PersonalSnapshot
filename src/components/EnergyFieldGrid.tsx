import { Box, TextField } from "@mui/material";
import {
  ENERGY_FIELDS,
  type EnergyEntry,
  type EnergyFieldKey,
} from "@/lib/energyTracker";
import { TrackerSlider } from "@/components/TrackerSlider";

type EnergyFieldGridProps = {
  values: EnergyEntry;
  onChange: (field: EnergyFieldKey, value: number) => void;
  onCommentChange: (value: string) => void;
};

export function EnergyFieldGrid({
  values,
  onChange,
  onCommentChange,
}: EnergyFieldGridProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {ENERGY_FIELDS.map((field) => (
          <Box key={field.key}>
            <TrackerSlider
              label={field.label}
              value={values[field.key]}
              color={field.color}
              onChange={(value) => onChange(field.key, value)}
            />
          </Box>
        ))}
      </Box>

      <TextField
        label="Comment (optional)"
        value={values.comment}
        onChange={(event) => onCommentChange(event.target.value)}
        multiline
        maxRows={2}
        placeholder="One line of context..."
        fullWidth
        slotProps={{ htmlInput: { maxLength: 160 } }}
      />
    </Box>
  );
}
