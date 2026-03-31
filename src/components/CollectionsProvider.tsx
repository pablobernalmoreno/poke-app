"use client";

import { createContext, useContext } from "react";
import { type CollectionsState, useCollections } from "@/hooks/useCollections";

const CollectionsContext = createContext<CollectionsState | null>(null);

export function CollectionsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const collections = useCollections();
  return (
    <CollectionsContext value={collections}>{children}</CollectionsContext>
  );
}

export function useCollectionsContext(): CollectionsState {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollectionsContext must be used within CollectionsProvider");
  return ctx;
}
