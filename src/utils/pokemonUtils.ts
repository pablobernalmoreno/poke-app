import { type PokemonEntry } from "@/components/VirtualPokemonGrid/types";

const TYPE_NAMES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
] as const;

export type TypeName = (typeof TYPE_NAMES)[number];

export { TYPE_NAMES };

export function extractId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number.parseInt(parts.at(-1) ?? "", 10);
}

export function getGeneration(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  if (id <= 1025) return 9;
  return 0;
}

export function buildTypeMap(
  typeDataArr: { pokemon: { pokemon: { name: string } }[] }[],
): Map<string, string[]> {
  const typeMap = new Map<string, string[]>();
  typeDataArr.forEach((data, i) => {
    const typeName = TYPE_NAMES[i];
    for (const entry of data.pokemon) {
      const { name } = entry.pokemon;
      const existing = typeMap.get(name) ?? [];
      existing.push(typeName);
      typeMap.set(name, existing);
    }
  });
  return typeMap;
}

export function buildPokemonEntries(
  results: { name: string; url: string }[],
  typeMap: Map<string, string[]>,
): PokemonEntry[] {
  return results.map((p) => ({
    name: p.name,
    url: p.url,
    types: typeMap.get(p.name) ?? [],
    generation: getGeneration(extractId(p.url)),
  }));
}
