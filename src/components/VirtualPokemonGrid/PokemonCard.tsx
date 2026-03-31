"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useCollectionsContext } from "@/components/CollectionsProvider";
import { useTranslations } from "@/components/TranslationsProvider";
import { detailsCache } from "./detailsCache";
import { type PokemonDetails, type PokemonListItem, TYPE_COLORS } from "./types";
import styles from "./VirtualPokemonGrid.module.css";

// Module-level cache so details survive re-renders and column recalculations
// Re-exported from detailsCache.ts for sharing with CollectionsPanel

export default function PokemonCard({
  item,
  aceType = null,
}: Readonly<{ item: PokemonListItem; aceType?: string | null }>) {
  const [details, setDetails] = useState<PokemonDetails | null>(
    detailsCache.get(item.name) ?? null
  );
  const { favorites, toggleFavorite, team, addToTeam, removeFromTeam, teamFull, typeAces, setTypeAce } =
    useCollectionsContext();
  const t = useTranslations();

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

  const isFavorite = favorites.has(details.name);
  const inTeam = team.includes(details.name);
  const primaryType = details.types[0]?.type.name ?? "";
  // When exactly one type is filtered, use that type for ace assignment
  const effectiveAceType = aceType ?? primaryType;
  const isTypeAce = typeAces[effectiveAceType] === details.name;
  let teamTooltip = t.card.teamAdd;
  if (inTeam) teamTooltip = t.card.teamRemove;
  else if (teamFull) teamTooltip = t.card.teamFull;
  const aceTooltip = isTypeAce
    ? t.card.typeAceRemove.replace("{type}", effectiveAceType)
    : t.card.typeAceSet.replace("{type}", effectiveAceType);

  return (
    <Card
      className={`${styles.card} ${styles.cardHover}`}
      sx={{ bgcolor: "background.paper", position: "relative" }}
    >
      {/* Action overlay — visible on hover via CSS */}
      <Box className={styles.cardOverlay}>
        <Tooltip title={isFavorite ? t.card.favoriteRemove : t.card.favoriteAdd}>
          <IconButton
            size="small"
            className={`${styles.overlayBtn} ${isFavorite ? styles.overlayBtnActive : ""}`}
            onClick={() => toggleFavorite(details.name)}
            aria-label={isFavorite ? t.card.favoriteRemove : t.card.favoriteAdd}
          >
            {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={teamTooltip}>
          <span>
            <IconButton
              size="small"
              className={`${styles.overlayBtn} ${inTeam ? styles.overlayBtnActive : ""}`}
              onClick={() => inTeam ? removeFromTeam(details.name) : addToTeam(details.name)}
              disabled={!inTeam && teamFull}
              aria-label={inTeam ? t.card.teamRemove : t.card.teamAdd}
            >
              <GroupsIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={aceTooltip}>
          <IconButton
            size="small"
            className={`${styles.overlayBtn} ${isTypeAce ? styles.overlayBtnActive : ""}`}
            onClick={() => setTypeAce(effectiveAceType, details.name)}
            aria-label={aceTooltip}
          >
            {isTypeAce ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

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
