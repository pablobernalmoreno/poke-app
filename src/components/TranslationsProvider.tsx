"use client";

import { createContext, useContext } from "react";
import { type Dictionary } from "@/lib/dictionaries";

const TranslationsContext = createContext<Dictionary | null>(null);

export function TranslationsProvider({
  dict,
  children,
}: Readonly<{ dict: Dictionary; children: React.ReactNode }>) {
  return (
    <TranslationsContext value={dict}>{children}</TranslationsContext>
  );
}

export function useTranslations(): Dictionary {
  const ctx = useContext(TranslationsContext);
  if (!ctx) throw new Error("useTranslations must be used within TranslationsProvider");
  return ctx;
}
