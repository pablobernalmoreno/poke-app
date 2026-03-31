"use client";

import { usePathname, useRouter } from "next/navigation";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { LOCALES, type Locale } from "@/lib/locales";

export default function LanguageSwitcher({
  currentLang,
}: Readonly<{ currentLang: Locale }>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (_: React.MouseEvent, newLang: Locale | null) => {
    if (!newLang || newLang === currentLang) return;
    // Replace the current locale segment in the path
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={currentLang}
      onChange={handleChange}
      size="small"
      aria-label="Language"
      sx={{
        "& .MuiToggleButton-root": {
          color: "rgba(255,255,255,0.5)",
          borderColor: "rgba(255,255,255,0.15)",
          padding: "4px 10px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        },
        "& .MuiToggleButton-root.Mui-selected": {
          color: "#90caf9",
          backgroundColor: "rgba(144,202,249,0.1)",
        },
      }}
    >
      {LOCALES.map((locale) => (
        <ToggleButton key={locale} value={locale} aria-label={locale}>
          {locale.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
