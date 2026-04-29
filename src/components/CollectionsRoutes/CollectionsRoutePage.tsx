"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCollectionsContext } from "@/components/CollectionsProvider";
import { useTranslations } from "@/components/TranslationsProvider";
import { detailsCache } from "@/components/VirtualPokemonGrid/detailsCache";
import { TYPE_COLORS } from "@/components/VirtualPokemonGrid/types";
import { type Locale } from "@/lib/dictionaries";
import { TYPE_NAMES } from "@/utils/pokemonUtils";
import styles from "./CollectionsRoutePage.module.css";

type CollectionMode = "favorite" | "team" | "type-aces";

function useSpriteUrl(name: string): string {
  const [url, setUrl] = useState<string>(() => {
    const cached = detailsCache.get(name);
    return cached?.sprites.front_default ?? "";
  });

  useEffect(() => {
    if (!name || url) return;
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((r) => r.json() as Promise<{ sprites: { front_default: string } }>)
      .then((d) => setUrl(d.sprites.front_default));
  }, [name, url]);

  return url;
}

function MiniCard({
  name,
  removeLabel,
  onRemove,
}: Readonly<{ name: string; removeLabel: string; onRemove: () => void }>) {
  const sprite = useSpriteUrl(name);

  return (
    <Card className={styles.miniCard}>
      {sprite && (
        <Image src={sprite} alt={name} width={64} height={64} className={styles.miniSprite} />
      )}
      <Typography className={styles.miniName}>{name}</Typography>
      <Tooltip title={removeLabel}>
        <IconButton
          size="small"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label={`${removeLabel} ${name}`}
        >
          <CloseIcon sx={{ fontSize: 12 }} />
        </IconButton>
      </Tooltip>
    </Card>
  );
}

function AceSlot({
  typeName,
  pokemonName,
  emptyLabel,
  removeLabel,
  onRemove,
}: Readonly<{ typeName: string; pokemonName?: string; emptyLabel: string; removeLabel: string; onRemove: () => void }>) {
  const sprite = useSpriteUrl(pokemonName ?? "");
  const typeColor = TYPE_COLORS[typeName] ?? "#888";

  return (
    <Card className={styles.aceSlot}>
      <span
        className={styles.aceTypeChip}
        style={{ "--type-color": typeColor } as React.CSSProperties}
      >
        {typeName}
      </span>
      {pokemonName ? (
        <>
          {sprite && (
            <Image src={sprite} alt={pokemonName} width={64} height={64} className={styles.miniSprite} />
          )}
          <Typography className={styles.miniName}>{pokemonName}</Typography>
          <Tooltip title={removeLabel}>
            <IconButton
              size="small"
              className={styles.removeBtn}
              onClick={onRemove}
              aria-label={removeLabel}
            >
              <CloseIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Typography className={styles.emptySlot}>{emptyLabel}</Typography>
      )}
    </Card>
  );
}

async function exportAreaAsImage(
  ref: React.RefObject<HTMLDivElement | null>,
  filename: string,
) {
  if (!ref.current) return;

  const canvas = await html2canvas(ref.current, {
    backgroundColor: "#1a1a2e",
    useCORS: true,
    scale: 2,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function CollectionsRoutePage({
  lang,
  mode,
}: Readonly<{ lang: Locale; mode: CollectionMode }>) {
  const t = useTranslations();
  const exportRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite, team, removeFromTeam, typeAces, clearTypeAce } =
    useCollectionsContext();

  const favList = [...favorites];

  const isFavorites = mode === "favorite";
  const isTeam = mode === "team";
  const isTypeAces = mode === "type-aces";

  const exportFilename = isFavorites ? "favorites.png" : isTeam ? "team.png" : "type-aces.png";
  const exportTitle = isFavorites
    ? t.collections.exportFavorites
    : isTeam
      ? t.collections.exportTeam
      : t.collections.exportTypeAces;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Box className={styles.toolbar}>
          <Button
            className={styles.navBtn}
            component={Link}
            href={`/${lang}`}
            startIcon={<SportsEsportsIcon />}
          >
            {t.navigation.pokedex}
          </Button>

          <Badge badgeContent={favList.length} color="secondary" max={99}>
            <Button
              className={`${styles.navBtn} ${isFavorites ? styles.navBtnActive : ""}`}
              component={Link}
              href={`/${lang}/favorite`}
              startIcon={<FavoriteIcon />}
            >
              {t.navigation.favorites}
            </Button>
          </Badge>

          <Badge badgeContent={team.length} color="secondary" max={99}>
            <Button
              className={`${styles.navBtn} ${isTeam ? styles.navBtnActive : ""}`}
              component={Link}
              href={`/${lang}/team`}
              startIcon={<GroupsIcon />}
            >
              {t.navigation.team}
            </Button>
          </Badge>

          <Badge badgeContent={Object.keys(typeAces).length} color="secondary" max={99}>
            <Button
              className={`${styles.navBtn} ${isTypeAces ? styles.navBtnActive : ""}`}
              component={Link}
              href={`/${lang}/type-aces`}
              startIcon={<StarIcon />}
            >
              {t.navigation.typeAces}
            </Button>
          </Badge>

          <LanguageSwitcher currentLang={lang} />
        </Box>

        <Box className={styles.scrollArea}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            className={styles.exportBtn}
            onClick={() => exportAreaAsImage(exportRef, exportFilename)}
          >
            {t.collections.exportBtn}
          </Button>

          <Box ref={exportRef} className={styles.contentCard}>
            <Typography className={styles.title}>{exportTitle}</Typography>

            {isFavorites && (
              favList.length === 0 ? (
                <Typography className={styles.emptyState}>{t.collections.emptyFavorites}</Typography>
              ) : (
                <Box className={styles.miniGrid}>
                  {favList.map((name) => (
                    <MiniCard
                      key={name}
                      name={name}
                      removeLabel={t.card.favoriteRemove}
                      onRemove={() => toggleFavorite(name)}
                    />
                  ))}
                </Box>
              )
            )}

            {isTeam && (
              team.length === 0 ? (
                <Typography className={styles.emptyState}>{t.collections.emptyTeam}</Typography>
              ) : (
                <Box className={styles.miniGrid}>
                  {team.map((name) => (
                    <MiniCard
                      key={name}
                      name={name}
                      removeLabel={t.card.teamRemove}
                      onRemove={() => removeFromTeam(name)}
                    />
                  ))}
                </Box>
              )
            )}

            {isTypeAces && (
              <Box className={styles.aceGrid}>
                {TYPE_NAMES.map((typeName) => (
                  <AceSlot
                    key={typeName}
                    typeName={typeName}
                    pokemonName={typeAces[typeName]}
                    emptyLabel={t.collections.emptySlot}
                    removeLabel={t.card.typeAceRemove.replace("{type}", typeName)}
                    onRemove={() => clearTypeAce(typeName)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </main>
    </div>
  );
}
