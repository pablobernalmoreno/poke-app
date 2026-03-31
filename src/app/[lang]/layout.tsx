import { notFound } from "next/navigation";
import { getDictionary, hasLocale, LOCALES } from "@/lib/dictionaries";
import { TranslationsProvider } from "@/components/TranslationsProvider";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <TranslationsProvider dict={dict}>{children}</TranslationsProvider>
  );
}
