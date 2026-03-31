"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";
import PokemonCard from "./PokemonCard";
import styles from "./VirtualPokemonGrid.module.css";
import { type PokemonListItem } from "./types";
import { readIntVar } from "@/utils/cssUtils";

export type { PokemonListItem } from "./types";

// Fallbacks mirror the CSS custom properties in VirtualPokemonGrid.module.css.
// The CSS vars are the single source of truth; JS reads them after mount.
const CARD_WIDTH_DEFAULT = 160;
const CARD_HEIGHT_DEFAULT = 236;
const GAP_DEFAULT = 16;

export default function VirtualPokemonGrid({
  pokemonList,
  aceType = null,
}: Readonly<{
  pokemonList: PokemonListItem[];
  aceType?: string | null;
}>) {
  "use no memo";
  const parentRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(6);

  // JS reads sizing from the CSS custom properties so there's one source of truth.
  const cardWidthRef = useRef(CARD_WIDTH_DEFAULT);
  const cardHeightRef = useRef(CARD_HEIGHT_DEFAULT);
  const gapRef = useRef(GAP_DEFAULT);

  useEffect(() => {
    cardWidthRef.current = readIntVar("--card-width", CARD_WIDTH_DEFAULT);
    cardHeightRef.current = readIntVar("--card-height", CARD_HEIGHT_DEFAULT);
    gapRef.current = readIntVar("--vgrid-gap", GAP_DEFAULT);
  }, []);

  // Recalculate column count whenever the container is resized
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const update = () => {
      const gap = gapRef.current;
      const cardWidth = cardWidthRef.current;
      const width = el.clientWidth;
      setColumns(Math.max(1, Math.floor((width + gap) / (cardWidth + gap))));
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Chunk the flat list into rows of `columns` items each
  const rows = useMemo<PokemonListItem[][]>(() => {
    const result: PokemonListItem[][] = [];
    for (let i = 0; i < pokemonList.length; i += columns) {
      result.push(pokemonList.slice(i, i + columns));
    }
    return result;
  }, [pokemonList, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cardHeightRef.current + gapRef.current,
    overscan: 3,
  });

  return (
    <div ref={parentRef} className={styles.scrollContainer}>
      <div
        className={styles.spacer}
        style={{ height: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className={styles.row}
            style={{ top: virtualRow.start }}
          >
            {rows[virtualRow.index].map((p) => (
              <PokemonCard key={p.name} item={p} aceType={aceType} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
