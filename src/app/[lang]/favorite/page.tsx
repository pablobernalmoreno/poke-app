import CollectionsRoutePage from "@/components/CollectionsRoutes/CollectionsRoutePage";

export default async function FavoritePage({ params }: PageProps<"/[lang]/favorite">) {
  const { lang } = await params;
  return <CollectionsRoutePage lang={lang} mode="favorite" />;
}
