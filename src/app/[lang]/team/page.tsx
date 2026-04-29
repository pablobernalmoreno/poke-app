import CollectionsRoutePage from "@/components/CollectionsRoutes/CollectionsRoutePage";

export default async function TeamPage({ params }: PageProps<"/[lang]/team">) {
  const { lang } = await params;
  return <CollectionsRoutePage lang={lang} mode="team" />;
}
