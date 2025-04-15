"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/TTSPage"),
  { ssr: false }
);

export default function ClientDynamicTTS() {
  return <DynamicComponentWithNoSSR />;
}
