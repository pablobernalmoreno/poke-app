"use client";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
}: Readonly<{ value: string; onChange: (v: string) => void }>) {
  return (
    <TextField
      className={styles.root}
      placeholder="Search Pokémon..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
