"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: PokemonType[];
}

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export default function PokemonGrid({
  pokemon,
}: Readonly<{ pokemon: PokemonDetails[] }>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {pokemon.map((p) => (
        <Card
          key={p.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 8,
            },
          }}
        >
          <CardMedia
            component="img"
            image={p.sprites.front_default}
            alt={p.name}
            sx={{ width: 120, height: 120, imageRendering: "pixelated" }}
          />
          <CardContent sx={{ width: "100%", pb: "12px !important" }}>
            <Typography variant="caption" color="text.secondary">
              #{String(p.id).padStart(3, "0")}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ textTransform: "capitalize", mb: 1 }}
            >
              {p.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {p.types.map(({ type }) => (
                <Chip
                  key={type.name}
                  label={type.name}
                  size="small"
                  sx={{
                    bgcolor: TYPE_COLORS[type.name] ?? "#888",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "capitalize",
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
