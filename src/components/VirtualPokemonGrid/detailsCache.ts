import { type PokemonDetails } from "./types";

/**
 * Module-level cache shared between PokemonCard and CollectionsPanel.
 * Populated lazily as cards are rendered.
 */
export const detailsCache = new Map<string, PokemonDetails>();

/** Fetch details for a pokemon name, using the cache. */
export async function fetchDetails(name: string, url: string): Promise<PokemonDetails> {
  const cached = detailsCache.get(name);
  if (cached) return cached;
  const data = (await fetch(url).then((r) => r.json())) as PokemonDetails;
  detailsCache.set(name, data);
  return data;
}
