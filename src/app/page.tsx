import styles from "./page.module.css";
import PokemonGrid, { type PokemonDetails } from "./PokemonGrid";

export default async function Home() {
  const listRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20", {
    next: { revalidate: 3600 },
  });
  const listData = await listRes.json();

  const pokemonDetails: PokemonDetails[] = await Promise.all(
    listData.results.map((p: { name: string; url: string }) =>
      fetch(p.url, { next: { revalidate: 3600 } }).then((r) => r.json())
    )
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Pokédex</h1>
        <PokemonGrid pokemon={pokemonDetails} />
      </main>
    </div>
  );
}
