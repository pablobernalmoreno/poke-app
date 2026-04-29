import CollectionsRoutePage from "@/components/CollectionsRoutes/CollectionsRoutePage";

export default async function TypeAcesPage({ params }: PageProps<"/[lang]/type-aces">) {
  const { lang } = await params;
  return <CollectionsRoutePage lang={lang} mode="type-aces" />;
}
