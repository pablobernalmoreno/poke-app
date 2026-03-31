"use client";

import { useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import VirtualPokemonGrid from "@/components/VirtualPokemonGrid/VirtualPokemonGrid";
import { type PokemonEntry } from "@/components/VirtualPokemonGrid/types";
import CollectionsPanel from "@/components/CollectionsPanel/CollectionsPanel";
import { useCollectionsContext } from "@/components/CollectionsProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/components/TranslationsProvider";
import { type Locale } from "@/lib/dictionaries";
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
  lang,
}: Readonly<{ pokemonEntries: PokemonEntry[]; lang: Locale }>) {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({
    types: [],
    generation: null,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const { favorites, team, typeAces } = useCollectionsContext();
  const collectionsCount =
    favorites.size + team.length + Object.keys(typeAces).length;

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
            aria-label={t.filters.title}
          >
            <FilterListIcon />
          </IconButton>
        </Badge>
        <Tooltip title={t.collections.tooltip}>
          <Badge badgeContent={collectionsCount} color="secondary" max={99}>
            <IconButton
              className={styles.filterButton}
              onClick={() => setCollectionsOpen(true)}
              aria-label={t.collections.tooltip}
            >
              <CollectionsBookmarkIcon />
            </IconButton>
          </Badge>
        </Tooltip>
        <LanguageSwitcher currentLang={lang} />
      </div>

      <FilterPanel
        open={filterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />

      <CollectionsPanel
        open={collectionsOpen}
        onClose={() => setCollectionsOpen(false)}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <CatchingPokemonIcon className={styles.emptyIcon} />
          <Typography className={styles.emptyText}>
            {t.empty}
          </Typography>
        </div>
      ) : (
        <VirtualPokemonGrid
          pokemonList={filtered}
          aceType={filters.types.length === 1 ? filters.types[0] : null}
        />
      )}
    </div>
  );
}
