import ClientDynamicTTS from "@/components/ClientDynamicTTS";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { notFound } from "next/navigation";

const SUPPORTED = SUPPORTED_LANGUAGES.map((lang) => lang.code);

export function generateStaticParams() {
  return SUPPORTED.map((lang) => ({ lang }));
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!SUPPORTED.includes(lang)) {
    return notFound();
  }

  return <ClientDynamicTTS initialLanguage={lang as Language} />;
}
