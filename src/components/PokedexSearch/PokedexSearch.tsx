"use client";

import { useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import VirtualPokemonGrid from "@/components/VirtualPokemonGrid/VirtualPokemonGrid";
import { type PokemonEntry } from "@/components/VirtualPokemonGrid/types";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import { filterPokemon, countActiveFilters } from "@/utils/filterUtils";
import styles from "./PokedexSearch.module.css";

export interface ActiveFilters {
  types: string[];
  generation: number | null;
}

export default function PokedexSearch({
  pokemonEntries,
}: Readonly<{ pokemonEntries: PokemonEntry[] }>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({
    types: [],
    generation: null,
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(
    () => filterPokemon(pokemonEntries, search, filters),
    [pokemonEntries, search, filters],
  );

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <SearchBar value={search} onChange={setSearch} />
        <Badge badgeContent={activeFilterCount} color="primary">
          <IconButton
            className={styles.filterButton}
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
          >
            <FilterListIcon />
          </IconButton>
        </Badge>
      </div>

      <FilterPanel
        open={filterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <CatchingPokemonIcon className={styles.emptyIcon} />
          <Typography className={styles.emptyText}>
            No Pokémon match your search
          </Typography>
        </div>
      ) : (
        <VirtualPokemonGrid pokemonList={filtered} />
      )}
    </div>
  );
}
