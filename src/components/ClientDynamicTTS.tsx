"use client";
import dynamic from "next/dynamic";

import type { Language } from "@/lib/i18n";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/TTSPage"),
  { ssr: false }
);

export default function ClientDynamicTTS({
  initialLanguage,
}: {
  initialLanguage?: Language;
}) {
  return <DynamicComponentWithNoSSR initialLanguage={initialLanguage} />;
}
