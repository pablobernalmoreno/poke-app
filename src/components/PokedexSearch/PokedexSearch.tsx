"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import VirtualPokemonGrid from "@/components/VirtualPokemonGrid/VirtualPokemonGrid";
import { type PokemonEntry } from "@/components/VirtualPokemonGrid/types";
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

  const { favorites, team, typeAces } = useCollectionsContext();

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
        <Tooltip title={t.navigation.favorites}>
          <Badge badgeContent={favorites.size} color="secondary" max={99}>
            <IconButton
              className={styles.filterButton}
              component={Link}
              href={`/${lang}/favorite`}
              aria-label={t.navigation.favorites}
            >
              <FavoriteIcon />
            </IconButton>
          </Badge>
        </Tooltip>
        <Tooltip title={t.navigation.team}>
          <Badge badgeContent={team.length} color="secondary" max={99}>
            <IconButton
              className={styles.filterButton}
              component={Link}
              href={`/${lang}/team`}
              aria-label={t.navigation.team}
            >
              <GroupsIcon />
            </IconButton>
          </Badge>
        </Tooltip>
        <Tooltip title={t.navigation.typeAces}>
          <Badge badgeContent={Object.keys(typeAces).length} color="secondary" max={99}>
            <IconButton
              className={styles.filterButton}
              component={Link}
              href={`/${lang}/type-aces`}
              aria-label={t.navigation.typeAces}
            >
              <StarIcon />
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
