import styles from "./page.module.css";
import PokedexSearch from "@/components/PokedexSearch/PokedexSearch";
import { TYPE_NAMES, buildTypeMap, buildPokemonEntries } from "@/utils/pokemonUtils";

export default async function Home() {
  const opts = { next: { revalidate: 3600 } };

  // Fetch the full Pokémon list and all 18 type endpoints in parallel
  const [listRes, ...typeResponses] = await Promise.all([
    fetch("https://pokeapi.co/api/v2/pokemon?limit=2000", opts),
    ...TYPE_NAMES.map((t) => fetch(`https://pokeapi.co/api/v2/type/${t}`, opts)),
  ]);

  const [listData, ...typeDataArr] = await Promise.all([
    listRes.json(),
    ...typeResponses.map((r) => r.json()),
  ]);

  const typeMap = buildTypeMap(typeDataArr);
  const pokemonEntries = buildPokemonEntries(listData.results, typeMap);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Poké-App</h1>
        <PokedexSearch pokemonEntries={pokemonEntries} />
      </main>
    </div>
  );
}
