import { type PokemonEntry } from "@/components/VirtualPokemonGrid/types";
import { type ActiveFilters } from "@/components/PokedexSearch/PokedexSearch";

export function filterPokemon(
  entries: PokemonEntry[],
  search: string,
  filters: ActiveFilters,
): PokemonEntry[] {
  const q = search.toLowerCase().trim();
  return entries.filter((p) => {
    if (q && !p.name.includes(q)) return false;
    if (filters.generation !== null && p.generation !== filters.generation)
      return false;
    if (
      filters.types.length > 0 &&
      !filters.types.every((t) => p.types.includes(t))
    )
      return false;
    return true;
  });
}

export function countActiveFilters(filters: ActiveFilters): number {
  return (filters.types.length > 0 ? 1 : 0) +
    (filters.generation === null ? 0 : 1);
}
