"use client";

import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { TYPE_COLORS } from "@/components/VirtualPokemonGrid/types";
import { type ActiveFilters } from "./PokedexSearch";
import styles from "./FilterPanel.module.css";

const TYPE_NAMES = Object.keys(TYPE_COLORS);

const GENERATIONS = [
  { value: 1, label: "I" },
  { value: 2, label: "II" },
  { value: 3, label: "III" },
  { value: 4, label: "IV" },
  { value: 5, label: "V" },
  { value: 6, label: "VI" },
  { value: 7, label: "VII" },
  { value: 8, label: "VIII" },
  { value: 9, label: "IX" },
];

interface FilterPanelProps {
  open: boolean;
  filters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClose: () => void;
}

export default function FilterPanel({
  open,
  filters,
  onFiltersChange,
  onClose,
}: Readonly<FilterPanelProps>) {
  const toggleType = (type: string) => {
    const isSelected = filters.types.includes(type);
    if (isSelected) {
      onFiltersChange({ ...filters, types: filters.types.filter((t) => t !== type) });
    } else if (filters.types.length < 2) {
      onFiltersChange({ ...filters, types: [...filters.types, type] });
    }
  };

  const setGeneration = (_: React.MouseEvent, val: number | null) => {
    // val is null when user clicks the already-selected button (deselect = All)
    onFiltersChange({ ...filters, generation: val });
  };

  const clearAll = () => onFiltersChange({ types: [], generation: null });

  const hasFilters = filters.types.length > 0 || filters.generation !== null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { className: styles.drawerPaper } }}
    >
      <div className={styles.header}>
        <Typography className={styles.headerTitle}>Filters</Typography>
        <IconButton className={styles.closeButton} onClick={onClose} aria-label="Close filters">
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.content}>
        {/* Type filter */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>
            Type{filters.types.length > 0 ? ` (${filters.types.length}/2)` : " — select up to 2"}
          </Typography>
          <div className={styles.typesGrid}>
            {TYPE_NAMES.map((type) => {
              const selected = filters.types.includes(type);
              const disabled = !selected && filters.types.length >= 2;
              return (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  onClick={() => toggleType(type)}
                  disabled={disabled}
                  className={`${styles.typeChip} ${selected ? styles.typeChipSelected : ""}`}
                  style={{ "--type-color": TYPE_COLORS[type] } as React.CSSProperties}
                />
              );
            })}
          </div>
        </div>

        {/* Generation filter */}
        <div className={styles.section}>
          <Typography className={styles.sectionTitle}>Generation</Typography>
          <ToggleButtonGroup
            exclusive
            value={filters.generation}
            onChange={setGeneration}
            className={styles.genGroup}
          >
            {GENERATIONS.map((g) => (
              <ToggleButton key={g.value} value={g.value}>
                {g.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="outlined"
          className={styles.clearButton}
          onClick={clearAll}
          disabled={!hasFilters}
        >
          Clear all filters
        </Button>
      </div>
    </Drawer>
  );
}
