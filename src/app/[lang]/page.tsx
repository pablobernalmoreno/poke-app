import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { TYPE_NAMES, buildTypeMap, buildPokemonEntries } from "@/utils/pokemonUtils";
import PokedexSearch from "@/components/PokedexSearch/PokedexSearch";
import styles from "./page.module.css";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const opts = { next: { revalidate: 3600 } };

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
        <PokedexSearch pokemonEntries={pokemonEntries} lang={lang} />
      </main>
    </div>
  );
}
