"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { type PokemonDetails, type PokemonListItem, TYPE_COLORS } from "./types";
import styles from "./VirtualPokemonGrid.module.css";

// Module-level cache so details survive re-renders and column recalculations
const detailsCache = new Map<string, PokemonDetails>();

export default function PokemonCard({
  item,
}: Readonly<{ item: PokemonListItem }>) {
  const [details, setDetails] = useState<PokemonDetails | null>(
    detailsCache.get(item.name) ?? null
  );

  useEffect(() => {
    if (details) return;
    let cancelled = false;
    fetch(item.url)
      .then((r) => r.json())
      .then((data: PokemonDetails) => {
        if (!cancelled) {
          detailsCache.set(item.name, data);
          setDetails(data);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [item.url, item.name, details]);

  if (!details) {
    return (
      <Card className={styles.card} sx={{ bgcolor: "background.paper" }}>
        <Skeleton
          className={styles.skeletonImg}
          variant="rectangular"
          width={120}
          height={120}
        />
        <CardContent className={styles.cardContent}>
          <Skeleton className={styles.skeletonId} width="40%" height={16} />
          <Skeleton className={styles.skeletonName} width="70%" height={22} />
          <Skeleton width="50%" height={22} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.card} ${styles.cardHover}`}
      sx={{ bgcolor: "background.paper" }}
    >
      <CardMedia
        component="img"
        image={details.sprites.front_default}
        alt={details.name}
        className={styles.cardMedia}
      />
      <CardContent className={styles.cardContent}>
        <Typography variant="caption" color="text.secondary">
          #{String(details.id).padStart(3, "0")}
        </Typography>
        <Typography variant="subtitle1" className={styles.pokemonName}>
          {details.name}
        </Typography>
        <Box className={styles.typesRow}>
          {details.types.map(({ type }) => (
            <Chip
              key={type.name}
              label={type.name}
              size="small"
              className={styles.typeChip}
              style={
                {
                  "--type-color": TYPE_COLORS[type.name] ?? "#888",
                } as React.CSSProperties
              }
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
