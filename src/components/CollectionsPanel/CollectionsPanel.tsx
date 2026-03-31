"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useCollectionsContext } from "@/components/CollectionsProvider";
import { useTranslations } from "@/components/TranslationsProvider";
import { detailsCache } from "@/components/VirtualPokemonGrid/detailsCache";
import { TYPE_COLORS } from "@/components/VirtualPokemonGrid/types";
import { TYPE_NAMES } from "@/utils/pokemonUtils";
import styles from "./CollectionsPanel.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabId = 0 | 1 | 2;

function useSpriteUrl(name: string): string {
  const [url, setUrl] = useState<string>(() => {
    const cached = detailsCache.get(name);
    return cached?.sprites.front_default ?? "";
  });
  useEffect(() => {
    if (url) return;
    // Construct API URL from name; cache lookup happens async to avoid setState-in-effect
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

export default function CollectionsPanel({ open, onClose }: Readonly<Props>) {
  const [tab, setTab] = useState<TabId>(0);
  const exportRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite, team, removeFromTeam, typeAces, clearTypeAce } =
    useCollectionsContext();
  const t = useTranslations();

  const favList = [...favorites];
  const exportFilenames: Record<TabId, string> = {
    0: "favorites.png",
    1: "team.png",
    2: "type-aces.png",
  };
  const exportTitles: Record<TabId, string> = {
    0: t.collections.exportFavorites,
    1: t.collections.exportTeam,
    2: t.collections.exportTypeAces,
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} className={styles.drawer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography className={styles.title}>{t.collections.title}</Typography>
        <IconButton size="small" onClick={onClose} aria-label={t.collections.title}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v: TabId) => setTab(v)}
        className={styles.tabs}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label={`${t.collections.tabFavorites} (${favList.length})`} />
        <Tab label={`${t.collections.tabTeam} (${team.length}/6)`} />
        <Tab label={t.collections.tabTypeAces} />
      </Tabs>

      {/* Tab content */}
      <Box className={styles.tabContent}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          className={styles.exportBtn}
          onClick={() => exportAreaAsImage(exportRef, exportFilenames[tab])}
        >
          {t.collections.exportBtn}
        </Button>

        <Box ref={exportRef} className={styles.exportArea}>
          <Typography className={styles.exportTitle}>{exportTitles[tab]}</Typography>

          {/* Favorites tab */}
          {tab === 0 && (
            favList.length === 0 ? (
              <Typography className={styles.emptyState}>
                {t.collections.emptyFavorites}
              </Typography>
            ) : (
              <Box className={styles.miniGrid}>
                {favList.map((name) => (
                  <MiniCard
                    key={name}
                    name={name}
                    removeLabel={t.collections.tabFavorites}
                    onRemove={() => toggleFavorite(name)}
                  />
                ))}
              </Box>
            )
          )}

          {/* Team tab */}
          {tab === 1 && (
            team.length === 0 ? (
              <Typography className={styles.emptyState}>
                {t.collections.emptyTeam}
              </Typography>
            ) : (
              <Box className={styles.miniGrid}>
                {team.map((name) => (
                  <MiniCard
                    key={name}
                    name={name}
                    removeLabel={t.collections.tabTeam}
                    onRemove={() => removeFromTeam(name)}
                  />
                ))}
              </Box>
            )
          )}

          {/* Type Aces tab */}
          {tab === 2 && (
            <Box className={styles.aceGrid}>
              {TYPE_NAMES.map((typeName) => (
                <AceSlot
                  key={typeName}
                  typeName={typeName}
                  pokemonName={typeAces[typeName]}
                  emptyLabel={t.collections.emptySlot}
                  removeLabel={t.collections.tabTypeAces}
                  onRemove={() => clearTypeAce(typeName)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
